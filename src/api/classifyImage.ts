import type { ClassifyImageResponse } from '@/types/classification';
import { IMAGE_FIELD_NAME, JPEG_MIME_TYPE } from '@/types/classification';

export class ClassifyImageError extends Error {
  readonly status: number;
  readonly userMessage: string;

  constructor(status: number, userMessage: string) {
    super(userMessage);
    this.name = 'ClassifyImageError';
    this.status = status;
    this.userMessage = userMessage;
  }
}

const parseClassifyImageResponse = (
  data: unknown,
): ClassifyImageResponse | null => {
  if (
    typeof data === 'object' &&
    data !== null &&
    'isCat' in data &&
    typeof data.isCat === 'boolean'
  ) {
    return { isCat: data.isCat };
  }

  return null;
};

export const classifyImage = async (
  file: File,
): Promise<ClassifyImageResponse> => {
  if (file.type !== JPEG_MIME_TYPE) {
    throw new ClassifyImageError(
      400,
      'Please select a JPEG image (.jpg or .jpeg).',
    );
  }

  const formData = new FormData();
  formData.append(IMAGE_FIELD_NAME, file);

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
  const response = await fetch(`${baseUrl}/isthisacat`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new ClassifyImageError(
      response.status,
      'Classification failed. Please try again.',
    );
  }

  const data: unknown = await response.json();
  const parsed = parseClassifyImageResponse(data);

  if (!parsed) {
    throw new ClassifyImageError(
      response.status,
      'Classification failed. Please try again.',
    );
  }

  return parsed;
};
