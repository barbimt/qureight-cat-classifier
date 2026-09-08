import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '@/mocks/msw/server';
import { CatClassifier } from '@/features/cat-classifier/CatClassifier';
import { createMockFile } from '@/test/factories';

const renderClassifier = () => {
  const user = userEvent.setup();
  render(<CatClassifier />);
  return { user };
};

const uploadFile = async (
  user: ReturnType<typeof userEvent.setup>,
  file: File,
) => {
  const input = screen.getByLabelText('JPEG image', { selector: 'input' });
  await user.upload(input, file);
};

describe('CatClassifier', () => {
  it('allows a valid JPEG to be selected', async () => {
    const { user } = renderClassifier();
    const file = createMockFile('photo.jpg', 'image/jpeg');

    await uploadFile(user, file);

    expect(screen.getByText('photo.jpg')).toBeInTheDocument();
    expect(screen.getByAltText('Preview of photo.jpg')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Classify image' }),
    ).toBeInTheDocument();
  });

  it('rejects an invalid file with an accessible error', async () => {
    renderClassifier();
    const file = createMockFile('photo.png', 'image/png');
    const input = screen.getByLabelText('JPEG image', { selector: 'input' });

    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true,
    });
    fireEvent.change(input);

    expect(
      screen.getByText('Please select a JPEG image (.jpg or .jpeg).'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Classify image' }),
    ).not.toBeInTheDocument();
  });

  it('submits a valid image for classification', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { user } = renderClassifier();
    const file = createMockFile('cat.jpg', 'image/jpeg');

    await uploadFile(user, file);
    await user.click(screen.getByRole('button', { name: 'Classify image' }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        '/isthisacat',
        expect.objectContaining({ method: 'POST' }),
      );
    });

    fetchSpy.mockRestore();
  });

  it('shows processing state while classification is pending', async () => {
    server.use(
      http.post('/isthisacat', async () => {
        await delay(100);
        return HttpResponse.json({ isCat: true });
      }),
    );

    const { user } = renderClassifier();
    await uploadFile(user, createMockFile('cat.jpg', 'image/jpeg'));
    await user.click(screen.getByRole('button', { name: 'Classify image' }));

    expect(
      screen.getByText(
        'Classification in progress. Please wait and do not submit again.',
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("It's a cat")).toBeInTheDocument();
    });
  });

  it('prevents duplicate submissions while processing', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    server.use(
      http.post('/isthisacat', async () => {
        await delay(150);
        return HttpResponse.json({ isCat: true });
      }),
    );

    const { user } = renderClassifier();
    await uploadFile(user, createMockFile('cat.jpg', 'image/jpeg'));
    await user.click(screen.getByRole('button', { name: 'Classify image' }));

    expect(
      screen.getByText(
        'Classification in progress. Please wait and do not submit again.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Classify image' }),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    fetchSpy.mockRestore();
  });

  it('renders a cat result', async () => {
    const { user } = renderClassifier();
    await uploadFile(user, createMockFile('cat.jpg', 'image/jpeg'));
    await user.click(screen.getByRole('button', { name: 'Classify image' }));

    await waitFor(() => {
      expect(screen.getByText("It's a cat")).toBeInTheDocument();
    });
  });

  it('renders a not-cat result', async () => {
    server.use(
      http.post('/isthisacat', async () => {
        await delay(0);
        return HttpResponse.json({ isCat: false });
      }),
    );

    const { user } = renderClassifier();
    await uploadFile(user, createMockFile('dog.jpg', 'image/jpeg'));
    await user.click(screen.getByRole('button', { name: 'Classify image' }));

    await waitFor(() => {
      expect(screen.getByText('Not a cat')).toBeInTheDocument();
    });
  });

  it('shows an error when classification fails', async () => {
    server.use(
      http.post('/isthisacat', async () => {
        await delay(0);
        return HttpResponse.json(
          { message: 'Classification failed.' },
          { status: 500 },
        );
      }),
    );

    const { user } = renderClassifier();
    await uploadFile(user, createMockFile('photo.jpg', 'image/jpeg'));
    await user.click(screen.getByRole('button', { name: 'Classify image' }));

    await waitFor(() => {
      expect(screen.getByText('Classification failed')).toBeInTheDocument();
    });
  });

  it('allows retry after a failure', async () => {
    server.use(
      http.post('/isthisacat', async () => {
        await delay(0);
        return HttpResponse.json(
          { message: 'Classification failed.' },
          { status: 500 },
        );
      }),
    );

    const { user } = renderClassifier();
    await uploadFile(user, createMockFile('photo.jpg', 'image/jpeg'));
    await user.click(screen.getByRole('button', { name: 'Classify image' }));

    await waitFor(() => {
      expect(screen.getByText('Classification failed')).toBeInTheDocument();
    });

    server.use(
      http.post('/isthisacat', async () => {
        return HttpResponse.json({ isCat: true });
      }),
    );

    await user.click(
      screen.getByRole('button', { name: 'Retry classification' }),
    );

    await waitFor(() => {
      expect(screen.getByText("It's a cat")).toBeInTheDocument();
    });
  });

  it('allows classifying another image after completion', async () => {
    const { user } = renderClassifier();
    await uploadFile(user, createMockFile('cat.jpg', 'image/jpeg'));
    await user.click(screen.getByRole('button', { name: 'Classify image' }));

    await waitFor(() => {
      expect(screen.getByText("It's a cat")).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', { name: 'Classify another image' }),
    );

    expect(
      screen.getByRole('button', { name: 'Choose JPEG image' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('cat.jpg')).not.toBeInTheDocument();

    server.use(
      http.post('/isthisacat', async () => {
        await delay(0);
        return HttpResponse.json({ isCat: false });
      }),
    );

    await uploadFile(user, createMockFile('dog.jpg', 'image/jpeg'));
    await user.click(screen.getByRole('button', { name: 'Classify image' }));

    await waitFor(() => {
      expect(screen.getByText('Not a cat')).toBeInTheDocument();
    });
  });
});
