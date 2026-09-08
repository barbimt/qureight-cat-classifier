import type { IncomingMessage, ServerResponse } from 'node:http';
import busboy from 'busboy';
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

    parser.on('file', (_fieldName, fileStream, info) => {
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

const getNodeClassifierDelayMs = (): number => {
  const configured = process.env.VITE_CLASSIFIER_DELAY_MS;

  if (configured === undefined || configured === '') {
    return 60_000;
  }

  const parsed = Number(configured);
  return Number.isFinite(parsed) ? parsed : 60_000;
};

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

    const result = await classifyUpload(upload, {
      delayMs: getNodeClassifierDelayMs(),
    });
    sendJson(res, 200, result);
  } catch (error) {
    if (error instanceof ClassifierRejection) {
      sendJson(res, error.status, { message: error.message });
      return;
    }

    sendJson(res, 500, { message: 'Classification failed.' });
  }
};
