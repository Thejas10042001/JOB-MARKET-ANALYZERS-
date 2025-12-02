
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

interface ChartData {
  name: string;
  count: number;
}

interface InDemandRolesChartProps {
  data: ChartData[];
}

const InDemandRolesChart: React.FC<InDemandRolesChartProps> = ({ data }) => {
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
                    width={120}
                    tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                />
                <Bar dataKey="count" fill="#6366f1">
                    <LabelList dataKey="count" position="right" style={{ fill: '#374151', fontSize: 12 }} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default InDemandRolesChart;
