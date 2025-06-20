import ecc from '@bitcoinerlab/secp256k1';
import type { CaipNetwork, CaipNetworkId } from '@reown/appkit';
import type { BitcoinConnector } from '@reown/appkit-adapter-bitcoin';
import * as networks from '@reown/appkit/networks';
import * as bitcoin from 'bitcoinjs-lib';
import { Psbt } from 'bitcoinjs-lib';
import * as bitcoinPSBTUtils from 'bitcoinjs-lib/src/psbt/psbtutils';

bitcoin.initEccLib(ecc);

export const BitcoinUtil = {
  createSignPSBTParams(
    params: BitcoinUtil.CreateSignPSBTParams
  ): BitcoinConnector.SignPSBTParams {
    const network = this.getBitcoinNetwork(params.network.caipNetworkId);
    const payment = this.getPaymentByAddress(params.senderAddress, network);
    const psbt = new bitcoin.Psbt({ network });

    if (!payment.output) {
      throw new Error('Invalid payment output');
    }

    const amountSats = params.amount;
    const utxosWithSats = params.utxos.map((utxo) => ({
      ...utxo,
      value: utxo.value,
    }));

    const changeSats = this.calculateChange(
      utxosWithSats,
      amountSats,
      params.feeRate
    );

    if (changeSats < 0) {
      throw new Error('Insufficient funds');
    } else if (changeSats > 0) {
      psbt.addOutput({
        address: params.senderAddress,
        value: changeSats,
      });
    }

    for (const utxo of utxosWithSats) {
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: payment.output,
          value: utxo.value,
        },
      });
    }

    psbt.addOutput({
      address: params.recipientAddress,
      value: amountSats,
    });

    if (params.memo) {
      const data = Buffer.from(params.memo, 'utf8');
      const embed = bitcoin.payments.embed({ data: [data] });
      psbt.addOutput({
        script: embed.output!,
        value: 0,
      });
    }

    return {
      psbt: psbt.toBase64(),
      signInputs: Array.from({ length: utxosWithSats.length }, (_, i) => ({
        address: params.senderAddress,
        index: i,
        sighashTypes: [1], // SIGHASH_ALL
      })),
      broadcast: params.broadcast ?? false,
    };
  },

  async getUTXOs(
    address: string,
    networkId: CaipNetworkId
  ): Promise<BitcoinUtil.UTXO[]> {
    const isTestnet = this.isTestnet(networkId);
    try {
      const response = await fetch(
        `https://mempool.space${isTestnet ? '/testnet' : ''}/api/address/${address}/utxo`
      );
      if (!response.ok) throw new Error('UTXO fetch failed');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch UTXOs: ${(error as Error).message}`);
    }
  },

  async getFeeRate(networkId?: CaipNetworkId): Promise<number> {
    const isTestnet = networkId ? this.isTestnet(networkId) : false;
    try {
      const response = await fetch(
        `https://mempool.space${isTestnet ? '/testnet' : ''}/api/v1/fees/recommended`
      );
      const data = await response.json();
      return data?.fastestFee ?? 20;
    } catch (error) {
      console.error('Fee rate fallback to default');
      return 20;
    }
  },

  calculateChange(
    utxos: BitcoinUtil.UTXO[],
    amountSats: number,
    feeRate: number
  ): number {
    const inputSum = utxos.reduce((sum, utxo) => sum + utxo.value, 0);
    const estimatedSize =
      10 + 148 * utxos.length + 34 * (utxos.length > 0 ? 2 : 1);
    const feeSats = estimatedSize * feeRate;

    if (inputSum < amountSats + feeSats) {
      throw new Error('Insufficient funds including fee');
    }

    return inputSum - amountSats - feeSats;
  },

  isTestnet(networkId: CaipNetworkId): boolean {
    return networkId === networks.bitcoinTestnet.caipNetworkId;
  },

  getBitcoinNetwork(networkId: CaipNetworkId): bitcoin.Network {
    return this.isTestnet(networkId)
      ? bitcoin.networks.testnet
      : bitcoin.networks.bitcoin;
  },

  getPaymentByAddress(
    address: string,
    network: bitcoin.networks.Network
  ): bitcoin.payments.Payment {
    const output = bitcoin.address.toOutputScript(address, network);

    if (bitcoinPSBTUtils.isP2MS(output)) {
      return bitcoin.payments.p2ms({ output, network });
    } else if (bitcoinPSBTUtils.isP2PK(output)) {
      return bitcoin.payments.p2pk({ output, network });
    } else if (bitcoinPSBTUtils.isP2PKH(output)) {
      return bitcoin.payments.p2pkh({ output, network });
    } else if (bitcoinPSBTUtils.isP2WPKH(output)) {
      return bitcoin.payments.p2wpkh({ output, network });
    } else if (bitcoinPSBTUtils.isP2WSHScript(output)) {
      return bitcoin.payments.p2wsh({ output, network });
    } else if (bitcoinPSBTUtils.isP2SHScript(output)) {
      return bitcoin.payments.p2sh({ output, network });
    } else if (bitcoinPSBTUtils.isP2TR(output)) {
      return bitcoin.payments.p2tr({ output, network });
    }

    throw new Error('Unsupported payment type');
  },

  finalizePSBT: (signedPSBT: string): Psbt => {
    try {
      const psbt = Psbt.fromBase64(signedPSBT);

      // Validate if PSBT inputs are signed
      psbt.data.inputs.forEach((input, index) => {
        if (!input.partialSig || input.partialSig.length === 0) {
          throw new Error(`Input #${index} is not signed`);
        }
      });

      try {
        psbt.finalizeAllInputs();
      } catch (error: unknown) {
        console.error('Finalization error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to finalize PSBT: ${errorMessage}`);
      }

      return psbt;
    } catch (error) {
      console.error('Finalize PSBT Error:', error);
      throw new Error('errors.psbtFinalizeFailed');
    }
  },

  validatePSBT: (psbtBase64: string): boolean => {
    try {
      const psbt = Psbt.fromBase64(psbtBase64);

      // Log detailed input state
      psbt.data.inputs.forEach((input, index) => {
        console.log(`Input #${index} state:`, {
          hasPartialSig: !!input.partialSig,
          sigCount: input.partialSig?.length,
          input,
        });
      });

      // Check if any inputs exist
      if (psbt.data.inputs.length === 0) {
        console.error('No inputs found in PSBT');
        return false;
      }

      return psbt.data.inputs.every(
        (input) => input.partialSig && input.partialSig.length > 0
      );
    } catch (error) {
      console.error('PSBT Validation Error:', error);
      return false;
    }
  },

  broadcastTransaction: async (rawTx: string): Promise<any> => {
    try {
      const response = await fetch(
        'https://api.blockcypher.com/v1/btc/main/txs/push',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tx: rawTx }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Broadcast Transaction Error:', errorData);
        throw new Error('errors.broadcastFailed');
      }

      return await response.json();
    } catch (error) {
      console.error('Broadcast Transaction Error:', error);
      throw new Error('errors.broadcastFailed');
    }
  },
  convertToSatoshi(amount: number): number {
    return Math.round(amount * 1e8);
  },
};

export const getBalance = async (
  caipNetwork: CaipNetwork,
  address: string
): Promise<number> => {
  // get the utxos ... this is the list of unspent transactions that the sender has
  const utxos = await BitcoinUtil.getUTXOs(address, caipNetwork.caipNetworkId);
  // return the sum of the utxos ... The balance of the sender
  return utxos.reduce((sum, utxo) => sum + utxo.value, 0);
};

export namespace BitcoinUtil {
  export type CreateSignPSBTParams = {
    senderAddress: string;
    recipientAddress: string;
    network: CaipNetwork;
    amount: number;
    utxos: UTXO[];
    feeRate: number;
    memo?: string;
    broadcast?: boolean;
  };

  export type UTXO = {
    txid: string;
    vout: number;
    value: number;
    status: {
      confirmed: boolean;
      block_height?: number;
      block_hash?: string;
      block_time?: number;
    };
  };
}
