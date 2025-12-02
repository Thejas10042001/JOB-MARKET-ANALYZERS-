import React, { useState } from 'react';
import { JobListing } from '../types';

interface JobCardProps {
  job: JobListing;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    const minK = min ? min / 1000 : 0;
    const maxK = max ? max / 1000 : 0;
    
    if (min && !max) return `$${minK}k/yr`;
    if (!min && max) return `Up to $${maxK}k/yr`;
    if (min === max) return `$${minK}k/yr`;

    return `$${minK}k - $${maxK}k/yr`;
  }

  return (
    <div className="border border-gray-200 bg-white rounded-lg p-4 transition-shadow hover:shadow-md">
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <h3 className="text-lg font-semibold text-indigo-700 hover:underline">
            <a href={job.url} target="_blank" rel="noopener noreferrer">{job.title}</a>
          </h3>
          <p className="text-md font-medium text-gray-800">{job.company}</p>
        </div>
        <div className="mt-2 sm:mt-0 sm:text-right">
          <p className="text-sm text-gray-600">{job.location}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
         <div className="flex items-center space-x-1">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>
             <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
         </div>
      </div>
      <div className="mt-4">
        <p className={`text-sm text-gray-700 ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {job.description}
        </p>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-indigo-600 hover:text-indigo-800 text-sm mt-2">
            {isExpanded ? 'Show less' : 'Show more'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;