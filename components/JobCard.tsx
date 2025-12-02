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
    <div className="border border-gray-200 bg-white rounded-lg p-4 transition-shadow hover:shadow-md flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <h3 className="text-lg font-semibold text-indigo-700 hover:underline">
            <a href={job.url} target="_blank" rel="noopener noreferrer" title={job.url}>{job.title}</a>
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
      <div className="mt-4 flex-grow">
        <p className={`text-sm text-gray-700 ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {job.description}
        </p>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 focus:outline-none">
            {isExpanded ? 'Show less' : 'Show more'}
        </button>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
        <a 
            href={job.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
            Apply Now
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
        </a>
      </div>
    </div>
  );
};

export default JobCard;