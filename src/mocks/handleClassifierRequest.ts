import type { IncomingMessage, ServerResponse } from 'node:http';
import busboy from 'busboy';
import { IMAGE_FIELD_NAME } from '../types/classification.js';
import { ClassifierRejection, classifyUpload } from './classifierHandler.ts';

type ParsedUpload = {
  filename: string;
  mimeType: string;
};

const parseMultipartUpload = (
  req: IncomingMessage,
): Promise<ParsedUpload | null> =>
  new Promise((resolve, reject) => {
    const parser = busboy({ headers: req.headers });
    let upload: ParsedUpload | null = null;

    parser.on('file', (fieldName, fileStream, info) => {
      if (fieldName !== IMAGE_FIELD_NAME) {
        fileStream.resume();
        return;
      }

      upload = {
        filename: info.filename ?? '',
        mimeType: info.mimeType,
      };
      fileStream.resume();
    });

    parser.on('error', reject);
    parser.on('close', () => {
      resolve(upload);
    });

    req.pipe(parser);
  });

const sendJson = (
  res: ServerResponse,
  status: number,
  body: Record<string, unknown>,
): void => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const MOCK_RESPONSE_DELAY_MS = 2_000;

const wait = (delayMs: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });

export const handleClassifierRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> => {
  try {
    const upload = await parseMultipartUpload(req);

    if (!upload) {
      sendJson(res, 400, { message: 'A JPEG image is required.' });
      return;
    }

    await wait(MOCK_RESPONSE_DELAY_MS);
    const result = await classifyUpload(upload);
    sendJson(res, 200, result);
  } catch (error) {
    if (error instanceof ClassifierRejection) {
      sendJson(res, error.status, { message: error.message });
      return;
    }

    sendJson(res, 500, { message: 'Classification failed.' });
  }
};
