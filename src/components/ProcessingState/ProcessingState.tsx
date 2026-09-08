import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type ProcessingStateProps = {
  fileName: string;
};

export const ProcessingState = ({ fileName }: ProcessingStateProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
        <Loader2
          className="size-10 animate-spin text-primary"
          aria-hidden="true"
        />
        <div className="space-y-2">
          <p
            role="status"
            aria-live="polite"
            aria-label="Classification in progress"
            className="text-lg font-semibold text-primary"
          >
            Analysing your image...
          </p>
          <p className="text-base text-muted-foreground">
            This usually takes around one minute.
          </p>
          <p className="text-sm text-muted-foreground">{fileName}</p>
        </div>
      </CardContent>
    </Card>
  );
};
