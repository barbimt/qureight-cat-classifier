import { JPEG_MIME_TYPE } from '../types/classification.ts';

export class ClassifierRejection extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ClassifierRejection';
    this.status = status;
  }
}

export const getClassifierDelayMs = (): number => {
  const configured = import.meta.env?.VITE_CLASSIFIER_DELAY_MS;

  if (configured === undefined || configured === '') {
    return 60_000;
  }

  const parsed = Number(configured);
  return Number.isFinite(parsed) ? parsed : 60_000;
};

const wait = (delayMs: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });

export type ClassifyUploadInput = {
  filename: string;
  mimeType: string;
};

export const classifyUpload = async (
  input: ClassifyUploadInput,
  options?: { delayMs?: number },
): Promise<{ isCat: boolean }> => {
  if (input.mimeType !== JPEG_MIME_TYPE) {
    throw new ClassifierRejection(400, 'Only JPEG images are supported.');
  }

  const filename = (input.filename ?? '').toLowerCase();

  if (filename.includes('fail')) {
    throw new ClassifierRejection(500, 'Classification failed.');
  }

  const delayMs = options?.delayMs ?? getClassifierDelayMs();
  await wait(delayMs);

  const isCat = filename.includes('cat');
  return { isCat };
};

export const classifyFile = async (
  file: File,
  options?: { delayMs?: number },
): Promise<{ isCat: boolean }> =>
  classifyUpload(
    {
      filename: file.name,
      mimeType: file.type,
    },
    options,
  );
