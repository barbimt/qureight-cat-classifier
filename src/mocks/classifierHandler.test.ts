import { describe, expect, it } from 'vitest';
import { ClassifierRejection, classifyUpload } from './classifierHandler';

describe('classifyUpload', () => {
  it('classifies filenames containing cat as cats', () => {
    const result = classifyUpload({
      filename: 'my-cat.jpg',
      mimeType: 'image/jpeg',
    });
    expect(result).toEqual({ isCat: true });
  });

  it('classifies other JPEG filenames as not cats', () => {
    const result = classifyUpload({
      filename: 'dog.jpg',
      mimeType: 'image/jpeg',
    });
    expect(result).toEqual({ isCat: false });
  });

  it('rejects non-JPEG uploads', () => {
    expect(() =>
      classifyUpload({
        filename: 'photo.png',
        mimeType: 'image/png',
      }),
    ).toThrow(
      expect.objectContaining({
        status: 400,
      }),
    );
  });

  it('returns a server error for fail filenames', () => {
    expect(() =>
      classifyUpload({
        filename: 'fail.jpg',
        mimeType: 'image/jpeg',
      }),
    ).toThrow(ClassifierRejection);
  });
});
