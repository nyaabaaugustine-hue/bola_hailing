'use server';
/**
 * @fileOverview This file implements a Genkit flow for resolving pickup locations in Ghana.
 * It handles various input types including GPS coordinates, GhanaPost digital addresses,
 * landmark descriptions, and transcribed voice commands, prioritizing landmark and voice resolution
 * using an AI model and a simulated landmark search tool.
 *
 * - resolveGhanaAddress - A wrapper function to trigger the address resolution flow.
 * - GhanaAddressAndVoiceResolutionInput - The input type for the address resolution.
 * - GhanaAddressAndVoiceResolutionOutput - The output type for the resolved address.
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
 * Simulates searching a database of known Ghanaian landmarks, community names, or previously resolved informal addresses.
 * This tool is used by the AI model to resolve ambiguous location descriptions.
 */
const searchKnownLandmarks = ai.defineTool(
  {
    name: 'searchKnownLandmarks',
    description: 'Searches a database of known Ghanaian landmarks, community names, or previously resolved informal addresses to find their geographic coordinates.',
    inputSchema: z.object({
      query: z.string().describe('The landmark description, informal settlement name, or free-text location to search for.'),
    }),
    outputSchema: z.array(
      z.object({
        name: z.string().describe('The name of the matched location.'),
        coordinates: z.object({ lat: z.number(), lng: z.number() }).describe('The latitude and longitude of the matched location.'),
        type: z.enum(['landmark', 'community', 'informal_settlement']).describe('The type of known location matched.'),
        relevanceScore: z.number().min(0).max(1).describe('A score indicating how relevant the match is to the query.'),
      })
    ).describe('A list of potential matching locations with their coordinates and relevance scores, ordered by relevance.'),
  },
  async (input) => {
    // Simulate database lookup for known Ghanaian landmarks
    const knownLocations = [
      { name: 'Behind Melcom Spintex', coordinates: { lat: 5.6105, lng: -0.1008 }, type: 'landmark', relevanceScore: 0.95 },
      { name: 'Melcom Spintex Road', coordinates: { lat: 5.6100, lng: -0.1010 }, type: 'landmark', relevanceScore: 0.90 },
      { name: 'Opposite Kasoa New Market', coordinates: { lat: 5.5000, lng: -0.4000 }, type: 'landmark', relevanceScore: 0.92 },
      { name: 'Kasoa Market', coordinates: { lat: 5.5005, lng: -0.4005 }, type: 'community', relevanceScore: 0.88 },
      { name: 'Total Junction', coordinates: { lat: 5.6000, lng: -0.1500 }, type: 'landmark', relevanceScore: 0.85 },
      { name: 'Blue Kiosk Adabraka', coordinates: { lat: 5.5700, lng: -0.2000 }, type: 'landmark', relevanceScore: 0.80 },
      { name: 'Achimota Retail Centre', coordinates: { lat: 5.6300, lng: -0.2200 }, type: 'landmark', relevanceScore: 0.98 },
      { name: 'Kwabenya Roundabout', coordinates: { lat: 5.7000, lng: -0.2000 }, type: 'landmark', relevanceScore: 0.90 },
      { name: 'Accra Mall', coordinates: { lat: 5.6200, lng: -0.1700 }, type: 'landmark', relevanceScore: 0.97 },
      { name: 'Circle Overhead', coordinates: { lat: 5.5600, lng: -0.2100 }, type: 'landmark', relevanceScore: 0.93 },
    ];

    const lowerQuery = input.query.toLowerCase();
    const filtered = knownLocations
      .filter(loc => loc.name.toLowerCase().includes(lowerQuery) || lowerQuery.includes(loc.name.toLowerCase().split(' ').slice(0, 2).join(' ')))
      .sort((a, b) => b.relevanceScore - a.relevanceScore); // Sort by relevance

    return filtered.slice(0, 3); // Return top 3 most relevant matches
  }
);

/**
 * Defines the Genkit prompt for interpreting various Ghanaian location inputs.
 * It instructs the LLM to use the `searchKnownLandmarks` tool for landmark and voice-based descriptions.
 */
