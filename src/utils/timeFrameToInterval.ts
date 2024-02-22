import { HOURLY_TIME_FRAMES } from '../constants.js';

export const timeFrameToInterval = (interval: HOURLY_TIME_FRAMES) => {
  if (interval === '24') {
    return '1d';
  }

  return interval + 'h';
};
