export const createMockFile = (
  name: string,
  type: string,
  content = 'mock-image-content',
): File => new File([content], name, { type });
