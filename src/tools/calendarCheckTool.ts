import { z } from 'zod';
import { FunctionTool } from '@google/adk'; 

export const calendarCheck = new FunctionTool({
  name: 'CalendarCheck',
  description: 'Retrieves available time slots from the user\'s personal calendar within a specific date range.',
  parameters: z.object({
    start_date: z.string().describe('The start date to check availability (YYYY-MM-DD).'),
    end_date: z.string().describe('The end date to check availability (YYYY-MM-DD).'),
    duration_minutes: z.number().optional().default(60).describe('Minimum duration of the free slot needed.'),
  }),
  execute: ({ start_date, end_date, duration_minutes }) => {
    const availableSlots = [];
    let currentDate = new Date(start_date);
    const finalDate = new Date(end_date);

    // Loop through each day in the range
    while (currentDate <= finalDate) {
      // getDay(): 0 is Sunday, 6 is Saturday
      const dayOfWeek = currentDate.getDay();

      // Check if it is a weekday (Mon=1 through Fri=5)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Format date string YYYY-MM-DD
        const dateStr = currentDate.toISOString().split('T')[0];

        // Hardcoded logic: User is free M-F, 9-12 and 1-5
        // In a real app, this would query an actual Calendar API.
        availableSlots.push({
          date: dateStr,
          slots: [
            { start: "09:00", end: "12:00", status: "Available" },
            { start: "13:00", end: "17:00", status: "Available" }
          ]
        });
      }

      // Increment day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (availableSlots.length === 0) {
      return JSON.stringify({
        status: "success",
        message: "No available slots found in the given range (checks M-F only).",
        data: []
      });
    }

    return JSON.stringify({
      status: "success",
      range_checked: `${start_date} to ${end_date}`,
      data: availableSlots
    });
  },
});