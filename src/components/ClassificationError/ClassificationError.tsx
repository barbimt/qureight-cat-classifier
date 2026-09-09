import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type ClassificationErrorProps = {
  onRetry: () => void;
  onChooseAnother: () => void;
};

export const ClassificationError = ({
  onRetry,
  onChooseAnother,
}: ClassificationErrorProps) => {
  return (
    <div className="flex w-full min-w-0 max-w-md flex-col">
      <Alert variant="destructive" className="block w-full min-w-0 px-3 py-3">
        <div className="flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10"
              aria-hidden="true"
            >
              <AlertCircle className="size-4 text-destructive" />
            </div>
            <AlertTitle>Classification failed</AlertTitle>
          </div>
          <AlertDescription className="text-wrap">
            We couldn't classify this image. You can retry with the same image
            or choose a different one.
          </AlertDescription>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              size="sm"
              className="w-full sm:flex-1"
              onClick={onRetry}
            >
              Retry classification
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full sm:flex-1"
              onClick={onChooseAnother}
            >
              Choose another image
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
};
