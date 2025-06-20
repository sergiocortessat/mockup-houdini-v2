'use client';

import { useAppKitAccount } from '@reown/appkit/react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HistoryQuery, useHistoryQuery } from '@/graphql/generated';
import { formatTruncatedAddress } from '@/lib/utils';

enum HistoryType {
  All = 'all',
  Staked = 'staked',
  Compounded = 'compounded',
}

const History = () => {
  const t = useTranslations('analytics');
  const { address, isConnected } = useAppKitAccount();
  const { data: historyQueryData, loading: historyLoading } = useHistoryQuery({
    variables: {
      address: address ?? '',
    },
    skip: !address,
  });

  const historyData = historyQueryData?.history || [];

  return (
    <Card className="h-full max-w-full overflow-y-scroll border p-6">
      <Tabs defaultValue="all" className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-heading-sm">{t('history')}</h3>
          <TabsList className="rounded-full border bg-transparent">
            <TabsTrigger
              className="data-[state=active]:rounded-full data-[state=active]:bg-neutral-800"
              value={HistoryType.All}
            >
              {t('all')}
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:rounded-full data-[state=active]:bg-neutral-800"
              value={HistoryType.Staked}
            >
              {t('staked')}
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:rounded-full data-[state=active]:bg-neutral-800"
              value={HistoryType.Compounded}
            >
              {t('compounded')}
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="w-full">
          <TabsContent value={HistoryType.All} className="">
            <HistoryTable
              data={historyData}
              loading={historyLoading}
              isConnected={isConnected}
            />
          </TabsContent>
          <TabsContent value={HistoryType.Staked}>
            <HistoryTable
              data={historyData.filter((item) => item.name === 'Staked')}
              loading={historyLoading}
              isConnected={isConnected}
            />
          </TabsContent>
          <TabsContent value={HistoryType.Compounded}>
            <HistoryTable
              data={historyData.filter((item) => item.name === 'Compounded')}
              loading={historyLoading}
              isConnected={isConnected}
            />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

function HistoryTable({
  data,
  loading,
  isConnected,
}: {
  data: HistoryQuery['history'];
  loading: boolean;
  isConnected: boolean;
}) {
  const t = useTranslations('analytics');
  const formatDate = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };

  if (loading) {
    return <Skeleton className="h-[100px] w-full md:h-[200px]" />;
  }

  if (!isConnected || !data) {
    return <div className="p-4 text-center">{t('noData')}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('type')}</TableHead>
          <TableHead>{t('date')}</TableHead>
          <TableHead>{t('amount')}</TableHead>
          <TableHead>{t('block')}</TableHead>
          <TableHead>{t('transaction')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={`${item.hash}-${item.value}`}>
            <TableCell className="capitalize">{item.name}</TableCell>
            <TableCell>{formatDate(item.timestamp)}</TableCell>
            <TableCell>{item.value}</TableCell>
            <TableCell>{item.block}</TableCell>
            <TableCell>
              <Link
                href={`https://etherscan.io/tx/${item.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {formatTruncatedAddress(item.hash)}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default History;