const resolveLocationPrompt = ai.definePrompt({
  name: 'resolveLocationPrompt',
  input: { schema: GhanaAddressAndVoiceResolutionInputSchema },
  output: { schema: GhanaAddressAndVoiceResolutionOutputSchema },
  tools: [searchKnownLandmarks],
  prompt: `You are an intelligent location resolution engine for a trash hailing service in Ghana. Your task is to accurately convert various user-provided location inputs into precise geographical coordinates (latitude, longitude) and a confidence score.

When processing location requests, consider the following Ghana-specific context:
- Many users may not have formal digital addresses.
- Locations are often described using nearby landmarks, informal settlement names, or community nicknames.
- Voice commands will be transcribed text, potentially informal or in local dialects.

Based on the provided 'locationType' and associated details, resolve the location as follows:

1. If 'locationType' is 'GPS_COORDINATE' or 'MAP_PIN': The coordinates are directly provided. Use them as the resolved coordinates with a high confidence score (0.99) and a simple descriptive address.

2. If 'locationType' is 'GHANA_POST': Interpret the 'ghanaPostAddress'. If you can map it to precise coordinates, do so, perhaps using a general area if a specific coordinate is unknown. Provide a confidence score reflecting your certainty. For example, 'GA-123-4567' might resolve to a specific point, or a broader area if precise mapping is not possible. If resolution is not possible, indicate this with a very low confidence.

3. If 'locationType' is 'LANDMARK' or 'VOICE_COMMAND': This is the most critical part.
   - You MUST use the 'searchKnownLandmarks' tool with the 'landmarkDescription' to find potential matches from known Ghanaian locations.
   - Analyze the tool's output alongside the original 'landmarkDescription' to identify the most accurate coordinates. Prioritize the tool's output if it has a high relevance score and matches the description well.
   - If multiple relevant matches are found, prioritize the one with the highest 'relevanceScore' from the tool, or the one that best fits the natural language description.
   - If the tool returns no matches or highly irrelevant matches, you must attempt to infer a general location based on common knowledge or indicate that resolution is difficult, and assign a lower confidence score (e.g., 0.5 or less).
   - Examples of 'landmarkDescription': "Behind Melcom Spintex", "Opposite Kasoa new market", "After the second gutter near the school", or a location extracted from a voice command like "my house near Total Junction".

Your output MUST conform to the 'GhanaAddressAndVoiceResolutionOutputSchema'. If resolution fails or is highly uncertain, provide a generic coordinate (e.g., center of Accra: {lat: 5.5560, lng: -0.1980}) but with a very low confidence score (e.g., 0.1-0.3) and state the uncertainty in 'resolvedAddress'.

Input details:
locationType: {{{locationType}}}
{{#if gpsCoordinates}}
gpsCoordinates: Lat: {{{gpsCoordinates.lat}}}, Lng: {{{gpsCoordinates.lng}}}
{{/if}}
{{#if ghanaPostAddress}}
ghanaPostAddress: {{{ghanaPostAddress}}}
{{/if}}
{{#if landmarkDescription}}
landmarkDescription: {{{landmarkDescription}}}
{{/if}}
{{#if mapPinCoordinates}}
mapPinCoordinates: Lat: {{{mapPinCoordinates.lat}}}, Lng: {{{mapPinCoordinates.lng}}}
{{/if}}

Think step by step before providing your JSON output.
`,
});

/**
 * Defines the Genkit flow for resolving various Ghanaian location inputs into a standardized coordinate.
 * It handles direct GPS/map pin inputs and uses an AI prompt for more complex landmark/voice-based resolutions.
 */
const ghanaAddressAndVoiceResolutionFlow = ai.defineFlow(
  {
    name: 'ghanaAddressAndVoiceResolutionFlow',
    inputSchema: GhanaAddressAndVoiceResolutionInputSchema,
    outputSchema: GhanaAddressAndVoiceResolutionOutputSchema,
  },
  async (input) => {
    // Directly return if coordinates are already provided (GPS or Map Pin)
    if (input.locationType === 'GPS_COORDINATE' && input.gpsCoordinates) {
      return {
        resolvedCoordinates: input.gpsCoordinates,
        confidenceScore: 0.99,
        resolvedAddress: `GPS: ${input.gpsCoordinates.lat}, ${input.gpsCoordinates.lng}`,
      };
    }
    if (input.locationType === 'MAP_PIN' && input.mapPinCoordinates) {
      return {
        resolvedCoordinates: input.mapPinCoordinates,
        confidenceScore: 0.99,
        resolvedAddress: `Map Pin: ${input.mapPinCoordinates.lat}, ${input.mapPinCoordinates.lng}`,
      };
    }

    // For other types (GHANA_POST, LANDMARK, VOICE_COMMAND), use the AI prompt
    const { output } = await resolveLocationPrompt(input);

    if (!output) {
      // Fallback if the AI prompt fails to return any output
      return {
        resolvedCoordinates: { lat: 5.5560, lng: -0.1980 }, // Center of Accra as a default fallback
        confidenceScore: 0.05,
        resolvedAddress: 'Failed to resolve location from provided input. Please try again or provide more details.',
      };
    }
    return output;
  }
);

/**
 * Resolves a Ghanaian pickup address using various input types, leveraging AI and location intelligence.
 * @param input - The input containing the location type and details.
 * @returns A promise that resolves to the `GhanaAddressAndVoiceResolutionOutput`, containing the resolved coordinates and confidence score.
 */
export async function resolveGhanaAddress(
  input: GhanaAddressAndVoiceResolutionInput
): Promise<GhanaAddressAndVoiceResolutionOutput> {
  return ghanaAddressAndVoiceResolutionFlow(input);
}
