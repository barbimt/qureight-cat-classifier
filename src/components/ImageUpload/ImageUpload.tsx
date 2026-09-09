import {
  useId,
  useRef,
  type ChangeEvent,
  type DragEvent,
  type RefObject,
} from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FILE_INPUT_ACCEPT, FILE_INPUT_LABEL } from '@/types/classification';

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
  const dropzoneHintId = useId();
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const resolvedInputRef = inputRef ?? fallbackInputRef;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onFileChange(file);
  };

  const handleChooseClick = () => {
    resolvedInputRef.current?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const file = event.dataTransfer.files?.[0] ?? null;
    onFileChange(file);
  };

  const describedBy = validationError ? errorId : undefined;
  const chooseLabel = fileName
    ? 'Choose a different JPEG/JPG image'
    : 'Choose a JPEG/JPG image';

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="overflow-hidden rounded-xl border bg-card ring-1 ring-foreground/10">
        <div className="flex items-center border-b px-3 py-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            JPEG/JPG only
          </span>
        </div>

        <div className="p-3">
          <input
            ref={resolvedInputRef}
            id={inputId}
            type="file"
            accept={FILE_INPUT_ACCEPT}
            className="sr-only"
            aria-label={FILE_INPUT_LABEL}
            disabled={disabled}
            aria-invalid={validationError ? true : undefined}
            aria-describedby={describedBy}
            onChange={handleInputChange}
          />
          <button
            ref={chooseButtonRef}
            type="button"
            disabled={disabled}
            aria-label={chooseLabel}
            aria-describedby={!fileName ? dropzoneHintId : undefined}
            onClick={handleChooseClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              'flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-5 transition-colors',
              'hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
              'disabled:pointer-events-none disabled:opacity-50',
            )}
          >
            <div
              className="flex size-8 items-center justify-center rounded-full bg-primary/10"
              aria-hidden="true"
            >
              <Upload className="size-4 text-primary" />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <span className="text-sm font-semibold text-primary">
                {chooseLabel}
              </span>
              {!fileName ? (
                <span
                  id={dropzoneHintId}
                  className="text-xs text-muted-foreground"
                >
                  or drag and drop it here
                </span>
              ) : null}
            </div>
          </button>
          {validationError ? (
            <p
              id={errorId}
              role="alert"
              className="mt-2 text-sm text-destructive"
            >
              {validationError}
            </p>
          ) : null}
        </div>
      </div>

      {previewUrl && fileName ? (
        <figure className="overflow-hidden rounded-xl border bg-card ring-1 ring-foreground/10">
          <div className="p-3">
            <img
              src={previewUrl}
              alt={`Preview of ${fileName}`}
              className="max-h-64 w-full rounded-lg object-contain"
            />
          </div>
          <figcaption className="border-t px-3 py-2 text-sm text-muted-foreground">
            {fileName}
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
};
