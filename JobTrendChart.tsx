import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendDataPoint } from '../types';
import Loader from './Loader';

interface JobTrendChartProps {
  data: TrendDataPoint[] | null;
  isLoading: boolean;
  jobTitle: string;
}

const JobTrendChart: React.FC<JobTrendChartProps> = ({ data, isLoading, jobTitle }) => {
  if (isLoading) {
    return (
        <div className="flex justify-center items-center" style={{ height: 300 }}>
            <Loader />
        </div>
    );
  }

  if (!data || data.length === 0) {
    return (
        <div className="flex flex-col justify-center items-center text-center text-gray-500" style={{ height: 300 }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>Select a specific job role from the filter to view its popularity trend.</p>
        </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#4b5563' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#4b5563' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }}
          />
          <Legend />
          <Line type="monotone" dataKey="score" name={`Interest for "${jobTitle}"`} stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JobTrendChart;