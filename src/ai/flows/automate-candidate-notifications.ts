// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview This file defines a Genkit flow for automating candidate notifications.
 *
 * It allows hiring managers to send personalized email notifications to candidates at each stage
 * of the recruitment process (e.g., interview invites, rejection notices).
 *
 * @exports {
 *   AutomateCandidateNotificationsInput: The input type for the automateCandidateNotifications function.
 *   AutomateCandidateNotificationsOutput: The output type for the automateCandidateNotifications function.
 *   automateCandidateNotifications: The main function to trigger candidate notifications.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the automateCandidateNotifications flow.
 */
const AutomateCandidateNotificationsInputSchema = z.object({
  candidateName: z.string().describe('The name of the candidate.'),
  candidateEmail: z.string().email().describe('The email address of the candidate.'),
  jobTitle: z.string().describe('The title of the job the candidate applied for.'),
  stage: z
    .string()
    .describe(
      'The current stage of the candidate in the recruitment process (e.g., Applied, Interview, Offer, Rejected).' + //
        'This will be used to select the appropriate email template and tailor the message.'
    ),
  notificationType: z
    .enum(['interviewInvite', 'rejectionNotice', 'offer']) // Add more types as needed
    .describe('The type of notification to send (interviewInvite, rejectionNotice).'),
  companyName: z.string().describe('The name of the company.'),
  hiringManagerName: z.string().describe('The name of the hiring manager.'),
  interviewDateTime: z
    .string()
    .optional()
    .describe('The date and time of the interview, required for interview invites.'),
  rejectionReason: z
    .string()
    .optional()
    .describe('The reason for rejection, required for rejection notices.'),
});

/**
 * Output schema for the automateCandidateNotifications flow.
 */
const AutomateCandidateNotificationsOutputSchema = z.object({
  success: z.boolean().describe('Indicates whether the notification was sent successfully.'),
  message: z.string().describe('A message indicating the status of the notification.'),
});

export type AutomateCandidateNotificationsInput = z.infer<
  typeof AutomateCandidateNotificationsInputSchema
>;
export type AutomateCandidateNotificationsOutput = z.infer<
  typeof AutomateCandidateNotificationsOutputSchema
>;

/**
 * Main function to trigger candidate notifications.
 * @param input - The input parameters for the notification.
 * @returns A promise that resolves to the output of the flow.
 */
export async function automateCandidateNotifications(
  input: AutomateCandidateNotificationsInput
): Promise<AutomateCandidateNotificationsOutput> {
  return automateCandidateNotificationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'candidateNotificationPrompt',
  input: {schema: AutomateCandidateNotificationsInputSchema},
  output: {schema: AutomateCandidateNotificationsOutputSchema},
  prompt: `You are an AI assistant specialized in generating personalized email notifications for candidates in a recruitment process.

  Based on the candidate's information, the job title, the stage in the recruitment process, and the notification type, create a personalized email message.

  Candidate Name: {{{candidateName}}}
  Candidate Email: {{{candidateEmail}}}
  Job Title: {{{jobTitle}}}
  Stage: {{{stage}}}
  Notification Type: {{{notificationType}}}
  Company Name: {{{companyName}}}
  Hiring Manager Name: {{{hiringManagerName}}}
  Interview Date/Time: {{#if interviewDateTime}}{{{interviewDateTime}}}{{else}}N/A{{/if}}
  Rejection Reason: {{#if rejectionReason}}{{{rejectionReason}}}{{else}}N/A{{/if}}

  Here are some example notifications:
  - Interview Invite: Subject: Interview Invitation for {{jobTitle}} at {{companyName}}
    Body: Dear {{candidateName}},\n\nWe are pleased to invite you to an interview for the {{jobTitle}} position at {{companyName}}.  The interview is scheduled for {{interviewDateTime}}. Please confirm your availability.\n\nBest regards,\n{{hiringManagerName}}

  - Rejection Notice: Subject: Update on your application for {{jobTitle}} at {{companyName}}
    Body: Dear {{candidateName}},\n\nThank you for your interest in the {{jobTitle}} position at {{companyName}}.  After careful consideration, we have decided to move forward with other candidates.  {{{rejectionReason}}}.\n\nBest regards,\n{{hiringManagerName}}

  - Offer: Subject: Job Offer for {{jobTitle}} at {{companyName}}
    Body: Dear {{candidateName}},\n\nWe are excited to offer you the {{jobTitle}} position at {{companyName}}! Please review the attached offer letter and let us know if you have any questions.  We are excited to have you join our team!\n\nBest regards,\n{{hiringManagerName}}

  Please generate a suitable email message based on the information given. Return a JSON object with "success": true/false and a descriptive "message" field.
  `, // eslint-disable-line max-len
});

/**
 * Genkit flow definition for automating candidate notifications.
 */
const automateCandidateNotificationsFlow = ai.defineFlow(
  {
    name: 'automateCandidateNotificationsFlow',
    inputSchema: AutomateCandidateNotificationsInputSchema,
    outputSchema: AutomateCandidateNotificationsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      // In a real-world scenario, you would send the email here using a service like SendGrid or Nodemailer
      // but for the purpose of this example, we'll just return a success message.
      return {
        success: true,
        message: `Notification sent successfully to ${input.candidateName} for ${input.jobTitle} at stage ${input.stage}.`, // eslint-disable-line max-len
      };
    } catch (error: any) {
      console.error('Error sending notification:', error);
      return {
        success: false,
        message: `Failed to send notification to ${input.candidateName}. Error: ${error.message}`, // eslint-disable-line max-len
      };
    }
  }
);
