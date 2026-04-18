import { format, subDays } from 'date-fns';

export const getTodayDate = () => format(new Date(), 'yyyy-MM-dd');

export const getYesterdayDate = () => format(subDays(new Date(), 1), 'yyyy-MM-dd');
