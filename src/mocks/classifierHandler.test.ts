import { describe, expect, it } from 'vitest';
import {
  ClassifierRejection,
  classifyFile,
  classifyUpload,
} from './classifierHandler';

describe('classifyUpload', () => {
  it('classifies filenames containing cat as cats', async () => {
    const result = await classifyUpload(
      { filename: 'my-cat.jpg', mimeType: 'image/jpeg' },
      { delayMs: 0 },
    );
    expect(result).toEqual({ isCat: true });
  });

  it('classifies other JPEG filenames as not cats', async () => {
    const result = await classifyUpload(
      { filename: 'dog.jpg', mimeType: 'image/jpeg' },
      { delayMs: 0 },
    );
    expect(result).toEqual({ isCat: false });
  });

  it('rejects non-JPEG uploads', async () => {
    await expect(
      classifyUpload(
        { filename: 'photo.png', mimeType: 'image/png' },
        { delayMs: 0 },
      ),
    ).rejects.toMatchObject({ status: 400 });
  });

  it('returns a server error for fail filenames', async () => {
    await expect(
      classifyUpload(
        { filename: 'fail.jpg', mimeType: 'image/jpeg' },
        { delayMs: 0 },
      ),
    ).rejects.toBeInstanceOf(ClassifierRejection);
  });
});

describe('classifyFile', () => {
  it('uses the file MIME type and name', async () => {
    const file = new File(['content'], 'cat.jpg', { type: 'image/jpeg' });
    const result = await classifyFile(file, { delayMs: 0 });
    expect(result).toEqual({ isCat: true });
  });
});
