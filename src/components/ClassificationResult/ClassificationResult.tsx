import { Cat, ImageOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type ClassificationResultProps = {
  isCat: boolean;
  onClassifyAnother: () => void;
};

export const ClassificationResult = ({
  isCat,
  onClassifyAnother,
}: ClassificationResultProps) => {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Alert>
        {isCat ? <Cat aria-hidden="true" /> : <ImageOff aria-hidden="true" />}
        <AlertTitle>{isCat ? "It's a cat" : 'Not a cat'}</AlertTitle>
        <AlertDescription>
          {isCat
            ? 'The classifier determined this image contains a cat.'
            : "The classifier determined this image doesn't contain a cat."}
        </AlertDescription>
      </Alert>
      <Button
        type="button"
        size="lg"
        variant="outline"
        onClick={onClassifyAnother}
      >
        Classify another image
      </Button>
    </div>
  );
};
