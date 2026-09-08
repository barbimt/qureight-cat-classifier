import { JPEG_MIME_TYPE } from '../types/classification.ts';

export class ClassifierRejection extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ClassifierRejection';
    this.status = status;
  }
}

export type ClassifyUploadInput = {
  filename: string;
  mimeType: string;
};

export const classifyUpload = async (
  input: ClassifyUploadInput,
): Promise<{ isCat: boolean }> => {
  if (input.mimeType !== JPEG_MIME_TYPE) {
    throw new ClassifierRejection(400, 'Only JPEG images are supported.');
  }

  const filename = (input.filename ?? '').toLowerCase();

  if (filename.includes('fail')) {
    throw new ClassifierRejection(500, 'Classification failed.');
  }

  const isCat = filename.includes('cat');
  return { isCat };
};

export const classifyFile = async (file: File): Promise<{ isCat: boolean }> =>
  classifyUpload({
    filename: file.name,
    mimeType: file.type,
  });
