'use server';

/**
 * @fileOverview This file defines a Genkit flow for parsing candidate profiles from uploaded CVs.
 *
 * It uses OCR and GenAI to automatically extract information such as name, email, and experience.
 *
 * - parseCandidateProfile - The main function to parse a candidate profile.
 * - ParseCandidateProfileInput - The input type for the parseCandidateProfile function.
 * - ParseCandidateProfileOutput - The output type for the parseCandidateProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs';

const ParseCandidateProfileInputSchema = z.object({
  cvDataUri: z
    .string()
    .describe(
      'The CV file as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
});

export type ParseCandidateProfileInput = z.infer<typeof ParseCandidateProfileInputSchema>;

const ParseCandidateProfileOutputSchema = z.object({
  name: z.string().describe('The name of the candidate.'),
  email: z.string().describe('The email address of the candidate.'),
  experience: z.string().describe('A summary of the candidate\'s work experience.'),
});

export type ParseCandidateProfileOutput = z.infer<typeof ParseCandidateProfileOutputSchema>;

export async function parseCandidateProfile(
  input: ParseCandidateProfileInput
): Promise<ParseCandidateProfileOutput> {
  return parseCandidateProfileFlow(input);
}

const parseCandidateProfilePrompt = ai.definePrompt({
  name: 'parseCandidateProfilePrompt',
  input: {schema: ParseCandidateProfileInputSchema},
  output: {schema: ParseCandidateProfileOutputSchema},
  prompt: `You are an expert in extracting information from CVs.

  Analyze the provided CV and extract the following information:
  - Name
  - Email
  - Work Experience Summary

  CV Content: {{media url=cvDataUri}}`,
});

const parseCandidateProfileFlow = ai.defineFlow(
  {
    name: 'parseCandidateProfileFlow',
    inputSchema: ParseCandidateProfileInputSchema,
    outputSchema: ParseCandidateProfileOutputSchema,
  },
  async input => {
    const {output} = await parseCandidateProfilePrompt(input);
    return output!;
  }
);
