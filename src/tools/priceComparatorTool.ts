/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import { FunctionTool } from '@google/adk';
import { mockInventory } from './mockInventory.js'; 

export const priceComparator = new FunctionTool({
  name: 'PriceComparator',
  description: 'Checks a specific product SKU against other vendors (Home Depot, Lowe\'s, Wayfair) to find alternative prices.',
  parameters: z.object({
    sku: z.string().describe('The unique Store Keeping Unit ID of the product found in the search.'),
    base_vendor: z.string().optional().describe('The name of the vendor where the SKU was originally found.'),
  }),
  execute: ({ sku, base_vendor }) => {
    // 1. Find the original item in the mock database
    const originalItem = mockInventory.find(item => item.sku === sku);

    if (!originalItem) {
      return JSON.stringify({
        status: "error",
        message: `SKU "${sku}" not found in database.`
      });
    }

    // 2. Define the list of possible competitors
    const allVendors = ["Home Depot", "Lowe's", "Wayfair"];
    
    // Filter out the vendor we already have (if provided) or the one in the DB record
    const currentVendor = base_vendor || originalItem.vendor;
    const competitors = allVendors.filter(v => v !== currentVendor);

    // 3. Generate a random competitor price
    // Select one random competitor from the remaining list
    const randomCompetitor = competitors[Math.floor(Math.random() * competitors.length)];

    // Calculate a variation between -5% and +5%
    // Math.random() gives 0 to 1. 
    // (Math.random() * 0.10) gives 0 to 0.10.
    // Subtract 0.05 to shift range to -0.05 to +0.05.
    const variationPercent = (Math.random() * 0.10) - 0.05;
    
    const originalPrice = originalItem.price;
    const newPrice = originalPrice * (1 + variationPercent);
    
    // Round to 2 decimal places
    const finalPrice = Math.round(newPrice * 100) / 100;

    // 4. Return the comparison result
    return JSON.stringify({
      status: "success",
      original: {
        vendor: currentVendor,
        price: originalPrice
      },
      alternative: {
        vendor: randomCompetitor,
        price: finalPrice,
        difference: `${(variationPercent * 100).toFixed(2)}%`
      },
      recommendation: finalPrice < originalPrice 
        ? `Buy from ${randomCompetitor} to save $${(originalPrice - finalPrice).toFixed(2)}.` 
        : `Stick with ${currentVendor}, it is cheaper.`
    });
  },
});