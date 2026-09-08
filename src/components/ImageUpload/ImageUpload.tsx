import { useId, useRef, type ChangeEvent, type RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FILE_INPUT_ACCEPT } from '@/types/classification';

type ImageUploadProps = {
  inputRef?: RefObject<HTMLInputElement | null>;
  chooseButtonRef?: RefObject<HTMLButtonElement | null>;
  previewUrl: string | null;
  fileName: string | null;
  validationError: string | null;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
};

export const ImageUpload = ({
  inputRef,
  chooseButtonRef,
  previewUrl,
  fileName,
  validationError,
  disabled = false,
  onFileChange,
}: ImageUploadProps) => {
  const inputId = useId();
  const errorId = useId();
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const resolvedInputRef = inputRef ?? fallbackInputRef;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onFileChange(file);
  };

  const handleChooseClick = () => {
    resolvedInputRef.current?.click();
  };

  const describedBy = validationError ? errorId : undefined;

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor={inputId}>JPEG image</Label>
        <input
          ref={resolvedInputRef}
          id={inputId}
          type="file"
          accept={FILE_INPUT_ACCEPT}
          className="sr-only"
          disabled={disabled}
          aria-invalid={validationError ? true : undefined}
          aria-describedby={describedBy}
          onChange={handleInputChange}
        />
        <Button
          ref={chooseButtonRef}
          type="button"
          size="lg"
          variant="outline"
          disabled={disabled}
          onClick={handleChooseClick}
        >
          {fileName ? 'Choose a different image' : 'Choose JPEG image'}
        </Button>
        {validationError ? (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {validationError}
          </p>
        ) : null}
      </div>

      {previewUrl && fileName ? (
        <figure className="flex flex-col items-center gap-2">
          <img
            src={previewUrl}
            alt={`Preview of ${fileName}`}
            className="max-h-64 w-full rounded-lg border object-contain"
          />
          <figcaption className="text-sm text-muted-foreground">
            {fileName}
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
};
