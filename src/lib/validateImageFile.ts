import { JPEG_MIME_TYPE } from '@/types/classification';

export type ValidationResult =
  { valid: true } | { valid: false; message: string };

export const validateImageFile = (file: File): ValidationResult => {
  if (file.type !== JPEG_MIME_TYPE) {
    return {
      valid: false,
      message: 'Please select a JPEG image (.jpg or .jpeg).',
    };
  }

  return { valid: true };
};
