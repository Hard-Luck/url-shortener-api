import { isApiUrl } from '../typeguards';

describe('type guards', () => {
  describe('isApiURL', () => {
    test('returns true when object matches', () => {
      const validApiUrl = {
        id: 1,
        clicked: 0,
        alias: 'google',
        isActive: true,
        userId: 1,
        originalUrl: 'www.google.com',
      };
      expect(isApiUrl(validApiUrl)).toBe(true);
    });
    test('returns false when object does not matches', () => {
      const validApiUrl = {
        clicked: 0,
        isActive: true,
        user_id: 1,
        originalUrl: 'www.google.com',
      };
      expect(isApiUrl(validApiUrl)).toBe(false);
    });
  });
});
