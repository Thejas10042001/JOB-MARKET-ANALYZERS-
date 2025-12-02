
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

interface ChartData {
  name: string;
  count: number;
}

interface TopCompaniesChartProps {
  data: ChartData[];
}

const TopCompaniesChart: React.FC<TopCompaniesChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis type="number" hide />
                <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#4b5563' }}
                    width={100}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
                <Bar dataKey="count" fill="#818cf8">
                    <LabelList dataKey="count" position="right" style={{ fill: '#374151', fontSize: 12 }} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default TopCompaniesChart;