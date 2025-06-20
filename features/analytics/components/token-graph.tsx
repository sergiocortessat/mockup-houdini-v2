import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { useAccount } from 'wagmi';

import { ChartContainer } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useEarnedHistoryQuery } from '@/graphql/generated';

const priceChartConfig = {
  price: {
    label: 'Price',
    color: 'url(#gradient)',
  },
};

const BuyTokenGraph = () => {
  const { address, isConnected } = useAccount();
  const { data: earnedHistoryData, loading: earnedHistoryLoading } =
    useEarnedHistoryQuery({
      variables: {
        address: address || '',
      },
      skip: !address || !isConnected,
    });

  const chartData =
    earnedHistoryData?.earnedHistory?.map((item: any) => ({
      date: item.label,
      price: item.values[0] || 0,
    })) || [];

  return (
    <ChartContainer config={priceChartConfig} className="h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        {earnedHistoryLoading ? (
          <div className="flex h-[120px] items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="price"
              stroke="url(#gradient)"
              strokeWidth={2}
              dot={false}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </LineChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default BuyTokenGraph;
