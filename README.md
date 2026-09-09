# Cat Classifier

A small React app built for the Qureight coding challenge.

Users can upload a JPEG image and send it to a mock `/isthisacat` API to check whether the image contains a cat.

Live demo: [qureight-cat-classifier.vercel.app](https://qureight-cat-classifier.vercel.app/)

## Getting started

```bash
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## How it works

1. Select a JPEG image (`.jpg` or `.jpeg`)
2. Submit it for classification
3. See a loading state while the image is being processed
4. See whether the image contains a cat
5. Retry after an error or choose another image

The real ML API was not available for the challenge, so the project includes a mock API using Vite middleware.

### Mock behaviour

The mock uses the filename to return predictable results:

| Filename        | Result               |
| --------------- | -------------------- |
| Contains `cat`  | `{ "isCat": true }`  |
| Contains `fail` | Server error         |
| Any other JPEG  | `{ "isCat": false }` |

A short delay is also added to simulate the real classifier response time.

## Tech stack

* React 19, TypeScript, Vite
* Tailwind CSS, shadcn/ui
* Vitest, React Testing Library, MSW, Playwright

## Testing

```bash
npm run check      # lint, format, types, tests and build
npm run test:e2e   # Playwright against the dev server and mock API
```

## Notes

The classification logic in this repository is only a development mock. In a real application, the frontend would keep the same API contract and call the real ML service instead.
