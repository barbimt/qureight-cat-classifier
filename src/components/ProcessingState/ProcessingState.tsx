import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type ProcessingStateProps = {
  fileName: string;
};

export const ProcessingState = ({ fileName }: ProcessingStateProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Classifying image</CardTitle>
        <CardDescription>
          {fileName} was accepted. Classification may take about a minute.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress
          aria-label="Classification progress"
          className="[&_[data-slot=progress-indicator]]:w-1/3 [&_[data-slot=progress-indicator]]:animate-pulse"
        />
        <p
          role="status"
          aria-live="polite"
          className="text-sm text-muted-foreground"
        >
          Classification in progress. Please wait and do not submit again.
        </p>
      </CardContent>
    </Card>
  );
};
