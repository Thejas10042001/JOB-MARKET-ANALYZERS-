import React from 'react';
import { Filters } from '../types';

interface DashboardProps {
  filters: Filters;
  onFilterChange: React.Dispatch<React.SetStateAction<Filters>>;
  onSearch: () => void;
  isSearching: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    filters, 
    onFilterChange, 
    onSearch,
    isSearching,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange(prev => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: rawValue } = e.target;
    const value = Number(rawValue);

    onFilterChange(prev => {
        if (name === 'minSalary') {
            const newMin = value;
            return { ...prev, minSalary: newMin, maxSalary: Math.max(newMin, prev.maxSalary) };
        }
        if (name === 'maxSalary') {
            const newMax = value;
            return { ...prev, maxSalary: newMax, minSalary: Math.min(newMax, prev.minSalary) };
        }
        return prev;
    });
  };

  const resetFilters = () => {
    onFilterChange({
      keyword: '',
      country: '',
      state: '',
      city: '',
      company: '',
      minSalary: 0,
      maxSalary: 300000,
    });
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSearch();
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Search for Jobs</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">Job Title / Keyword</label>
           <input 
            type="text"
            name="keyword" 
            id="keyword" 
            value={filters.keyword} 
            onChange={handleInputChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            placeholder="e.g., Frontend Engineer"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input 
            type="text"
            name="city" 
            id="location" 
            value={filters.city} 
            onChange={handleInputChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input 
            type="text"
            name="company" 
            id="company" 
            value={filters.company} 
            onChange={handleInputChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            placeholder="e.g., Innovatech"
          />
        </div>
       
        <div>
          <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>${filters.minSalary / 1000}k</span>
            <input type="range" name="minSalary" id="minSalary" min="0" max="300000" step="10000" value={filters.minSalary} onChange={handleSalaryChange} className="w-full" />
          </div>
           <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>${filters.maxSalary / 1000}k</span>
            <input type="range" name="maxSalary" id="maxSalary" min="0" max="300000" step="10000" value={filters.maxSalary} onChange={handleSalaryChange} className="w-full" />
          </div>
        </div>
        
        <div className="space-y-4">
            <button
                onClick={handleSearchClick}
                disabled={isSearching}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
                {isSearching ? 'Searching...' : 'Find Live Jobs'}
            </button>
            <button
                onClick={resetFilters}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Reset Filters
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;