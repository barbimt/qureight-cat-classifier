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
    <div className="flex w-full max-w-md flex-col gap-4">
      <Alert variant="destructive">
        <AlertCircle aria-hidden="true" />
        <AlertTitle>Classification failed</AlertTitle>
        <AlertDescription>
          We couldn't classify this image. You can retry with the same image or
          choose a different one.
        </AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="lg" onClick={onRetry}>
          Retry classification
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={onChooseAnother}
        >
          Choose another image
        </Button>
      </div>
    </div>
  );
};
