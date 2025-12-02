import { GoogleGenAI, Type } from "@google/genai";
import { TrendDataPoint, JobListing, Filters } from '../types';

// Assumes process.env.API_KEY is set in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const jobListingSchemaDescription = `
A JSON array of job objects. Each object must have the following properties:
- "id": A unique string identifier for the job listing.
- "title": The string job title.
- "company": The string name of the company hiring.
- "location": The string job location (e.g., 'San Francisco, CA').
- "description": A string containing a brief summary of the job.
- "url": The direct, full, and valid string URL to the job posting. This is critical.
- "salaryMin": An optional number for the estimated minimum annual salary.
- "salaryMax": An optional number for the estimated maximum annual salary.
`;

const buildSearchPrompt = (filters: Filters): string => {
    let prompt = `Use Google Search to find real, currently active job listings based on the following criteria.`;
    if (filters.keyword) {
        prompt += ` The job title or keyword is "${filters.keyword}".`;
    }
    if (filters.city || filters.state || filters.country) {
        const location = [filters.city, filters.state, filters.country].filter(Boolean).join(', ');
        prompt += ` The location is near "${location}".`;
    }
    if (filters.company) {
        prompt += ` The company is "${filters.company}".`;
    }
    prompt += ` Prioritize major job boards like LinkedIn, Indeed, Glassdoor, and official company career pages.`;
    prompt += ` Return up to 20 of the most relevant results. For each job, provide a detailed summary in the description field.`;
    prompt += ` It is absolutely critical that the response is ONLY the JSON array, with no other text or explanation. The 'url' field in each object must contain the direct, full, and valid URL to the job application page. Do not use placeholder links or links to general search results.`;
    prompt += ` The output must be a valid JSON array of objects, structured like this: ${jobListingSchemaDescription}`;
    return prompt;
};

export const geminiService = {
  findRealtimeJobs: async (filters: Filters): Promise<{ jobs: JobListing[] | null; sources: any[] }> => {
     if (!filters.keyword && !filters.city && !filters.company) {
        return { jobs: [], sources: [] };
     }
     const prompt = buildSearchPrompt(filters);
     
     try {
         const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
             config: {
                 tools: [{googleSearch: {}}],
             },
         });

         const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
         const jsonText = response.text.trim();

         if (!jsonText) {
             console.error('Gemini API returned empty response for real-time jobs.');
             return { jobs: null, sources };
         }
         
         const jsonMatch = jsonText.match(/```(json)?\s*([\s\S]*?)\s*```/);
         const parsableText = jsonMatch ? jsonMatch[2] : jsonText;

         try {
            const data = JSON.parse(parsableText);
            if(Array.isArray(data)) {
                const filteredJobs = data.filter(job => {
                    if (!job.salaryMin && !job.salaryMax) return true;
                    const jobMin = job.salaryMin ?? 0;
                    const jobMax = job.salaryMax ?? Infinity;
                    return jobMax >= filters.minSalary && jobMin <= filters.maxSalary;
                }) as JobListing[];
                return { jobs: filteredJobs, sources };
            }
         } catch (parseError) {
             console.error("Failed to parse JSON from Gemini response:", parseError);
             console.error("Original text from API:", jsonText);
             return { jobs: null, sources };
         }
         
         return { jobs: null, sources };

     } catch (error) {
         console.error("Error fetching real-time jobs from Gemini API:", error);
         throw error;
     }
  },

  fetchJobTrendData: async (jobTitle: string): Promise<TrendDataPoint[] | null> => {
    if (!jobTitle) return null;
    
    const trendDataSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.STRING, description: 'The abbreviated month name (e.g., "Jan", "Feb").' },
          score: { type: Type.NUMBER, description: 'A fictional popularity score from 0 to 100.' }
        },
        required: ['month', 'score']
      }
    };

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