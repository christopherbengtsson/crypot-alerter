import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { ChartData } from 'chart.js/auto';

export interface DataPoint {
  close: number;
  isPeak: boolean;
  isTrough: boolean;
}

interface ChartProps {
  priceData: DataPoint[];
  rsiData?: DataPoint[];
}

export const MyChart: React.FC<ChartProps> = ({ priceData }) => {
  const chartPrices: ChartData<'line', number[], number> = {
    labels: priceData.map((dp) => dp.close),
    datasets: [
      {
        label: 'Price',
        data: priceData.map((dp) => dp.close),
        borderColor: 'blue',
        backgroundColor: priceData.map((dp) =>
          dp.isPeak || dp.isTrough ? 'red' : 'rgba(0, 0, 255, 0.5)',
        ),
      },
    ],
  };

  return (
    <div
      style={{
        width: '100vh',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Line data={chartPrices} />
    </div>
  );
};
