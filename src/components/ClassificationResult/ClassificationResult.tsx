import { Cat, ImageOff, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ClassificationResultProps = {
  isCat: boolean;
  onClassifyAnother: () => void;
};

export const ClassificationResult = ({
  isCat,
  onClassifyAnother,
}: ClassificationResultProps) => {
  return (
    <div className="flex w-full min-w-0 max-w-md flex-col">
      <Alert
        className={cn(
          'block w-full min-w-0 px-3 py-3',
          isCat &&
            'border-emerald-200 bg-emerald-50 text-emerald-950 *:data-[slot=alert-description]:text-emerald-800/90',
        )}
      >
        <div className="flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {isCat ? (
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100"
                aria-hidden="true"
              >
                <Cat className="size-4 text-emerald-700" />
              </div>
            ) : (
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted"
                aria-hidden="true"
              >
                <ImageOff className="size-4 text-muted-foreground" />
              </div>
            )}
            <AlertTitle className={isCat ? 'text-emerald-950' : undefined}>
              {isCat ? "It's a cat" : 'Not a cat'}
            </AlertTitle>
          </div>
          <AlertDescription className="text-wrap">
            {isCat
              ? 'The classifier determined this image contains a cat.'
              : "The classifier determined this image doesn't contain a cat."}
          </AlertDescription>
          <Button
            type="button"
            size="sm"
            className="w-full"
            variant="outline"
            onClick={onClassifyAnother}
          >
            Start over
            <RefreshCw aria-hidden="true" />
          </Button>
        </div>
      </Alert>
    </div>
  );
};
