
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location:string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  url: string;
  companyWebsite?: string;
}

export interface Filters {
  keyword: string;
  location: string;
  city?: string;
  state?: string;
  country?: string;
  company: string;
  minSalary: number;
  maxSalary: number;
}

export interface TrendDataPoint {
  month: string;
  score: number;
}
