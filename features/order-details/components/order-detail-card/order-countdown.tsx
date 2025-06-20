import Countdown from 'react-countdown';

interface OrderCountdownProps {
  expiryDate: string | Date;
}

const CountdownRenderer = ({ minutes, seconds, completed }: any) => {
  if (completed) return null;

  return (
    <div className="text-label-sm sm:text-label-md bg-secondary flex w-fit items-center justify-center rounded-full px-1.5 text-neutral-50 sm:px-2">
      <span className="inline-block w-[2ch] text-center">{minutes}</span>
      <span className="px-1">:</span>
      <span className="inline-block w-[2ch] text-center">{seconds}</span>
    </div>
  );
};

const OrderCountdown = ({ expiryDate }: OrderCountdownProps) => {
  return (
    <Countdown
      date={new Date(expiryDate)}
      renderer={CountdownRenderer}
      zeroPadTime={2}
    />
  );
};

export default OrderCountdown;
