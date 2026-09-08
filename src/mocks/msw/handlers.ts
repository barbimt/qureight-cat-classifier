import { http, HttpResponse, delay } from 'msw';

export const classifierHandlers = [
  http.post('/isthisacat', async () => {
    await delay(0);
    return HttpResponse.json({ isCat: true });
  }),
];
