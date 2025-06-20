'use client';

import { useAppKit, useAppKitNetwork } from '@reown/appkit/react';
import { useTonConnectModal } from '@tonconnect/ui-react';
import { useState } from 'react';

import useNetworkStore from '@/features/swap/stores/use-network-store';
import { ChainKind } from '@/features/swap/types';
import { SuiModal } from '@/features/wallet/components/sui-modal';
import { TonModal } from '@/features/wallet/components/ton-modal';
import { TronAccountModal } from '@/features/wallet/components/tron-account-modal';
import {
  HandleWalletConnectionProps,
  HoudiniChain,
} from '@/features/wallet/constants';
import { useSupportedChains } from '@/features/wallet/hooks/use-supported-chains';
import { networks } from '@/providers/reown-wallet-provider/reown-wallet-provider-networks';

interface WalletConnectionHandlerProps {
  children: (props: {
    handleWalletConnection: (props: HandleWalletConnectionProps) => void;
    handleAccountConnection: (chainNamespace: ChainKind | undefined) => void;
    handleSwitchNetwork: (network: HoudiniChain) => void;
  }) => React.ReactNode;
}

export const WalletConnectionHandler = ({
  children,
}: WalletConnectionHandlerProps) => {
  const { open } = useAppKit();
  const { switchNetwork } = useAppKitNetwork();
  const setSelectedNetwork = useNetworkStore(
    (state) => state.setSelectedNetwork
  );
  const { chains } = useSupportedChains();
  const [showTronModal, setShowTronModal] = useState(false);
  const [showSuiConnectModal, setShowSuiConnectModal] = useState(false);
  const [showSuiConnectedModal, setShowSuiConnectedModal] = useState(false);
  const [showTonModal, setShowTonModal] = useState(false);
  const { open: openTonConnectModal } = useTonConnectModal();

  const handleWalletConnection = ({
    chainNamespace,
    evmChainId,
  }: {
    chainNamespace: ChainKind | undefined;
    evmChainId?: number | undefined;
  }) => {
    if (!chainNamespace) return;
    const networkToSwitch = chains?.find(
      (chain) =>
        chain.chainId === evmChainId ||
        (chain.kind !== ChainKind.EVM && chain.kind === chainNamespace)
    );
    if (networkToSwitch) {
      setSelectedNetwork(networkToSwitch);
    }
    switch (chainNamespace) {
      case ChainKind.TRON:
        setShowTronModal(true);
        break;
      case ChainKind.SOLANA:
        open({ view: 'Connect', namespace: 'solana' });
        break;
      case ChainKind.EVM:
        open({ view: 'Connect', namespace: 'eip155' });
        if (evmChainId) {
          const reownNetwork = networks.find(
            (chain) => chain.id === evmChainId
          );

          if (reownNetwork) {
            switchNetwork(reownNetwork);
          }
        }
        break;
      case ChainKind.BTC:
        open({ view: 'Connect', namespace: 'bip122' });
        break;
      case ChainKind.SUI:
        setShowSuiConnectModal(true);
        setShowSuiConnectedModal(false);
        break;
      case ChainKind.TON:
        openTonConnectModal();
        break;
    }
  };

  const handleAccountConnection = (chainNamespace: ChainKind | undefined) => {
    if (!chainNamespace) return;
    switch (chainNamespace) {
      case ChainKind.TRON:
        setShowTronModal(true);
        break;
      case ChainKind.SOLANA:
        open({ view: 'Account', namespace: 'solana' });
        break;
      case ChainKind.EVM:
        open({ view: 'Account', namespace: 'eip155' });
        break;
      case ChainKind.BTC:
        open({ view: 'Account', namespace: 'bip122' });
        break;
      case ChainKind.SUI:
        setShowSuiConnectedModal(true);
        setShowSuiConnectModal(false);
        break;
      case ChainKind.TON:
        setShowTonModal(true);
        break;
    }
  };

  const handleSwitchNetwork = (network: HoudiniChain) => {
    switch (network.kind) {
      case ChainKind.EVM:
        const networkToSwitch = networks.find(
          (chain) => chain.id === network.chainId
        );
        if (networkToSwitch) {
          switchNetwork(networkToSwitch);
          setSelectedNetwork(network);
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      {children({
        handleWalletConnection,
        handleAccountConnection,
        handleSwitchNetwork,
      })}
      <SuiModal
        isOpenConnectModal={showSuiConnectModal}
        isOpenConnectedModal={showSuiConnectedModal}
        onCloseConnectModal={() => setShowSuiConnectModal(false)}
        onCloseConnectedModal={() => setShowSuiConnectedModal(false)}
      />
      <TonModal isOpen={showTonModal} onClose={() => setShowTonModal(false)} />
      {showTronModal ? (
        <TronAccountModal
          isOpen={showTronModal}
          onClose={() => setShowTronModal(false)}
        />
      ) : null}
    </>
  );
};
