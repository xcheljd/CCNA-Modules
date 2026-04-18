import { format, subDays } from 'date-fns';
import { getTodayDate, getYesterdayDate } from '../dateHelpers';

describe('dateHelpers', () => {
  describe('getTodayDate', () => {
    it('returns today in YYYY-MM-DD format', () => {
      const result = getTodayDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result).toBe(format(new Date(), 'yyyy-MM-dd'));
    });
  });

  describe('getYesterdayDate', () => {
    it('returns yesterday in YYYY-MM-DD format', () => {
      const result = getYesterdayDate();
      expect(result).toBe(format(subDays(new Date(), 1), 'yyyy-MM-dd'));
    });

    it('returns a date one day before today', () => {
      const today = new Date(getTodayDate());
      const yesterday = new Date(getYesterdayDate());
      const diffMs = today - yesterday;
      expect(diffMs).toBe(86400000);
    });
  });
});
