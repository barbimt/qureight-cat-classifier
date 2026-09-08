import * as React from 'react';
import { cn } from 'cn';
import { Progress as ProgressPrimitive } from 'radix-ui';

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indeterminate?: boolean;
};

function Progress({
  className,
  value,
  indeterminate = false,
  ...props
}: ProgressProps) {
  const isIndeterminate = indeterminate || value == null;

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={isIndeterminate ? null : value}
      className={cn(
        'relative flex w-full items-center overflow-x-hidden rounded-full bg-muted',
        isIndeterminate ? 'h-2' : 'h-1',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          'h-full bg-primary transition-all',
          'data-[state=indeterminate]:w-1/3 data-[state=indeterminate]:animate-pulse',
          'data-[state=loading]:size-full data-[state=loading]:flex-1',
          'data-[state=complete]:size-full data-[state=complete]:flex-1',
        )}
        style={
          !isIndeterminate && typeof value === 'number'
            ? { transform: `translateX(-${100 - value}%)` }
            : undefined
        }
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
