/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import { FunctionTool } from '@google/adk';
import { mockInventory } from './mockInventory.js';

export const productSearchApi = new FunctionTool({
  name: 'ProductSearch',
  description: 'Searches supported hardware retailer databases (Home Depot, Lowe\'s) for products matching a description and category.',
  parameters: z.object({
    query: z.string().describe('The search term for the specific product (e.g., "matte white subway", "brushed nickel").'),
    category: z.enum(['Flooring', 'Plumbing', 'Lumber', 'Electrical', 'Paint', 'Appliances', 'Decor']).describe('The department/category to narrow down the search.'),
    max_results: z.number().optional().default(5).describe('Optional limit on the number of results to return.'),
  }),
  execute: ({ query, category, max_results }) => {

    // Search Logic (Filter by Category AND Query)
    const normalizedQuery = query.toLowerCase();
    
    const matches = mockInventory.filter(item => {
      const categoryMatch = item.category === category;
      const queryMatch = item.name.toLowerCase().includes(normalizedQuery);
      return categoryMatch && queryMatch;
    });

    // Sort by Rating
    matches.sort((a, b) => b.rating - a.rating);
    const limitedResults = matches.slice(0, max_results);

    // Return Output
    if (limitedResults.length === 0) {
      return JSON.stringify({
        status: "success",
        count: 0,
        message: `No products found in category "${category}" matching "${query}".`,
        data: []
      });
    }

    return JSON.stringify({
      status: "success",
      count: limitedResults.length,
      data: limitedResults.map(item => ({
        name: item.name,
        category: item.category,
        sku: item.sku,
        price: item.price,
        unit: item.unit,
        vendor: item.vendor
      }))
    });
  },
});