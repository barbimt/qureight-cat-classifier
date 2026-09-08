# Cat Classifier

A small React app built for the Qureight coding challenge.

Users can upload a JPEG image and send it to a mock `/isthisacat` API to check whether the image contains a cat.

## Getting started

```bash
npm ci
npm run dev
```

Open:

```text
http://localhost:5173
```

## How it works

The user can:

1. Select a JPEG image
2. Submit it for classification
3. See a loading state while the image is being processed
4. See whether the image contains a cat
5. Retry after an error or choose another image

The real ML API was not available for the challenge, so the project includes a small mock API using Vite middleware.

### Mock behaviour

The mock uses the filename to return predictable results:

| Filename        | Result               |
| --------------- | -------------------- |
| Contains `cat`  | `{ "isCat": true }`  |
| Contains `fail` | Server error         |
| Any other JPEG  | `{ "isCat": false }` |

A short delay is also added to simulate the real classifier response time.

## Tech stack

* React 19
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Vitest
* React Testing Library
* MSW
* Playwright

## Testing

Unit and integration tests use Vitest, React Testing Library and MSW.

Playwright is used for the main browser-level flow against the running Vite app and mock API.

Run the checks with:

```bash
npm run check
npm run test:e2e
```

## Useful scripts

```bash
npm run dev          # Start the development server
npm run test         # Run Vitest in watch mode
npm run test:run     # Run Vitest once
npm run test:e2e     # Run Playwright tests
npm run test:e2e:ui  # Open Playwright UI mode
npm run build        # Create a production build
npm run check        # Run lint, format, types, tests and build
```

## Notes

The classification logic in this repository is only a development mock. In a real application, the frontend would keep the same API contract and call the real ML service instead.
