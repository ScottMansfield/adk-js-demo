import { z } from 'zod';
import { FunctionTool } from '@google/adk';

export const emailDrafter = new FunctionTool({
  name: 'EmailDrafter',
  description: 'Drafts an email to a contractor. Does NOT send it automatically; returns the draft for approval.',
  parameters: z.object({
    recipient_name: z.string().describe('Name of the contractor or business.'),
    recipient_email: z.string().email().describe('Email address of the contractor.'),
    subject: z.string().describe('Subject line of the email.'),
    body_content: z.string().describe('The main content of the email, including project details and proposed meeting times.'),
  }),
  execute: ({ recipient_name, recipient_email, subject, body_content }) => {
    // 1. Simulate generating a unique ID for the draft (e.g., creating a draft in Gmail)
    const draftId = `draft_${Math.floor(Math.random() * 100000)}`;
    const timestamp = new Date().toISOString();

    // 2. Format the email content for review
    // In a real app, this might insert HTML signatures or standardized headers.
    const fullDraft = {
      id: draftId,
      created_at: timestamp,
      status: "DRAFT_SAVED",
      to: {
        name: recipient_name,
        address: recipient_email
      },
      header: {
        subject: subject
      },
      body: body_content
    };

    // 3. Return the formatted draft object
    return JSON.stringify({
      status: "success",
      message: `Draft email created for ${recipient_name}. Awaiting user approval.`,
      data: fullDraft
    });
  },
});