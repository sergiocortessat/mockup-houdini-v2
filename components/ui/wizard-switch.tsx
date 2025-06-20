'use client';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import { Wand } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface WizardSwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {}

const WizardSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  WizardSwitchProps
>(({ className, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="wizard-switch"
      className={cn(
        'inline-flex h-7 w-13 cursor-pointer items-center rounded-full border-2 border-[#2A3343] transition-colors',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-[#232B3A]',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="wizard-switch-thumb"
        className={cn(
          'block size-[26px] rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.20)] transition-transform',
          'flex items-center justify-center',
          'data-[state=checked]:translate-x-[23px] data-[state=unchecked]:translate-x-0',
          'border-2 border-[#232B3A]'
        )}
      >
        <Wand className="size-4 text-[#232B3A]" aria-hidden="true" />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
});
WizardSwitch.displayName = 'WizardSwitch';

export { WizardSwitch };
