'use client';

import { CheckCircle, ChevronDown, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import OrderCardDetailHeader from '@/features/order-details/components/order-detail-card/order-detail-status/order-card-detail-header';
import { CompletedStep } from '@/features/order-details/components/order-detail-card/order-detail-status/steps/completed-step';
import { ConfirmingStep } from '@/features/order-details/components/order-detail-card/order-detail-status/steps/confirming-step';
import { Exchange2ReceivedStep } from '@/features/order-details/components/order-detail-card/order-detail-status/steps/exchange2-received-step';
import { SendingInTokenToExchange1StepPrivate } from '@/features/order-details/components/order-detail-card/order-detail-status/steps/sending-in-token-to-exchange1-step-private';
import { SendingToExchange2Step } from '@/features/order-details/components/order-detail-card/order-detail-status/steps/sending-to-exchange2-step';
import { SendingToReceiverAddressStep } from '@/features/order-details/components/order-detail-card/order-detail-status/steps/sending-to-receiver-address-step';
import { SwappingInTokenToAnonTokenStepPrivate } from '@/features/order-details/components/order-detail-card/order-detail-status/steps/swapping-in-token-to-anon-token-step-private';
import { SwappingToOutTokenStep } from '@/features/order-details/components/order-detail-card/order-detail-status/steps/swapping-to-outtoken-step';
import { SwappingToOutTokenStepPrivate } from '@/features/order-details/components/order-detail-card/order-detail-status/steps/swapping-to-outtoken-step-private';
import { WaitingStep } from '@/features/order-details/components/order-detail-card/order-detail-status/steps/waiting-step';
import {
  ORDER_STATUS,
  SWAP_STATUS_STEPS_PRIVATE,
  SWAP_STATUS_STEPS_STANDARD_AND_DEX,
} from '@/features/order-details/constants';
import { OrderStatusResult, Token } from '@/graphql/generated';

interface OrderDetailStatusProps {
  isPrivate?: boolean;
  orderData?: OrderStatusResult | null;
  outTokenData?: Token | null;
  inTokenData?: Token | null;
}

// Helper to render the correct step component
const renderStepComponent = ({
  step,
  orderData,
  outTokenData,
  inTokenData,
  isPrivate,
  isActive,
  isWaitingStepCompleted,
}: {
  step: number;
  orderData: OrderStatusResult | null;
  outTokenData?: Token | null;
  inTokenData?: Token | null;
  isPrivate: boolean;
  isActive: boolean;
  isWaitingStepCompleted?: boolean;
}) => {
  // For private flow, use new step components for steps 5-8
  if (isPrivate) {
    switch (step) {
      case 3:
        return (
          <SendingInTokenToExchange1StepPrivate inTokenData={inTokenData} />
        );
      case 4:
        return (
          <SwappingInTokenToAnonTokenStepPrivate inTokenData={inTokenData} />
        );
      case 5:
        return <SendingToExchange2Step />;
      case 6:
        return <Exchange2ReceivedStep />;
      case 7:
        return <SwappingToOutTokenStepPrivate outTokenData={outTokenData} />;
      case 8:
        return <SendingToReceiverAddressStep outTokenData={outTokenData} />;
      case 9:
        return <CompletedStep />;
    }
  }
  // Map new step numbers to components
  switch (step) {
    case 1:
      return (
        <WaitingStep
          orderData={orderData}
          isActive={isActive}
          isStepCompleted={isWaitingStepCompleted}
        />
      );
    case 2:
      return <ConfirmingStep orderData={orderData} />;
    case 3:
      return (
        <SwappingToOutTokenStep
          inTokenData={inTokenData}
          outTokenData={outTokenData}
        />
      );
    case 4:
      return <SendingToReceiverAddressStep outTokenData={outTokenData} />;
    case 5:
      return <CompletedStep />;
    default:
      return null;
  }
};

const OrderDetailStatus = ({
  orderData,
  outTokenData,
  inTokenData,
}: OrderDetailStatusProps) => {
  const isPrivate = orderData?.anonymous ?? false;
  const isDex = orderData?.isDex ?? false;
  const t = useTranslations('orderDetails.status');
  const [isOpen, setIsOpen] = useState(false);
  const isCompleted = orderData?.status === ORDER_STATUS.COMPLETED;

  // New step logic
  let steps = isPrivate
    ? SWAP_STATUS_STEPS_PRIVATE
    : SWAP_STATUS_STEPS_STANDARD_AND_DEX;
  let displayStatus = 1;

  if (isPrivate) {
    // Private flow: steps 1-4 use inStatus 1-4, steps 5-9 use outStatus 2-6 (step = 4 + outStatus)
    const inStatus = orderData?.inStatus ?? 1;
    const outStatus = orderData?.outStatus ?? 1;
    if (inStatus < 5) {
      displayStatus = inStatus;
    } else {
      displayStatus = 4 + outStatus;
    }
  } else if (isDex) {
    displayStatus = (orderData?.status ?? 0) + 1;
  } else {
    // Standard/DEX: use inStatus directly
    displayStatus = orderData?.inStatus ?? 1;
  }

  return (
    <div className="relative mb-6 w-full">
      {orderData?.houdiniId && <OrderCardDetailHeader orderData={orderData} />}
      <div className="absolute top-23 right-0 left-0">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            {!isOpen && (
              <Button
                variant="ghost"
                size="xl"
                className="border-background w-full justify-start border-3 bg-neutral-900 px-2 sm:px-4"
                aria-label={t('statusTracker')}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-center sm:w-10">
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </span>
                <div className="text-label-xs sm:text-label-md w-full">
                  {renderStepComponent({
                    step: displayStatus,
                    orderData: orderData ?? null,
                    isActive: true,
                    outTokenData,
                    inTokenData,
                    isPrivate,
                  })}
                </div>
                <ChevronDown className="h-5 w-5 sm:ml-2" aria-hidden="true" />
              </Button>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-background flex w-full flex-col gap-6 rounded-4xl border-3 bg-neutral-900 p-4 shadow-lg">
              <Stepper
                orientation="vertical"
                value={displayStatus}
                defaultValue={displayStatus}
              >
                {steps.map(({ step }) => {
                  const isCurrentStep = step === displayStatus;
                  const shouldShowLoading =
                    isCurrentStep && step !== steps.length;
                  return (
                    <StepperItem
                      key={step}
                      step={step}
                      loading={shouldShowLoading}
                      completed={
                        step === steps.length && displayStatus === steps.length
                      }
                      className="relative items-start [&:not(:last-child)]:flex-1"
                    >
                      <StepperTrigger className="w-full items-center pb-6 last:pb-0">
                        <StepperIndicator className="w-11 py-3 group-data-[state=inactive]/step:text-transparent data-[state=active]:bg-neutral-800 data-[state=completed]:bg-green-950 data-[state=completed]:text-green-500" />
                        <StepperTitle className="text-label-xs sm:text-label-md w-full group-data-[state=inactive]/step:text-neutral-500">
                          {renderStepComponent({
                            step,
                            orderData: orderData ?? null,
                            isActive: step <= displayStatus,
                            outTokenData,
                            inTokenData,
                            isPrivate,
                            isWaitingStepCompleted: isPrivate
                              ? displayStatus > 1
                              : displayStatus > 1,
                          })}
                        </StepperTitle>
                      </StepperTrigger>
                      {step < steps.length && (
                        <StepperSeparator className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-[1.375rem] -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)] group-data-[state=completed]/step:bg-neutral-800" />
                      )}
                    </StepperItem>
                  );
                })}
              </Stepper>
              <Button
                size="xl"
                aria-label={t('statusTracker')}
                onClick={() => setIsOpen(false)}
              >
                {t('close')}
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default OrderDetailStatus;
