import { ChainNamespace } from '@reown/appkit-common';
import { QrCode, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import QRCodeModal from '@/features/order-details/components/order-detail-card/qr-code-modal';
import { useWalletTransaction } from '@/features/swap/hooks/wallet-transactions/use-wallet-transaction';
import { ChainKind } from '@/features/swap/types';
import { HandleWalletConnectionProps } from '@/features/wallet/constants';
import { useSupportedChains } from '@/features/wallet/hooks/use-supported-chains';
import {
  OrderStatusResult,
  Token,
  useUpdateOrderWalletInfoMutation,
} from '@/graphql/generated';
import { useUserWallets } from '@/providers/user-wallets-provider';

interface ActionButtonsProps {
  address?: string | null;
  amount?: string | null | number | null;
  token?: Token | null;
  network?: ChainKind | null | undefined;
  orderData?: OrderStatusResult | null;
  handleWalletConnection: (props: HandleWalletConnectionProps) => void;
}

const OrderDetailActionButtons = ({
  address,
  amount,
  token,
  network,
  orderData,
  handleWalletConnection,
}: ActionButtonsProps) => {
  const t = useTranslations('orderDetails');
  const tWallet = useTranslations('wallet');

  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  const { getIsWalletConnected } = useUserWallets();
  const { chains } = useSupportedChains();
  const [updateWalletInfo] = useUpdateOrderWalletInfoMutation();
  const fromChain = chains?.find(
    (chain) =>
      chain.kind === token?.chainData?.kind ||
      (token?.chainData.chainId && chain.chainId === token?.chainData.chainId)
  );

  const loadInitialState = () => {
    if (!orderData?.houdiniId) {
      return false;
    }
    const storedData = localStorage.getItem(orderData?.houdiniId);
    const data = JSON.parse(storedData || '{}');
    if (data && typeof data.paid === 'boolean') {
      return data.paid;
    }
    return false;
  };
  const [isPaid, setIsPaid] = useState(loadInitialState());

  const handleTransactionSent = async (walletName: string | undefined) => {
    if (!orderData?.houdiniId) {
      return;
    }
    localStorage.setItem(orderData?.houdiniId, JSON.stringify({ paid: true }));
    setIsPaid(true);
    if (walletName && orderData?.houdiniId) {
      await updateWalletInfo({
        variables: {
          walletInfo: walletName,
          id: orderData?.houdiniId,
        },
      });
    }
  };
  const { startTransaction, isProcessing } = useWalletTransaction({
    token: token as Token,
    network: network as ChainKind,
    amount: amount ? Number(amount) : 0,
    address: address || '',
    senderTag: orderData?.senderTag,
    handleTransactionSent,
  });

  useEffect(() => {
    if (!orderData?.houdiniId) {
      return;
    }
    const storedData = localStorage.getItem(orderData?.houdiniId);
    if (!storedData) {
      localStorage.setItem(
        orderData?.houdiniId,
        JSON.stringify({ paid: false })
      );
    }
  }, [orderData?.houdiniId]);
  const isWalletConnected = network ? getIsWalletConnected(network) : false;

  const handleOpenInWallet = async () => {
    if (!isWalletConnected) {
      handleWalletConnection({ chainNamespace: network as ChainKind });
      return;
    }

    if (!address || !amount || !token || !network) {
      console.error('Missing required parameters for wallet transaction');
      return;
    }

    try {
      await startTransaction();
    } catch (error) {
      console.error('Failed to open in wallet:', error);
    }
  };

  const buttonText = useMemo(() => {
    if (!isWalletConnected) {
      return tWallet('connectWallet');
    }
    if (isPaid) {
      return t('swapInProgress');
    }
    if (isProcessing && !isPaid) {
      return t('confirmOnWallet');
    }
    return t('openInWallet');
  }, [isProcessing, isPaid, isWalletConnected, t, tWallet]);

  const handleOpenQRCode = () => {
    setIsQRCodeModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row">
        <Button
          variant="secondary"
          className="w-full"
          size="sm"
          onClick={handleOpenQRCode}
        >
          <QrCode size={16} />
          {t('qrCode')}
        </Button>
        {fromChain?.isSupportedWalletConnect ? (
          <Button
            variant="secondary"
            className="w-full"
            size="sm"
            onClick={handleOpenInWallet}
            disabled={
              isProcessing ||
              !address ||
              !amount ||
              !token ||
              !network ||
              isPaid
            }
          >
            <Wallet size={16} />
            {buttonText}
          </Button>
        ) : null}
      </div>
      <QRCodeModal
        isOpen={isQRCodeModalOpen}
        onClose={() => setIsQRCodeModalOpen(false)}
        address={address ?? ''}
      />
    </>
  );
};

export default OrderDetailActionButtons;
