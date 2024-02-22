import { ALERT_TYPE } from './constants.js';

export type Trend = 'bullish' | 'bearish';
export type DivergenceType = 'hidden' | 'regular';

export interface BaseAlertProps {
  price: number;
}
export interface RSIDivAlertProps extends BaseAlertProps {
  type: DivergenceType;
  trend: Trend;
}

export interface TriggerAlertProps {
  type: ALERT_TYPE;
  alertProps: RSIDivAlertProps;
}

export const triggerAlert = ({ type, alertProps }: TriggerAlertProps) => {
  if (type === 'rsiDiv') {
    return alertRsiDiv(alertProps);
  }
};

function alertRsiDiv({ type, trend, price }: RSIDivAlertProps) {
  console.log(
    `Confirmed ${type} ${trend} divergence at price ${price} on ${new Date().toISOString()}`,
  );
}
