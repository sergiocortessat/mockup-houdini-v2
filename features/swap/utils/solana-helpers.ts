import { isVersionedTransaction } from '@solana/wallet-adapter-base';
import {
  AddressLookupTableAccount,
  Commitment,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  SimulatedTransactionResponse,
  Transaction,
  TransactionInstruction,
  VersionedTransaction,
} from '@solana/web3.js';

import { MAX_RETRIES } from '@/features/swap/constants';

const DEFAULT_PRIORITY_FEE_PERCENTILE = 0.5;
const DEFAULT_PERCENTILE_MULTIPLE = 1;
const DEFAULT_MIN_PRIORITY_FEE = 1;
const DEFAULT_MAX_PRIORITY_FEE = 1e9;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isEmptyObject = (value: object | null | undefined) => {
  if (value === null || value === undefined) {
    return true;
  }

  // Check all property keys for any own prop
  for (const key in value) {
    if (value.hasOwnProperty.call(value, key)) {
      return false;
    }
  }

  return true;
};

// Checks response logs for known errors.
// Returns when the first error is encountered.
function checkNeedRetrySimulation(
  response: SimulatedTransactionResponse
): boolean {
  const errors: any = {};

  // This error occur when the blockhash included in a transaction is not deemed to be valid
  // when a validator processes a transaction. We can retry the simulation to get a valid blockhash.
  if (response.err === 'BlockhashNotFound') {
    errors['BlockhashNotFound'] =
      'Blockhash not found during simulation. Trying again.';
  }

  // Check the response logs for any known errors
  if (response.logs) {
    for (const line of response.logs) {
      // In some cases which aren't deterministic, like a slippage error, we can retry the
      // simulation a few times to get a successful response.
      if (line.includes('SlippageToleranceExceeded')) {
        errors['SlippageToleranceExceeded'] =
          'Slippage failure during simulation. Trying again.';
      }

      // In this case a require_gte expression was violated during a Swap instruction.
      // We can retry the simulation to get a successful response.
      if (line.includes('RequireGteViolated')) {
        errors['RequireGteViolated'] =
          'Swap instruction failure during simulation. Trying again.';
      }
    }
  }

  // No known simulation errors found
  if (isEmptyObject(errors)) {
    return false;
  }

  console.table(errors);
  return true;
}

// This will throw if the simulation fails
export async function createPriorityFeeInstructions(
  connection: Connection,
  transaction: Transaction | VersionedTransaction,
  commitment?: Commitment
) {
  let unitsUsed = 200_000;
  let simulationAttempts = 0;

  simulationLoop: while (true) {
    if (
      isVersionedTransaction(transaction) &&
      !transaction.message.recentBlockhash
    ) {
      // This is required for versioned transactions
      // SimulateTransaction throws if recentBlockhash is an empty string
      const { blockhash } = await connection.getLatestBlockhash(commitment);
      transaction.message.recentBlockhash = blockhash;
    }

    const response = await (isVersionedTransaction(transaction)
      ? connection.simulateTransaction(transaction, {
          commitment,
          replaceRecentBlockhash: true,
        })
      : connection.simulateTransaction(transaction));

    if (response.value.err) {
      if (checkNeedRetrySimulation(response.value)) {
        // Number of attempts will be at most 5 for known errors
        if (simulationAttempts < 5) {
          simulationAttempts++;
          await sleep(1000);
          continue simulationLoop;
        }
      } else if (simulationAttempts < 3) {
        // Number of attempts will be at most 3 for unknown errors
        simulationAttempts++;
        await sleep(1000);
        continue simulationLoop;
      }
      // Still failing after multiple attempts for both known and unknown errors
      // We should throw in that case
      throw new Error(
        `Simulation failed: ${JSON.stringify(response.value.err)}\nLogs:\n${(
          response.value.logs || []
        ).join('\n  ')}`
      );
    } else {
      // Simulation was successful
      if (response.value.unitsConsumed) {
        unitsUsed = response.value.unitsConsumed;
      }
      break;
    }
  }

  const instructions: TransactionInstruction[] = [];
  instructions.push(
    ComputeBudgetProgram.setComputeUnitLimit({
      // Set compute budget to 120% of the units used in the simulated transaction
      units: unitsUsed * 1.2,
    })
  );

  const priorityFee = await determinePriorityFee(connection, transaction, 0.95);
  instructions.push(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityFee })
  );
  return instructions;
}

/**
 * A helper function to determine the priority fee to use for a transaction
 *
 * @param connection Solana/web3.js Connection to the network
 * @param transaction The transaction to determine the priority fee for
 * @param percentile The percentile of recent fees to use
 * @param multiple The multiple to apply to the percentile fee
 * @param minPriorityFee The minimum priority fee to use
 * @param maxPriorityFee The maximum priority fee to use
 * @returns the priority fee to use according to the recent transactions and the given parameters
 */
