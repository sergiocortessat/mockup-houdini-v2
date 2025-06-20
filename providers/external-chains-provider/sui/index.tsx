import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';

const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
});

export const SuiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
      <WalletProvider
        theme={{
          blurs: {
            modalOverlay: 'rgba(3, 7, 18, 0.1)',
          },
          backgroundColors: {
            primaryButton: 'var(--primary)',
            primaryButtonHover: 'var(--primary)',
            outlineButtonHover: 'var(--secondary)',
            walletItemHover: 'var(--secondary)',
            walletItemSelected: 'var(--secondary)',
            modalOverlay:
              'color-mix(in srgb, var(--background) 70%, transparent)',
            modalPrimary: 'var(--card)',
            modalSecondary: 'var(--card)',
            iconButton: 'var(--secondary)',
            iconButtonHover: 'var(--primary)',
            dropdownMenu: 'var(--card)',
            dropdownMenuSeparator: 'var(--border)',
          },
          borderColors: {
            outlineButton: 'var(--border)',
          },
          colors: {
            primaryButton: 'var(--primary-foreground)',
            outlineButton: 'var(--primary-foreground)',
            body: 'var(--foreground)',
            bodyMuted: 'var(--muted-foreground)',
            bodyDanger: 'var(--destructive)',
            iconButton: 'var(--foreground)',
          },
          radii: {
            small: 'var(--radius-sm)',
            medium: 'var(--radius-md)',
            large: 'var(--radius-lg)',
            xlarge: 'var(--radius-xl)',
          },
          shadows: {
            primaryButton: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            walletItemSelected: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          },
          fontWeights: {
            normal: 'var(--font-weight-regular)',
            medium: 'var(--font-weight-medium)',
            bold: 'var(--font-weight-bold)',
          },
          fontSizes: {
            small: '0.875rem',
            medium: '1rem',
            large: '1.125rem',
            xlarge: '1.25rem',
          },
          typography: {
            fontFamily: 'var(--font-inter)',
            fontStyle: 'normal',
            lineHeight: 'var(--line-height-normal)',
            letterSpacing: 'var(--letter-spacing-normal)',
          },
        }}
      >
        {children}
      </WalletProvider>
    </SuiClientProvider>
  );
};
