/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import { FunctionTool } from '@google/adk';
import { mockContractorDb } from './mockContractorDb.js';

export const yelpApi = new FunctionTool({
  name: 'YelpAPI',
  description: 'Searches for local service professionals based on category and minimum rating.',
  parameters: z.object({
    service_type: z.string().describe('The category of professional needed (e.g., "Painter", "Drywaller", "Plumber", "General Contractor").'),
    min_rating: z.number().min(0).max(5).describe('The minimum star rating (0.0 to 5.0) required.'),
  }),
  execute: ({ service_type, min_rating }) => {
    // Filter Logic
    // Normalize input for easier matching
    const searchType = service_type.toLowerCase();
    
    const results = mockContractorDb.filter(provider => {
      const typeMatch = provider.type.toLowerCase().includes(searchType);
      const ratingMatch = provider.rating >= min_rating;
      return typeMatch && ratingMatch;
    });

    // Sort by Rating (Highest First)
    results.sort((a, b) => b.rating - a.rating);

    // Return Output
    if (results.length === 0) {
      return JSON.stringify({
        status: "success",
        count: 0,
        message: `No professionals found for category "${service_type}" with rating ${min_rating}+.`,
        data: []
      });
    }

    return JSON.stringify({
      status: "success",
      count: results.length,
      data: results.map(r => ({
        name: r.name,
        type: r.type,
        rating: r.rating,
        contact: r.contact
      }))
    });
  },
});