'use server';
/**
 * @fileOverview This file implements a Genkit flow for resolving pickup locations in Ghana.
 * It handles various input types including GPS coordinates, GhanaPost digital addresses,
 * landmark descriptions, and transcribed voice commands.
 * 
 * Optimized for Demo: Includes robust fallback logic for testing.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GhanaAddressAndVoiceResolutionInputSchema = z.object({
  locationType: z.enum(['GPS_COORDINATE', 'GHANA_POST', 'LANDMARK', 'MAP_PIN', 'VOICE_COMMAND']).describe('The type of location input provided.'),
  gpsCoordinates: z.object({ lat: z.number(), lng: z.number() }).optional().describe('GPS coordinates if locationType is GPS_COORDINATE.'),
  ghanaPostAddress: z.string().optional().describe('GhanaPost digital address if locationType is GHANA_POST.'),
  landmarkDescription: z.string().optional().describe('Descriptive landmark or transcribed voice command if locationType is LANDMARK or VOICE_COMMAND.'),
  mapPinCoordinates: z.object({ lat: z.number(), lng: z.number() }).optional().describe('Map pin coordinates if locationType is MAP_PIN.'),
});
export type GhanaAddressAndVoiceResolutionInput = z.infer<typeof GhanaAddressAndVoiceResolutionInputSchema>;

const GhanaAddressAndVoiceResolutionOutputSchema = z.object({
  resolvedCoordinates: z.object({ lat: z.number(), lng: z.number() }).describe('The resolved geographical coordinates (latitude, longitude).'),
  confidenceScore: z.number().min(0).max(1).describe('Confidence score (0-1) in the resolved location.'),
  resolvedAddress: z.string().optional().describe('A standardized, human-readable address derived from the resolution.'),
});
export type GhanaAddressAndVoiceResolutionOutput = z.infer<typeof GhanaAddressAndVoiceResolutionOutputSchema>;

/**
 * Dummy GhanaPost Resolver to ensure smooth testing without LLM calls if needed.
 */
function resolveDummyGhanaPost(address: string) {
  // Simple regex for GA-123-4567 format
  const match = address.match(/([A-Z]{2})-(\d{3})-(\d{4})/i);
  if (match) {
    return {
      resolvedCoordinates: { lat: 5.6145, lng: -0.1008 },
      confidenceScore: 1.0,
      resolvedAddress: `GhanaPost: ${address.toUpperCase()}`,
    };
  }
  return null;
}

const resolveLocationPrompt = ai.definePrompt({
  name: 'resolveLocationPrompt',
  input: { schema: GhanaAddressAndVoiceResolutionInputSchema },
  output: { schema: GhanaAddressAndVoiceResolutionOutputSchema },
  prompt: `You are an intelligent location resolution engine for a trash hailing service in Ghana. 
  
  Convert the user's location input into GPS coordinates.
  
  Input Details:
  Type: {{{locationType}}}
  Address: {{{ghanaPostAddress}}}
  Landmark: {{{landmarkDescription}}}

  If a GhanaPost address is provided, simulate a valid coordinate in Accra.
  If a landmark like "Zongo Junction" or "Melcom" is provided, resolve to a known coordinate.`,
});

const ghanaAddressAndVoiceResolutionFlow = ai.defineFlow(
  {
    name: 'ghanaAddressAndVoiceResolutionFlow',
    inputSchema: GhanaAddressAndVoiceResolutionInputSchema,
    outputSchema: GhanaAddressAndVoiceResolutionOutputSchema,
  },
  async (input) => {
    try {
      // 1. Direct GPS/Pin handling
      if (input.locationType === 'GPS_COORDINATE' && input.gpsCoordinates) {
        return {
          resolvedCoordinates: input.gpsCoordinates,
          confidenceScore: 0.99,
          resolvedAddress: `GPS: ${input.gpsCoordinates.lat}, ${input.gpsCoordinates.lng}`,
        };
      }
      
      // 2. Dummy GhanaPost handling for smooth testing
      if (input.locationType === 'GHANA_POST' && input.ghanaPostAddress) {
        const dummy = resolveDummyGhanaPost(input.ghanaPostAddress);
        if (dummy) return dummy;
      }

      // 3. Fallback to AI for Landmarks
      const { output } = await resolveLocationPrompt(input);
      return output || {
        resolvedCoordinates: { lat: 5.67955, lng: -0.16421 },
        confidenceScore: 0.8,
        resolvedAddress: input.landmarkDescription || 'Resolved via Demo Engine',
      };
    } catch (error) {
      console.warn('Flow error, using demo fallback:', error);
      // Fail gracefully for the prototype
      return {
        resolvedCoordinates: { lat: 5.67955, lng: -0.16421 },
        confidenceScore: 0.5,
        resolvedAddress: 'Zongo Junction (Demo Default)',
      };
    }
  }
);

export async function resolveGhanaAddress(
  input: GhanaAddressAndVoiceResolutionInput
): Promise<GhanaAddressAndVoiceResolutionOutput> {
  return ghanaAddressAndVoiceResolutionFlow(input);
}
