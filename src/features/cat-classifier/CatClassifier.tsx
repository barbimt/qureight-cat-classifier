import { useEffect, useRef, useState } from 'react';
import { classifyImage } from '@/api/classifyImage';
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
  const activePreviewUrl = getPreviewUrl(workflow);

  useEffect(() => {
    return () => {
      if (activePreviewUrl) {
        URL.revokeObjectURL(activePreviewUrl);
      }
    };
  }, [activePreviewUrl]);

  const revokePreview = (previewUrl: string | null) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleFileChange = (file: File | null) => {
    const currentPreviewUrl = getPreviewUrl(workflow);

    if (!file) {
      revokePreview(currentPreviewUrl);
      setWorkflow({ phase: 'idle' });
      return;
    }

    const validation = validateImageFile(file);

    if (!validation.valid) {
      revokePreview(currentPreviewUrl);
      setWorkflow({ phase: 'invalid', message: validation.message });
      return;
    }

    revokePreview(currentPreviewUrl);
    const previewUrl = URL.createObjectURL(file);
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

  const handleReset = () => {
    revokePreview(getPreviewUrl(workflow));

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
    <main className="flex w-full max-w-lg flex-col items-center gap-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Cat Classifier</h1>
        <p className="text-sm text-muted-foreground">
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

      {canSubmit ? (
        <Button type="button" onClick={handleSubmit}>
          Classify image
        </Button>
      ) : null}
    </main>
  );
};
