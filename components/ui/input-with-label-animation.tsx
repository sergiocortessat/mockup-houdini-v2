import { useId } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function InputWithLabelAnimation({
  label,
  className,
  inputClassName,
  value,
  onChange,
  error,
}: {
  label: string;
  className?: string;
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
  inputClassName?: string;
}) {
  const id = useId();
  return (
    <div className={cn('group relative', className)}>
      <label
        htmlFor={id}
        className={cn(
          'origin-start group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-3 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-3 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium',
          error && 'text-destructive'
        )}
      >
        <span
          className={cn(
            'text-muted-foreground inline-flex px-2',
            error && 'text-destructive'
          )}
        >
          {label}
        </span>
      </label>
      <Input
        id={id}
        type="text"
        placeholder=""
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-14 pt-4',
          error && 'border-destructive focus-visible:border-destructive',
          inputClassName
        )}
      />
    </div>
  );
}

export { InputWithLabelAnimation };
