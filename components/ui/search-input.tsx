import { Search, X } from 'lucide-react';
import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value'
  > {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
  inputClassName?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Search...',
      className,
      inputClassName,
      onClear,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative flex items-center', className)}>
        <span className="text-muted-foreground text-label-sm pointer-events-none absolute left-3">
          <Search className="size-4" aria-hidden="true" />
        </span>
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn('pr-10 pl-10', value && 'pr-10', inputClassName)}
          aria-label={placeholder}
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute right-3 rounded focus:outline-none focus-visible:ring-2"
            tabIndex={0}
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';
