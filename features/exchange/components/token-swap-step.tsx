import { cn } from '@/lib/utils';

interface TokenSwapStepProps {
  step: number;
  title: string;
  description: string;
  label: string;
}

const TokenSwapStep = ({
  step,
  title,
  description,
  label,
}: TokenSwapStepProps) => {
  return (
    <div
      key={step}
      className={cn(
        'p-6',
        'rounded-4xl',
        'cursor-pointer',
        'transition-all',
        'duration-300',
        'ease-in-out',
        'hover:translate-y-[-2px]',
        'hover:bg-white/15',
        'border',
        'bg-transparent'
      )}
    >
      <span className="text-label-sm text-gray-500 uppercase">{label}</span>
      <h3 className="text-heading-lg my-2">{title}</h3>
      <p className="text-label-sm leading-relaxed text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default TokenSwapStep;
