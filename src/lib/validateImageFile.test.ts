import { describe, expect, it } from 'vitest';
import { validateImageFile } from './validateImageFile';

describe('validateImageFile', () => {
  it('accepts a JPEG file by MIME type', () => {
    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it('rejects a non-JPEG file by MIME type', () => {
    const file = new File(['content'], 'photo.png', { type: 'image/png' });
    expect(validateImageFile(file)).toEqual({
      valid: false,
      message: 'Please select a JPEG image (.jpg or .jpeg).',
    });
  });
});
