import { useEffect, useRef, useState } from 'react';

import { Confetti } from '@/components/ui/confetti';

interface OrderCompletedConfettiProps {
  isCompleted: boolean;
}

const OrderCompletedConfetti = ({
  isCompleted,
}: OrderCompletedConfettiProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const hasShownConfetti = useRef(false);

  // Show confetti when order is completed
  useEffect(() => {
    if (isCompleted && !hasShownConfetti.current) {
      setShowConfetti(true);
      hasShownConfetti.current = true;
    }
  }, [isCompleted]);

  if (!showConfetti) return null;

  return (
    <Confetti
      className="pointer-events-none absolute inset-0 z-50"
      options={{
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      }}
    />
  );
};

export default OrderCompletedConfetti;
