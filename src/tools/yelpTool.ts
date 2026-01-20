import { z } from 'zod';
import { FunctionTool } from '@google/adk';

export const yelpApi = new FunctionTool({
  name: 'YelpAPI',
  description: 'Searches for local service professionals based on category, location, and minimum rating.',
  parameters: z.object({
    service_type: z.string().describe('The category of professional needed (e.g., "Plumber", "General Contractor", "Electrician").'),
    location: z.string().describe('The city, zip code, or neighborhood for the search.'),
    min_rating: z.number().min(0).max(5).describe('The minimum star rating (0.0 to 5.0) required.'),
  }),
  execute: ({ service_type, location, min_rating }) => {
    // 1. Define a mock database of local professionals
    const mockDatabase = [
      {
        id: "101",
        name: "Precision Remodeling",
        type: "General Contractor",
        city: "San Francisco",
        rating: 4.8,
        contact: "contact@precisionremod.com"
      },
      {
        id: "102",
        name: "Quick Fix Plumbers",
        type: "Plumber",
        city: "San Jose",
        rating: 4.2,
        contact: "help@quickfix.com"
      },
      {
        id: "103",
        name: "Elite Electricians",
        type: "Electrician",
        city: "San Francisco",
        rating: 4.9,
        contact: "info@eliteelectric.com"
      },
      {
        id: "104",
        name: "Budget Builds",
        type: "General Contractor",
        city: "San Francisco",
        rating: 3.5,
        contact: "save@budgetbuilds.com"
      },
      {
        id: "105",
        name: "Golden Gate Renovations",
        type: "General Contractor",
        city: "San Francisco",
        rating: 4.6,
        contact: "hello@goldengaterenos.com"
      }
    ];

    // 2. Filter the mock database based on user inputs
    // We normalize strings to lowercase for easier matching in this mock.
    const results = mockDatabase.filter(provider => 
      provider.type.toLowerCase().includes(service_type.toLowerCase()) &&
      location.toLowerCase().includes(provider.city.toLowerCase()) &&
      provider.rating >= min_rating
    );

    // 3. Return the results
    if (results.length === 0) {
      return JSON.stringify({
        status: "success",
        count: 0,
        message: `No ${service_type}s found in ${location} with a rating of ${min_rating}+.`,
        data: []
      });
    }

    return JSON.stringify({
      status: "success",
      count: results.length,
      data: results.map(r => ({
        name: r.name,
        rating: r.rating,
        contact: r.contact
      }))
    });
  },
});