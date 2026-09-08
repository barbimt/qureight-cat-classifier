import { setupServer } from 'msw/node';
import { classifierHandlers } from './handlers';

export const server = setupServer(...classifierHandlers);
