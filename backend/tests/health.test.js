import { describe, test, expect } from '@jest/globals';

describe('Health Check', () => {
  test('should return true', () => {
    expect(true).toBe(true);
  });

  test('should perform basic arithmetic', () => {
    expect(2 + 2).toBe(4);
  });
});
