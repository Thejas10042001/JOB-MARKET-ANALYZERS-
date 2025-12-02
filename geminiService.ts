import { GoogleGenAI, Type } from "@google/genai";
import { TrendDataPoint, JobListing, Filters } from '../types';

// Assumes process.env.API_KEY is set in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const trendDataSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      month: {
        type: Type.STRING,
        description: 'The abbreviated month name (e.g., "Jan", "Feb").'
      },
      score: {
        type: Type.NUMBER,
        description: 'A fictional popularity score from 0 to 100.'
      }
    },
    required: ['month', 'score']
  }
};

const jobListingSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "A unique identifier for the job listing, can be a random string."},
            title: { type: Type.STRING, description: "The job title."},
            company: { type: Type.STRING, description: "The name of the company hiring."},
            location: { type: Type.STRING, description: "The job location (e.g., 'San Francisco, CA')."},
            description: { type: Type.STRING, description: "A brief summary of the job description."},
            url: { type: Type.STRING, description: "The direct, full URL to the job posting."},
            salaryMin: { type: Type.NUMBER, description: "The estimated minimum annual salary, if available."},
            salaryMax: { type: Type.NUMBER, description: "The estimated maximum annual salary, if available."}
        },
        required: ["id", "title", "company", "location", "description", "url"]
    }
};

const buildSearchPrompt = (filters: Filters): string => {
    let prompt = `Use Google Search to find real, active job listings.`;
    if (filters.keyword) {
        prompt += ` The job title or keyword should be "${filters.keyword}".`;
    }
    if (filters.city || filters.state || filters.country) {
        const location = [filters.city, filters.state, filters.country].filter(Boolean).join(', ');
        prompt += ` The location is "${location}".`;
    }
    if (filters.company) {
        prompt += ` The company is "${filters.company}".`;
    }
    prompt += ` The search should prioritize major job boards like LinkedIn, Indeed, Glassdoor, and official company career pages.`;
    prompt += ` Return up to 20 of the most relevant results. For each job, provide a detailed summary in the description field.`;
    prompt += ` It is absolutely critical that the 'url' field contains the direct, full, and valid URL to the job application page. Do not use placeholder links (like '#') or links to general search result pages. The URL must lead to the specific job posting.`;
    return prompt;
};

export const geminiService = {
  findRealtimeJobs: async (filters: Filters): Promise<JobListing[] | null> => {
     if (!filters.keyword && !filters.city && !filters.company) {
        return [];
     }
     const prompt = buildSearchPrompt(filters);
     
     try {
         const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
             config: {
                 responseMimeType: "application/json",
                 responseSchema: jobListingSchema,
             },
         });

         const jsonText = response.text.trim();
         if (!jsonText) {
             console.error('Gemini API returned empty response for real-time jobs.');
             return null;
         }

         const data = JSON.parse(jsonText);
         if(Array.isArray(data)) {
            // Filter based on salary client-side as it's not in the prompt
            return data.filter(job => {
                if (!job.salaryMin && !job.salaryMax) return true; // Keep jobs with no salary info
                const jobMin = job.salaryMin ?? 0;
                const jobMax = job.salaryMax ?? Infinity;
                return jobMax >= filters.minSalary && jobMin <= filters.maxSalary;
            }) as JobListing[];
         }
         return null;

     } catch (error) {
         console.error("Error fetching real-time jobs from Gemini API:", error);
         throw error;
     }
  },

  fetchJobTrendData: async (jobTitle: string): Promise<TrendDataPoint[] | null> => {
    if (!jobTitle) return null;

    try {
      const prompt = `Generate a fictional 'interest over time' score (from 0 to 100) for the job title "${jobTitle}" for the last 12 months, starting from last month and going backwards. The data should represent a plausible trend for such a role.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: trendDataSchema,
        },
      });

      const jsonText = response.text.trim();
      if (!jsonText) {
        console.error('Gemini API returned empty response text for trend data.');
        return null;
      }

      const data = JSON.parse(jsonText);
      // Basic validation
      if (Array.isArray(data) && data.every(item => 'month' in item && 'score' in item)) {
        return data as TrendDataPoint[];
      }
      return null;
    } catch (error) {
      console.error("Error fetching job trend data from Gemini API:", error);
      return null;
    }
  },
};