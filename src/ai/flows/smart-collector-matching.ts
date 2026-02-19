'use server';
/**
 * @fileOverview A Genkit flow for matching a user's trash pickup request with the most suitable waste collector.
 *
 * - smartCollectorMatching - A function that handles the smart collector matching process.
 * - SmartCollectorMatchingInput - The input type for the smartCollectorMatching function.
 * - SmartCollectorMatchingOutput - The return type for the smartCollectorMatching function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SmartCollectorMatchingInputSchema = z.object({
  userLocation: z.object({
    lat: z.number().describe('Latitude of the user requesting pickup.'),
    lng: z.number().describe('Longitude of the user requesting pickup.'),
  }).describe('The GPS location of the user requesting trash pickup.'),
  wasteDetails: z.object({
    wasteType: z.string().describe('The primary type of waste (e.g., "sachet plastics", "organic market waste", "construction rubble").'),
    estimatedVolume: z.number().min(0).describe('Estimated volume of waste in cubic meters (m³).'),
    estimatedWeight: z.number().min(0).describe('Estimated weight of waste in kilograms (kg).'),
    requiredTruckType: z.string().optional().describe('Optional: Specific type of truck required if known (e.g., "compactor", "open-bed").'),
  }).describe('Details about the waste to be collected.'),
  availableCollectors: z.array(z.object({
    collectorId: z.string().describe('Unique identifier for the waste collector.'),
    currentLocation: z.object({
      lat: z.number().describe('Latitude of the collector\u0027s current location.'),
      lng: z.number().describe('Longitude of the collector\u0027s current location.'),
    }).describe('The current GPS location of the collector.'),
    truckCapacityKg: z.number().min(0).describe('Maximum waste capacity of the collector\u0027s truck in kilograms (kg).'),
    truckCapacityM3: z.number().min(0).describe('Maximum waste capacity of the collector\u0027s truck in cubic meters (m³).'),
    acceptedWasteTypes: z.array(z.string()).describe('List of waste types the collector is equipped to handle.'),
    reliabilityScore: z.number().min(0).max(100).describe('A score between 0 and 100 indicating reliability.'),
    historicalAcceptanceRate: z.number().min(0).max(100).describe('Percentage between 0 and 100 of jobs historically accepted by this collector.'),
    routeEfficiencyScore: z.number().min(0).max(100).describe('A score between 0 and 100 indicating the efficiency of their typical routes.'),
    isAvailable: z.boolean().describe('True if the collector is currently available for new jobs.'),
  })).min(1).describe('An array of currently available waste collectors with their details.'),
});
export type SmartCollectorMatchingInput = z.infer<typeof SmartCollectorMatchingInputSchema>;

const SmartCollectorMatchingOutputSchema = z.object({
  matchedCollectorId: z.string().describe('The ID of the best-matched collector from the availableCollectors list.'),
  reasoning: z.string().describe('A detailed explanation for why this particular collector was chosen, considering all matching parameters.'),
  matchScore: z.number().min(0).max(100).optional().describe('An optional numerical score (0-100) indicating the quality of the match.'),
}).describe('The result of the smart collector matching process, identifying the optimal collector.');
export type SmartCollectorMatchingOutput = z.infer<typeof SmartCollectorMatchingOutputSchema>;

export async function smartCollectorMatching(input: SmartCollectorMatchingInput): Promise<SmartCollectorMatchingOutput> {
  return smartCollectorMatchingFlow(input);
}

const smartCollectorMatchingPrompt = ai.definePrompt({
  name: 'smartCollectorMatchingPrompt',
  input: { schema: SmartCollectorMatchingInputSchema },
  output: { schema: SmartCollectorMatchingOutputSchema },
  prompt: `You are the Smart Collector Matching Engine for a trash hailing service in Ghana. Your goal is to find the single best waste collector from a list of available collectors for a user's trash pickup request.\n\nConsider the following criteria for an optimal match, prioritizing efficiency, compatibility, and reliability to minimize travel time, idle fuel consumption, and missed service level agreements (SLAs):\n1.  **Collector Proximity:** The closer the collector is to the user, the better.\n2.  **Waste Type Compatibility:** The collector *must* accept the user's waste type.\n3.  **Remaining Capacity:** The collector's truck must have enough capacity (both weight and volume) to handle the user's estimated waste.\n4.  **Reliability Score:** Higher reliability scores are preferred.\n5.  **Historical Acceptance Rate:** Collectors with a higher acceptance rate are preferred.\n6.  **Route Efficiency Score:** Collectors with more efficient typical routes are preferred.\n7.  **Availability:** The collector *must* be marked as available.\n\nHere is the user's trash pickup request:\n- User Location: Latitude {{{userLocation.lat}}}, Longitude {{{userLocation.lng}}}\n- Waste Type: {{{wasteDetails.wasteType}}}\n- Estimated Volume: {{{wasteDetails.estimatedVolume}}} m³\n- Estimated Weight: {{{wasteDetails.estimatedWeight}}} kg\n{{#if wasteDetails.requiredTruckType}}- Required Truck Type: {{{wasteDetails.requiredTruckType}}}{{/if}}\n\nHere is a JSON array of currently available waste collectors. Each collector object contains their details:\n\n```json\n{{{json availableCollectors}}}\n```\n\nAnalyze the user's request and the available collectors thoroughly. Select the single best collector that meets all hard requirements (availability, waste type compatibility, capacity) and scores highest on the soft criteria (proximity, reliability, acceptance rate, route efficiency).\n\nProvide the 'matchedCollectorId' and a clear, concise 'reasoning' for your choice, explaining how the selected collector best fulfills the criteria. An optional 'matchScore' can also be provided.`
});

const smartCollectorMatchingFlow = ai.defineFlow(
  {
    name: 'smartCollectorMatchingFlow',
    inputSchema: SmartCollectorMatchingInputSchema,
    outputSchema: SmartCollectorMatchingOutputSchema,
  },
  async (input) => {
    const { output } = await smartCollectorMatchingPrompt(input);
    if (!output) {
      throw new Error("Failed to match a collector: LLM did not return an output.");
    }
    return output;
  }
);