export async function determinePriorityFee(
  connection: Connection,
  transaction: Transaction | VersionedTransaction,
  percentile: number = DEFAULT_PRIORITY_FEE_PERCENTILE,
  multiple: number = DEFAULT_PERCENTILE_MULTIPLE,
  minPriorityFee: number = DEFAULT_MIN_PRIORITY_FEE,
  maxPriorityFee: number = DEFAULT_MAX_PRIORITY_FEE
): Promise<number> {
  // https://twitter.com/0xMert_/status/1768669928825962706

  // Start with min fee
  let fee = minPriorityFee;

  // Figure out which accounts need write lock
  let lockedWritableAccounts = [];
  if (isVersionedTransaction(transaction)) {
    const luts = (
      await Promise.all(
        transaction.message.addressTableLookups.map((acc) =>
          connection.getAddressLookupTable(acc.accountKey)
        )
      )
    )
      .map((lut) => lut.value)
      .filter((val) => val !== null) as AddressLookupTableAccount[];
    const msg = transaction.message;
    const keys = msg.getAccountKeys({
      addressLookupTableAccounts: luts ?? undefined,
    });
    lockedWritableAccounts = msg.compiledInstructions
      .flatMap((ix) => ix.accountKeyIndexes)
      .map((k) => (msg.isAccountWritable(k) ? keys.get(k) : null))
      .filter((k) => k !== null) as PublicKey[];
  } else {
    lockedWritableAccounts = transaction.instructions
      .flatMap((ix) => ix.keys)
      .map((k) => (k.isWritable ? k.pubkey : null))
      .filter((k) => k !== null) as PublicKey[];
  }

  try {
    const recentFeesResponse = await connection.getRecentPrioritizationFees({
      lockedWritableAccounts,
    });

    if (recentFeesResponse) {
      // Sort fees to find the appropriate percentile
      const recentFees = recentFeesResponse
        .map((dp) => dp.prioritizationFee)
        .sort((a, b) => a - b);

      // Find the element in the distribution that matches the percentile requested
      const idx = Math.ceil(recentFees.length * percentile);
      if (recentFees.length > idx) {
        let percentileFee = recentFees[idx]!;

        // Apply multiple if provided
        if (multiple > 0) percentileFee *= multiple;

        fee = Math.max(fee, percentileFee);
      }
    }
  } catch (e) {
    console.error('Error fetching Solana recent fees', e);
  }

  // Bound the return value by the parameters pased
  return Math.min(Math.max(fee, minPriorityFee), maxPriorityFee);
}

export function encodeNumberToArrayLE(
  num: number,
  arraySize: number
): Uint8Array {
  const result = new Uint8Array(arraySize);
  for (let i = 0; i < arraySize; i++) {
    result[i] = Number(num & 0xff);
    num >>= 8;
  }

  return result;
}

export function updatePriorityFee(
  tx: VersionedTransaction,
  computeUnitPrice: number,
  computeUnitLimit?: number
) {
  const computeBudgetOfset = 1;
  const computeUnitPriceData = tx.message.compiledInstructions[1].data;
  const encodedPrice = encodeNumberToArrayLE(computeUnitPrice, 8);
  for (let i = 0; i < encodedPrice.length; i++) {
    computeUnitPriceData[i + computeBudgetOfset] = encodedPrice[i];
  }

  if (computeUnitLimit) {
    const computeUnitLimitData = tx.message.compiledInstructions[0].data;
    const encodedLimit = encodeNumberToArrayLE(computeUnitLimit, 4);
    for (let i = 0; i < encodedLimit.length; i++) {
      computeUnitLimitData[i + computeBudgetOfset] = encodedLimit[i];
    }
  }
}

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

// Add fallback RPC endpoints
const FALLBACK_RPC_ENDPOINTS = [SOLANA_RPC_URL] as const;

// Helper to create a new connection with fallback
const createFallbackConnection = (index = 0): Connection | null => {
  const endpoint = FALLBACK_RPC_ENDPOINTS[index];
  return endpoint ? new Connection(endpoint, 'confirmed') : null;
};

export const getSolanaConfirmation = async (
  connection: Connection,
  tx: string,
  retries = 0,
  onComplete?: () => void,
  rpcAttempt = 0
): Promise<boolean> => {
  try {
    await sleep(Math.min(1000 * Math.pow(2, retries), 10000)); // Exponential backoff

    const result = await connection.getSignatureStatus(tx);
    console.log('txresult', result, retries);

    const confirmed = Boolean(
      result.value?.confirmationStatus === 'finalized' &&
        result.value?.err === null
    );

    if (confirmed) {
      onComplete?.();
      return true;
    }

    if (retries < MAX_RETRIES) {
      return getSolanaConfirmation(
        connection,
        tx,
        retries + 1,
        onComplete,
        rpcAttempt
      );
    }

    // Try fallback RPC if available
    const fallbackConnection = createFallbackConnection(rpcAttempt + 1);
    if (fallbackConnection && rpcAttempt < FALLBACK_RPC_ENDPOINTS.length - 1) {
      console.log('Trying fallback RPC endpoint...');
      return getSolanaConfirmation(
        fallbackConnection,
        tx,
        0, // Reset retries for new RPC
        onComplete,
        rpcAttempt + 1
      );
    }

    return false;
  } catch (error) {
    console.error('Solana confirmation error:', error);

    // Try fallback on error
    const fallbackConnection = createFallbackConnection(rpcAttempt + 1);
    if (fallbackConnection && rpcAttempt < FALLBACK_RPC_ENDPOINTS.length - 1) {
      console.log('Switching to fallback RPC after error...');
      return getSolanaConfirmation(
        fallbackConnection,
        tx,
        0,
        onComplete,
        rpcAttempt + 1
      );
    }

    return false;
  }
};
