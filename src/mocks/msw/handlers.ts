import { http, HttpResponse, delay } from 'msw';
import { ClassifierRejection, classifyUpload } from '@/mocks/classifierHandler';
import { IMAGE_FIELD_NAME } from '@/types/classification';

export const classifierHandlers = [
  http.post('/isthisacat', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get(IMAGE_FIELD_NAME);

    if (!(file instanceof File)) {
      return HttpResponse.json(
        { message: 'A JPEG image is required.' },
        { status: 400 },
      );
    }

    try {
      await delay(0);
      const result = await classifyUpload(
        {
          filename: file.name,
          mimeType: file.type,
        },
        { delayMs: 0 },
      );
      return HttpResponse.json(result);
    } catch (error) {
      if (error instanceof ClassifierRejection) {
        return HttpResponse.json(
          { message: error.message },
          { status: error.status },
        );
      }

      return HttpResponse.json(
        { message: 'Classification failed.' },
        { status: 500 },
      );
    }
  }),
];
