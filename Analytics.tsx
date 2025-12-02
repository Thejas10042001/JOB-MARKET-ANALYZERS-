import React, { useMemo } from 'react';
import { JobListing, TrendDataPoint } from '../types';
import SalaryDistributionChart from './SalaryDistributionChart';
import TopCompaniesChart from './TopCompaniesChart';
import InDemandRolesChart from './InDemandRolesChart';
import JobTrendChart from './JobTrendChart';

interface AnalyticsProps {
  jobs: JobListing[];
  trendData: TrendDataPoint[] | null;
  isTrendLoading: boolean;
  selectedJobRole: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ jobs, trendData, isTrendLoading, selectedJobRole }) => {
    
  const topCompanies = useMemo(() => {
    const counts = jobs.reduce((acc: Record<string, number>, job) => {
      acc[job.company] = (acc[job.company] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [jobs]);

  const inDemandRoles = useMemo(() => {
    const counts = jobs.reduce((acc: Record<string, number>, job) => {
      acc[job.title] = (acc[job.title] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [jobs]);

  const salaryData = useMemo(() => {
    const salaryJobs = jobs.filter(
      (j): j is JobListing & { salaryMin: number; salaryMax: number } =>
        j.salaryMin !== undefined && j.salaryMax !== undefined
    );
    return salaryJobs.map(job => (job.salaryMin + job.salaryMax) / 2);
  }, [jobs]);


  if (jobs.length === 0 && !selectedJobRole) {
    return null;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Market Analytics</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        <div className="bg-gray-50 p-4 rounded-lg xl:col-span-2">
            <h3 className="font-semibold text-center text-gray-700 mb-4">
                Job Role Popularity Trend
            </h3>
            <JobTrendChart data={trendData} isLoading={isTrendLoading} jobTitle={selectedJobRole} />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-center text-gray-700 mb-4">Top Companies Hiring</h3>
          <TopCompaniesChart data={topCompanies} />
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-center text-gray-700 mb-4">Most In-Demand Roles</h3>
          <InDemandRolesChart data={inDemandRoles} />
        </div>
        
        {salaryData.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg xl:col-span-2">
            <h3 className="font-semibold text-center text-gray-700 mb-4">Salary Distribution (Annual)</h3>
            <SalaryDistributionChart data={salaryData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;