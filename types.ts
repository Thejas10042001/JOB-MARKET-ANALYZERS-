export interface JobListing {
  id: string;
  title: string;
  company: string;
  location:string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  url: string;
}

export interface Filters {
  keyword: string;
  location: string;
  company: string;
  minSalary: number;
  maxSalary: number;
}

export interface TrendDataPoint {
  month: string;
  score: number;
}