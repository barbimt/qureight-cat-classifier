import type { Plugin } from 'vite';
import { handleClassifierRequest } from './handleClassifierRequest.ts';

export const mockClassifierApiPlugin = (): Plugin => ({
  name: 'mock-classifier-api',
  configureServer(server) {
    server.middlewares.use('/isthisacat', (req, res, next) => {
      if (req.method !== 'POST') {
        next();
        return;
      }

      void handleClassifierRequest(req, res);
    });
  },
});
