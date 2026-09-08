import { useEffect, useRef, useState } from 'react';
import { classifyImage } from '@/api/classifyImage';
import { ClassificationError } from '@/components/ClassificationError/ClassificationError';
import { ClassificationResult } from '@/components/ClassificationResult/ClassificationResult';
import { ImageUpload } from '@/components/ImageUpload/ImageUpload';
import { ProcessingState } from '@/components/ProcessingState/ProcessingState';
import { Button } from '@/components/ui/button';
import { validateImageFile } from '@/lib/validateImageFile';

type WorkflowState =
  | { phase: 'idle' }
  | { phase: 'ready'; file: File; previewUrl: string }
  | { phase: 'invalid'; message: string }
  | { phase: 'processing'; file: File; previewUrl: string }
  | { phase: 'success'; file: File; previewUrl: string; isCat: boolean }
  | { phase: 'error'; file: File; previewUrl: string };

const getPreviewUrl = (workflow: WorkflowState): string | null => {
  switch (workflow.phase) {
    case 'ready':
    case 'processing':
    case 'success':
    case 'error':
      return workflow.previewUrl;
    default:
      return null;
  }
};

const getFileName = (workflow: WorkflowState): string | null => {
  switch (workflow.phase) {
    case 'ready':
    case 'processing':
    case 'success':
    case 'error':
      return workflow.file.name;
    default:
      return null;
  }
};

export const CatClassifier = () => {
  const [workflow, setWorkflow] = useState<WorkflowState>({ phase: 'idle' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);
  const previewUrlRef = useRef<string | null>(null);
  const activePreviewUrl = getPreviewUrl(workflow);

  const clearPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const replacePreviewUrl = (file: File): string => {
    clearPreviewUrl();
    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    return previewUrl;
  };

  useEffect(() => clearPreviewUrl, []);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      clearPreviewUrl();
      setWorkflow({ phase: 'idle' });
      return;
    }

    const validation = validateImageFile(file);

    if (!validation.valid) {
      clearPreviewUrl();
      setWorkflow({ phase: 'invalid', message: validation.message });
      return;
    }

    const previewUrl = replacePreviewUrl(file);
    setWorkflow({ phase: 'ready', file, previewUrl });
  };

  const runClassification = async (file: File, previewUrl: string) => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setWorkflow({ phase: 'processing', file, previewUrl });

    try {
      const result = await classifyImage(file);
      setWorkflow({
        phase: 'success',
        file,
        previewUrl,
        isCat: result.isCat,
      });
    } catch {
      setWorkflow({ phase: 'error', file, previewUrl });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleSubmit = () => {
    if (workflow.phase !== 'ready') {
      return;
    }

    void runClassification(workflow.file, workflow.previewUrl);
  };

  const handleRetry = () => {
    if (workflow.phase !== 'error') {
      return;
    }

    void runClassification(workflow.file, workflow.previewUrl);
  };

  const handleReset = () => {
    clearPreviewUrl();

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setWorkflow({ phase: 'idle' });
    fileInputRef.current?.focus();
  };

  const isProcessing = workflow.phase === 'processing';
  const canSubmit = workflow.phase === 'ready';
  const validationError =
    workflow.phase === 'invalid' ? workflow.message : null;

  return (
    <main className="flex w-full max-w-lg flex-col items-center gap-8 p-6 md:p-10">
      <div className="space-y-3 text-center">
        <h1>Cat Classifier</h1>
        <p className="text-base text-muted-foreground">
          Upload a JPEG image to find out if it contains a cat.
        </p>
      </div>

      <ImageUpload
        inputRef={fileInputRef}
        previewUrl={activePreviewUrl}
        fileName={getFileName(workflow)}
        validationError={validationError}
        disabled={isProcessing}
        onFileChange={handleFileChange}
      />

      {workflow.phase === 'processing' ? (
        <ProcessingState fileName={workflow.file.name} />
      ) : null}

      {workflow.phase === 'success' ? (
        <ClassificationResult
          isCat={workflow.isCat}
          onClassifyAnother={handleReset}
        />
      ) : null}

      {workflow.phase === 'error' ? (
        <ClassificationError
          onRetry={handleRetry}
          onChooseAnother={handleReset}
        />
      ) : null}

      {canSubmit ? (
        <Button type="button" size="lg" onClick={handleSubmit}>
          Classify image
        </Button>
      ) : null}
    </main>
  );
};
