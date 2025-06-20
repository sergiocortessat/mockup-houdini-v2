'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  Stepper,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import OrderDetailCard from '@/features/order-details/components/order-detail-card';
import { OrderStatusResult, Token } from '@/graphql/generated';
import { cn } from '@/lib/utils';

interface MultiOrdersProps {
  orders?: OrderStatusResult[] | null;
}

export const MultiOrders = ({ orders }: MultiOrdersProps) => {
  const t = useTranslations('orderDetails.multiOrders');
  const firstOrderId = orders?.[0]?.id;
  const [activeTab, setActiveTab] = useState(`order-${firstOrderId}`);
  const activeOrderIndex =
    orders?.findIndex((order) => `order-${order.id}` === activeTab) ?? 0;

  if (!orders?.length) return null;

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full gap-6"
    >
      <Stepper value={activeOrderIndex + 1} defaultValue={activeOrderIndex + 1}>
        {orders.map((order, index) => (
          <StepperItem
            key={order.id}
            step={index + 1}
            className="[&:not(:last-child)]:flex-1"
          >
            <StepperTrigger
              className={cn(
                'w-fit cursor-pointer justify-center rounded-full border border-neutral-800 px-4 py-2 text-neutral-400 transition-colors',
                `order-${order.id}` === activeTab &&
                  'bg-card text-card-foreground border-neutral-700 shadow-sm'
              )}
              onClick={() => {
                setActiveTab(`order-${order.id}`);
              }}
            >
              <StepperTitle className="text-label-md">
                {t('order')} {index + 1}
              </StepperTitle>
            </StepperTrigger>
            {index < orders.length - 1 && (
              <StepperSeparator className="group-data-[state=completed]/step:bg-neutral-800" />
            )}
          </StepperItem>
        ))}
      </Stepper>
      <AnimatePresence mode="wait">
        {orders.map((order) => (
          <TabsContent key={order.id} value={`order-${order.id}`}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col gap-2"
            >
              <OrderDetailCard
                orderData={order}
                tokenData={{
                  tokenIn: order.inToken ?? null,
                  tokenOut: order.outToken ?? null,
                }}
              />
            </motion.div>
          </TabsContent>
        ))}
      </AnimatePresence>
    </Tabs>
  );
};
