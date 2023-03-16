import dayjs from 'dayjs';

export function createTimeStamp() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}
