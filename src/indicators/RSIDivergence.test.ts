import {
  bearishDiv4h,
  bullishDiv4h,
  hiddenBearishDiv4h,
  hiddenBullishDiv4h,
} from '../../tests/mocks/index.js';
import { checkDivergences } from './RSIDivergence.js';
import * as alertModule from '../alert.js';

vi.mock('../alert.js', () => ({
  triggerAlert: vi.fn(),
}));

describe('RSIDivergence BTCUSDT 4H', () => {
  test('should trigger alert on regular bullish divergence', () => {
    checkDivergences(bullishDiv4h);

    expect(alertModule.triggerAlert).toHaveBeenLastCalledWith({
      type: 'rsiDiv',
      alertProps: {
        type: 'regular',
        trend: 'bullish',
        price: expect.any(Number),
      },
    });
  });

  test('should trigger alert on hidden bullish divergence', () => {
    checkDivergences(hiddenBullishDiv4h);

    expect(alertModule.triggerAlert).toHaveBeenLastCalledWith({
      type: 'rsiDiv',
      alertProps: {
        type: 'hidden',
        trend: 'bullish',
        price: expect.any(Number),
      },
    });
  });

  test('should trigger alert on regular bearish divergence', () => {
    checkDivergences(bearishDiv4h);

    expect(alertModule.triggerAlert).toHaveBeenLastCalledWith({
      type: 'rsiDiv',
      alertProps: {
        type: 'regular',
        trend: 'bearish',
        price: expect.any(Number),
      },
    });
  });

  test('should trigger alert on hidden bearish divergence', () => {
    checkDivergences(hiddenBearishDiv4h);

    expect(alertModule.triggerAlert).toHaveBeenLastCalledWith({
      type: 'rsiDiv',
      alertProps: {
        type: 'hidden',
        trend: 'bearish',
        price: expect.any(Number),
      },
    });
  });
});
