// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview An AI agent that suggests learning materials for students and tutors after a tutoring session.
 *
 * - suggestLearningMaterials - A function that analyzes session feedback and suggests learning materials.
 * - SuggestLearningMaterialsInput - The input type for the suggestLearningMaterials function.
 * - SuggestLearningMaterialsOutput - The return type for the suggestLearningMaterials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLearningMaterialsInputSchema = z.object({
  sessionFeedback: z
    .string()
    .describe('Feedback from the tutoring session, including topics covered and student understanding.'),
  studentLevel: z.string().describe('The academic level of the student.'),
  tutorExperience: z.string().describe('The experience level of the tutor.'),
  module: z.string().describe('The module or subject that was tutored.'),
});

export type SuggestLearningMaterialsInput = z.infer<
  typeof SuggestLearningMaterialsInputSchema
>;

const SuggestLearningMaterialsOutputSchema = z.object({
  studentMaterials: z.array(z.string()).describe('Suggested learning materials for the student.'),
  tutorMaterials: z.array(z.string()).describe('Suggested learning materials for the tutor.'),
  explanation: z
    .string()
    .describe('Explanation of why these materials are recommended based on the session feedback.'),
});

export type SuggestLearningMaterialsOutput = z.infer<
  typeof SuggestLearningMaterialsOutputSchema
>;

export async function suggestLearningMaterials(
  input: SuggestLearningMaterialsInput
): Promise<SuggestLearningMaterialsOutput> {
  return suggestLearningMaterialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLearningMaterialsPrompt',
  input: {schema: SuggestLearningMaterialsInputSchema},
  output: {schema: SuggestLearningMaterialsOutputSchema},
  prompt: `You are an AI assistant designed to suggest relevant learning materials for both students and tutors after a tutoring session, based on the session feedback. 

Analyze the session feedback, student's level, tutor's experience, and the module to recommend appropriate learning materials for both the student and the tutor. If the session feedback does not contain enough information or it is not appropriate to give a suggestion, you should return empty lists.

Session Feedback: {{{sessionFeedback}}}
Student Level: {{{studentLevel}}}
Tutor Experience: {{{tutorExperience}}}
Module: {{{module}}}

Based on the above information, provide the learning materials:

Explanation: Give a brief explanation of why the materials are recommended.
Student Materials: A list of learning materials suitable for the student.
Tutor Materials: A list of learning materials suitable for the tutor to improve their tutoring skills.

Make sure your response is in JSON format.
`,
});

const suggestLearningMaterialsFlow = ai.defineFlow(
  {
    name: 'suggestLearningMaterialsFlow',
    inputSchema: SuggestLearningMaterialsInputSchema,
    outputSchema: SuggestLearningMaterialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
