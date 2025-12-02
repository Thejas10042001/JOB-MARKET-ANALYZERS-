import React, { useState, useEffect } from 'react';
import { JobListing } from '../types';
import JobCard from './JobCard';

interface JobListProps {
  jobs: JobListing[];
  initialLoad: boolean;
}

const JOBS_PER_PAGE = 5;

const JobList: React.FC<JobListProps> = ({ jobs, initialLoad }) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [jobs]);

  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const currentJobs = jobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  if (initialLoad) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center h-full flex flex-col justify-center items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700">Ready to Find Your Next Job?</h3>
            <p className="text-gray-500 mt-2">Use the filters on the left and click "Find Live Jobs" to start your search.</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semibold text-gray-700">No Jobs Found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters to find more results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Job Listings ({jobs.length})</h2>
        <div className="space-y-4">
          {currentJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobList;