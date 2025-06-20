import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'border-input bg-input text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/20 flex h-11 w-full rounded-xl border px-3 py-2 text-sm shadow-xs shadow-black/5 transition-shadow focus-visible:ring-[3px] focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          '[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s,_color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[webkit-text-fill-color:hsl(var(--foreground))] [&:-webkit-autofill]:hover:[transition:background-color_9999s_ease-in-out_0s,_color_9999s_ease-in-out_0s] [&:-webkit-autofill]:focus:[transition:background-color_9999s_ease-in-out_0s,_color_9999s_ease-in-out_0s] [&:-webkit-autofill]:active:[transition:background-color_9999s_ease-in-out_0s,_color_9999s_ease-in-out_0s]',
          type === 'search' &&
            '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
          type === 'file' &&
            'text-muted-foreground/70 file:border-input file:text-foreground p-0 pr-3 italic file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
