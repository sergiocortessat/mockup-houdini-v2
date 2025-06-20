import {
  type Provider,
  useAppKitConnection,
} from '@reown/appkit-adapter-solana/react';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getMint,
} from '@solana/spl-token';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useTranslations } from 'next-intl';

import { getSolanaConfirmation } from '@/features/swap/utils/solana-helpers';
import { Token } from '@/graphql/generated';

interface SolWalletTransactionParams {
  token: Token;
  amount: number;
  toAddress: string;
  handleTransactionSent: (walletName: string | undefined) => Promise<void>;
}

export function useSolWalletTransaction() {
  const t = useTranslations('swap.errors');
  const { address } = useAppKitAccount({ namespace: 'solana' });
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>('solana');

  const send = async ({
    token,
    amount,
    toAddress,
    handleTransactionSent,
  }: SolWalletTransactionParams) => {
    if (!toAddress) {
      throw new Error(t('recipientAddressRequired'));
    }

    if (amount <= 0) {
      throw new Error(t('amountMustBeGreaterThanZero'));
    }

    if (!connection || !walletProvider) {
      throw new Error(t('walletNotConnectedOrChainNotSelected'));
    }

    try {
      const publicKey = new PublicKey(address as `0x${string}`);
      const destinationPubKey = new PublicKey(toAddress);
      const isNativeToken = token.mainnet;

      let transaction = new Transaction();
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      if (isNativeToken) {
        // Native SOL transfer
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: destinationPubKey,
            lamports: amount * LAMPORTS_PER_SOL,
          })
        );
      } else {
        // SPL Token transfer
        if (!token.address) {
          throw new Error(t('tokenAddressRequired'));
        }
        const decimals = token.decimals;
        if (!decimals) {
          throw new Error(t('tokenDecimalsRequired'));
        }
        const tokenMintPubKey = new PublicKey(token.address);
        const fromTokenAccount = await getAssociatedTokenAddress(
          tokenMintPubKey,
          publicKey
        );
        const toTokenAccount = await getAssociatedTokenAddress(
          tokenMintPubKey,
          destinationPubKey
        );

        // Create associated token account for recipient if it doesn't exist
        const account = await connection?.getAccountInfo(toTokenAccount);
        if (!account) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              publicKey,
              toTokenAccount,
              destinationPubKey,
              tokenMintPubKey
            )
          );
        }

        transaction.add(
          createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            publicKey,
            amount * Math.pow(10, decimals)
          )
        );
      }

      const signature = await walletProvider?.sendTransaction(
        transaction,
        connection,
        {}
      );

      const confirmed = await getSolanaConfirmation(connection, signature);
      if (!confirmed) {
        throw new Error(t('transactionConfirmationFailed'));
      }
      await handleTransactionSent(walletProvider?.name);

      return signature;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error instanceof Error ? error : new Error(t('transactionFailed'));
    }
  };

  return { send };
}
