
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SalaryDistributionChartProps {
  data: number[];
}

const SalaryDistributionChart: React.FC<SalaryDistributionChartProps> = ({ data }) => {
  
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const bins: { range: string; count: number }[] = [];
    const binSize = 25000;
    const maxSalary = 250000;

    for (let i = 0; i < maxSalary; i += binSize) {
      const rangeStart = i;
      const rangeEnd = i + binSize -1;
      bins.push({ range: `$${rangeStart/1000}k-$${rangeEnd/1000}k`, count: 0 });
    }
    bins.push({ range: `$${maxSalary/1000}k+`, count: 0 });

    data.forEach(salary => {
      let binIndex = Math.floor(salary / binSize);
      if (binIndex >= bins.length - 1) {
        binIndex = bins.length - 1;
      }
      bins[binIndex].count++;
    });

    return bins;
  }, [data]);

  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart
                data={processedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#4b5563' }} />
                <YAxis tick={{ fontSize: 12, fill: '#4b5563' }} />
                <Tooltip
                    cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
                <Legend />
                <Bar dataKey="count" name="Number of Jobs" fill="#a5b4fc" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default SalaryDistributionChart;
