'use client';

import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BASE_URLS } from '@/constants/urls';
import { QRCodeModal } from '@/features/payment-link/components/qr-code-modal';
import { TokenAmountInput } from '@/features/payment-link/components/token-amount-input';
import { Token, useGetTokenByIdQuery } from '@/graphql/generated';

export function PaymentGeneratorPanel({
  basePath,
}: {
  basePath: string | null;
}) {
  const t = useTranslations('paymentLinkGenerator');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [amountOut, setAmountOut] = useQueryState('amountOut');
  const [tokenOut, setTokenOut] = useQueryState('tokenOut');
  const [address, setAddress] = useQueryState('address');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch token data when tokenOut changes
  const { data: tokenData, loading: isTokenLoading } = useGetTokenByIdQuery({
    variables: { id: tokenOut || '' },
    skip: !tokenOut,
  });

  const handleAmountChange = (value: string) => {
    setAmountOut(value);
    setGeneratedLink(null);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    setGeneratedLink(null);
  };

  const generateLink = () => {
    // Only generate if we have valid values
    if (!tokenOut || !amountOut || !address || amountOut === '0') {
      setGeneratedLink(null);
      return;
    }

    const params = new URLSearchParams({
      address: address || '',
      tokenOut: tokenOut || '',
      amountOut: amountOut || '',
    });

    const link = `${basePath ? basePath : BASE_URLS.APP}/?${params.toString()}`;
    setGeneratedLink(link);
    setIsModalOpen(true);
  };

  // Check if we can show the generate button
  const canGenerate = Boolean(
    tokenData?.token &&
      amountOut &&
      Number(amountOut) > 0 &&
      address &&
      !isTokenLoading
  );

  return (
    <>
      <Card className="w-full max-w-[640px] space-y-8 p-8">
        <h2 className="text-heading-lg">{t('title')}</h2>

        <div className="space-y-6">
          <TokenAmountInput
            label={t('tokenToReceive')}
            value={amountOut || ''}
            onAmountChange={handleAmountChange}
            onTokenChange={setTokenOut}
            token={tokenData?.token as Token | undefined}
            isTokenLoading={isTokenLoading}
            className="bg-[#111827]"
          />

          <Input
            placeholder={t('enterWalletAddress')}
            value={address || ''}
            onChange={handleAddressChange}
            className="h-14"
          />

          <Button
            className="mt-4 w-full"
            size="lg"
            onClick={generateLink}
            disabled={!canGenerate}
          >
            {isTokenLoading ? t('generating') : t('generateLink')}
          </Button>
        </div>
      </Card>

      {generatedLink && (
        <QRCodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          link={generatedLink}
        />
      )}
    </>
  );
}
