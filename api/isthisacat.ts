import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleClassifierRequest } from '../src/mocks/handleClassifierRequest.ts';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  await handleClassifierRequest(req, res);
}
