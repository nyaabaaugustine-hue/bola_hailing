'use server';
/**
 * @fileOverview This file implements a Genkit flow for resolving pickup locations in Ghana.
 * It handles various input types including GPS coordinates, GhanaPost digital addresses,
 * landmark descriptions, and transcribed voice commands, prioritizing landmark and voice resolution.
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
 * Searches for places in Ghana using the Google Places Autocomplete API via RapidAPI.
 */
const googlePlacesAutocomplete = ai.defineTool(
  {
    name: 'googlePlacesAutocomplete',
    description: 'Searches for places, addresses, or landmarks in Ghana using the Google Places Autocomplete API.',
    inputSchema: z.object({
      query: z.string().describe('The search string (e.g., landmark, street name, or business).'),
    }),
    outputSchema: z.any().describe('The autocomplete predictions from Google Maps.'),
  },
  async (input) => {
    if (!process.env.RAPIDAPI_KEY) {
      console.warn('RAPIDAPI_KEY is not set. Falling back to simulated landmark search.');
      return [];
    }

    try {
      const response = await fetch('https://google-map-places-new-v2.p.rapidapi.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'google-map-places-new-v2.p.rapidapi.com',
          'Content-Type': 'application/json',
          'X-Goog-FieldMask': 'suggestions.placePrediction.text'
        },
        body: JSON.stringify({
          input: input.query,
          locationBias: {
            circle: {
              center: { latitude: 5.6037, longitude: -0.1870 }, // Default to Accra center
              radius: 50000
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`RapidAPI request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling Google Places API:', error);
      return [];
    }
  }
);

/**
 * Simulates searching a database of known Ghanaian landmarks.
 */
const searchKnownLandmarks = ai.defineTool(
  {
    name: 'searchKnownLandmarks',
    description: 'Searches a local database of known Ghanaian landmarks to find coordinates.',
    inputSchema: z.object({
      query: z.string().describe('The landmark description to search for.'),
    }),
    outputSchema: z.array(
      z.object({
        name: z.string(),
        coordinates: z.object({ lat: z.number(), lng: z.number() }),
        relevanceScore: z.number(),
      })
    ),
  },
  async (input) => {
    const knownLocations = [
      { name: 'Behind Melcom Spintex', coordinates: { lat: 5.6105, lng: -0.1008 }, relevanceScore: 0.95 },
      { name: 'Opposite Kasoa New Market', coordinates: { lat: 5.5000, lng: -0.4000 }, relevanceScore: 0.92 },
      { name: 'Total Junction', coordinates: { lat: 5.6000, lng: -0.1500 }, relevanceScore: 0.85 },
      { name: 'Accra Mall', coordinates: { lat: 5.6200, lng: -0.1700 }, relevanceScore: 0.97 },
      { name: 'Circle Overhead', coordinates: { lat: 5.5600, lng: -0.2100 }, relevanceScore: 0.93 },
    ];

    const lowerQuery = input.query.toLowerCase();
    return knownLocations
      .filter(loc => loc.name.toLowerCase().includes(lowerQuery))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);
  }
);

const resolveLocationPrompt = ai.definePrompt({
  name: 'resolveLocationPrompt',
  input: { schema: GhanaAddressAndVoiceResolutionInputSchema },
  output: { schema: GhanaAddressAndVoiceResolutionOutputSchema },
  tools: [searchKnownLandmarks, googlePlacesAutocomplete],
  prompt: `You are an intelligent location resolution engine for a trash hailing service in Ghana. Your task is to accurately convert various user-provided location inputs into precise geographical coordinates (latitude, longitude) and a confidence score.

When processing location requests, consider:
- Users often describe locations using landmarks or informal settlement names.
- Use the 'googlePlacesAutocomplete' tool for general address searches.
- Use 'searchKnownLandmarks' for specific Ghanaian informal landmarks.

Input details:
locationType: {{{locationType}}}
{{#if ghanaPostAddress}}ghanaPostAddress: {{{ghanaPostAddress}}}{{/if}}
{{#if landmarkDescription}}landmarkDescription: {{{landmarkDescription}}}{{/if}}

Think step by step before providing your JSON output.`,
});

const ghanaAddressAndVoiceResolutionFlow = ai.defineFlow(
  {
    name: 'ghanaAddressAndVoiceResolutionFlow',
    inputSchema: GhanaAddressAndVoiceResolutionInputSchema,
    outputSchema: GhanaAddressAndVoiceResolutionOutputSchema,
  },
  async (input) => {
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

    const { output } = await resolveLocationPrompt(input);
    return output || {
      resolvedCoordinates: { lat: 5.5560, lng: -0.1980 },
      confidenceScore: 0.05,
      resolvedAddress: 'Failed to resolve location.',
    };
  }
);

export async function resolveGhanaAddress(
  input: GhanaAddressAndVoiceResolutionInput
): Promise<GhanaAddressAndVoiceResolutionOutput> {
  return ghanaAddressAndVoiceResolutionFlow(input);
}
