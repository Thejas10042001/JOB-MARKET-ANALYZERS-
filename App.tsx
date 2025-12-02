import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { JobListing, Filters, TrendDataPoint } from './types';
import { geminiService } from './services/geminiService';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import JobList from './components/JobList';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    keyword: '',
    location: '',
    company: '',
    minSalary: 0,
    maxSalary: 300000,
  });
  
  const [trendData, setTrendData] = useState<TrendDataPoint[] | null>(null);
  const [isTrendLoading, setIsTrendLoading] = useState<boolean>(false);
  
  const [initialLoad, setInitialLoad] = useState(true);

  const handleSearch = useCallback(async () => {
    setInitialLoad(false);
    try {
      setIsSearching(true);
      setError(null);
      setSources([]);
      const { jobs: data, sources: newSources } = await geminiService.findRealtimeJobs(filters);
      setJobs(data || []);
      setSources(newSources || []);
      if (!data || data.length === 0) {
        console.log("No jobs found or error in fetching.");
      }
    } catch (err: any) {
      console.error("Search failed:", err);
      let errorMessage = 'Failed to fetch live job data. The AI service may be busy or experiencing high traffic.';
      if (err instanceof Error) {
         errorMessage = `Error: ${err.message}. Please try again later.`;
      } else if (typeof err === 'string') {
          errorMessage = err;
      }
      setError(errorMessage);
      setJobs([]);
      setSources([]);
    } finally {
      setIsSearching(false);
    }
  }, [filters]);
  
  useEffect(() => {
    const fetchTrend = async () => {
      if (!filters.keyword) {
        setTrendData(null);
        return;
      }
      setIsTrendLoading(true);
      const data = await geminiService.fetchJobTrendData(filters.keyword);
      setTrendData(data);
      setIsTrendLoading(false);
    };
    const debounceTimer = setTimeout(() => {
        fetchTrend();
    }, 500); 
    return () => clearTimeout(debounceTimer);
  }, [filters.keyword]);

  const uniqueJobRoles = useMemo(() => {
    const roles = new Set(jobs.map(job => job.title));
    return Array.from(roles).sort();
  }, [jobs]);

  const uniqueCompanies = useMemo(() => {
    const companies = new Set(jobs.map(j => j.company));
    return Array.from(companies).sort();
  }, [jobs]);
  

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">Live Job Market Analyzer</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3">
              <Dashboard 
                filters={filters} 
                onFilterChange={setFilters} 
                onSearch={handleSearch}
                isSearching={isSearching}
              />
            </aside>
            <div className="lg:col-span-9 space-y-8">
             {isSearching ? (
                <Loader />
             ) : error ? (
                <div className="text-center py-10 bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-600 text-lg font-semibold mb-2">Something went wrong</p>
                    <p className="text-gray-500 mb-6 max-w-md">{error}</p>
                    <button 
                        onClick={handleSearch}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retry Search
                    </button>
                </div>
             ) : (
                <>
                  <Analytics 
                    jobs={jobs} 
                    trendData={trendData} 
                    isTrendLoading={isTrendLoading}
                    selectedJobRole={filters.keyword}
                  />
                  <JobList jobs={jobs} initialLoad={initialLoad} sources={sources} />
                </>
             )}
            </div>
          </div>
      </main>
    </div>
  );
};

export default App;