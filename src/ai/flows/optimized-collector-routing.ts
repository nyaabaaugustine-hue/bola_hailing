'use server';
/**
 * @fileOverview An AI agent that optimizes waste collector routes for pickups and disposal.
 *
 * - optimizedCollectorRouting - A function that handles the route optimization process.
 * - OptimizedCollectorRoutingInput - The input type for the optimizedCollectorRouting function.
 * - OptimizedCollectorRoutingOutput - The return type for the optimizedCollectorRouting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LocationSchema = z.object({
  lat: z.number().describe('Latitude of the location.'),
  lng: z.number().describe('Longitude of the location.'),
});

const PickupRequestSchema = z.object({
  pickupId: z.string().describe('Unique identifier for the pickup request.'),
  location: LocationSchema.describe('GPS coordinates for the pickup.'),
  wasteType: z.string().describe('Type of waste to be collected (e.g., "organic", "sachet plastics", "construction rubble").'),
  estimatedVolumeM3: z.number().optional().describe('Estimated volume of waste in cubic meters.'),
  estimatedWeightKg: z.number().optional().describe('Estimated weight of waste in kilograms.'),
});

const LandfillSchema = z.object({
  id: z.string().describe('Unique identifier for the disposal facility.'),
  name: z.string().describe('Name of the disposal facility.'),
  location: LocationSchema.describe('GPS coordinates of the disposal facility.'),
  acceptedWasteTypes: z.array(z.string()).describe('List of waste types accepted by this facility.'),
  predictedQueueTimeHours: z.number().describe('Predicted queue time at the facility in hours.'),
  currentTippingFee: z.number().describe('Current tipping fee at the facility.'),
});

const RouteStepSchema = z.object({
  stepType: z.enum(['pickup', 'disposal']).describe('Type of action for this step (pickup or disposal).'),
  pickupId: z.string().optional().describe('ID of the pickup request, if stepType is pickup.'),
  location: LocationSchema.describe('GPS coordinates for this step.'),
  description: z.string().describe('A brief description of the action at this step.'),
  estimatedTimeMinutes: z.number().describe('Estimated time to complete this step and travel to the next, in minutes.'),
});

const OptimizedCollectorRoutingInputSchema = z.object({
  collectorLocation: LocationSchema.describe('The current GPS coordinates of the waste collector.'),
  pickupRequests: z.array(PickupRequestSchema).describe('A list of pending waste pickup requests.'),
  currentTrafficData: z.string().describe('A descriptive string of current traffic conditions (e.g., "heavy traffic on major arteries", "light traffic").'),
  roadConditions: z.string().describe('General road conditions relevant to Ghana (e.g., "potholed roads in rural areas", "smooth highways").'),
  weatherData: z.string().describe('Current weather conditions (e.g., "heavy rainfall causing floods", "clear and sunny").'),
  landfills: z.array(LandfillSchema).describe('A list of available authorized disposal facilities with their details.'),
  collectorCapacityKg: z.number().describe("The remaining capacity of the collector's truck in kilograms."),
  collectorCapacityM3: z.number().describe("The remaining capacity of the collector's truck in cubic meters."),
  collectorAcceptedWasteTypes: z.array(z.string()).describe('A list of waste types the collector is equipped to handle.'),
  municipalPolicies: z.string().describe('Any relevant municipal policies or guidelines affecting waste disposal (e.g., "all organic waste must go to composting facility A").').optional(),
});
export type OptimizedCollectorRoutingInput = z.infer<typeof OptimizedCollectorRoutingInputSchema>;

const OptimizedCollectorRoutingOutputSchema = z.object({
  optimizedRoute: z.array(RouteStepSchema).describe('A detailed sequence of optimized steps for the collector, including pickups and final disposal.'),
  chosenDisposalFacilityId: z.string().describe('The ID of the chosen disposal facility for the collected waste.'),
  totalEstimatedTravelTimeMinutes: z.number().describe('The total estimated travel and service time for the entire optimized route in minutes.'),
  totalEstimatedFuelConsumptionLitres: z.number().describe('The total estimated fuel consumption for the optimized route in litres.'),
  routeEfficiencyScore: z.number().describe('A score (0-100) indicating the efficiency of the generated route, where 100 is most efficient.'),
  warnings: z.array(z.string()).describe('Any warnings or issues encountered during route generation (e.g., "Collector capacity might be exceeded").').optional(),
});
export type OptimizedCollectorRoutingOutput = z.infer<typeof OptimizedCollectorRoutingOutputSchema>;

export async function optimizedCollectorRouting(input: OptimizedCollectorRoutingInput): Promise<OptimizedCollectorRoutingOutput> {
  return optimizedCollectorRoutingFlow(input);
}

const routeOptimizationPrompt = ai.definePrompt({
  name: 'routeOptimizationPrompt',
  input: {schema: OptimizedCollectorRoutingInputSchema},
  output: {schema: OptimizedCollectorRoutingOutputSchema},
  prompt: `You are an intelligent route optimization engine for a waste collection service operating in Ghana.

Given the following information, your task is to determine the most efficient and compliant route for a waste collector, including a sequence of pickups and the optimal final disposal facility. Prioritize minimizing travel time, fuel consumption, and ensuring compliance with waste type compatibility and municipal policies.

Collector Details:
- Current Location: Lat: {{{collectorLocation.lat}}}, Lng: {{{collectorLocation.lng}}}
- Remaining Capacity: {{{collectorCapacityKg}}} kg, {{{collectorCapacityM3}}} m3
- Accepted Waste Types: {{{collectorAcceptedWasteTypes}}}

Pickup Requests:
{{#each pickupRequests}}
- Pickup ID: {{{this.pickupId}}}
  Location: Lat: {{{this.location.lat}}}, Lng: {{{this.location.lng}}}
  Waste Type: {{{this.wasteType}}}
  Estimated Volume: {{{this.estimatedVolumeM3}}} m3
  Estimated Weight: {{{this.estimatedWeightKg}}} kg
{{/each}}

Environmental & Road Conditions:
- Current Traffic: {{{currentTrafficData}}}
- Road Conditions in Ghana: {{{roadConditions}}}
- Weather Data: {{{weatherData}}}

Available Disposal Facilities (Landfills/Recycling Centers):
{{#each landfills}}
- Facility ID: {{{this.id}}}
  Name: {{{this.name}}}
  Location: Lat: {{{this.location.lat}}}, Lng: {{{this.location.lng}}}
  Accepted Waste Types: {{{this.acceptedWasteTypes}}}
  Predicted Queue Time: {{{this.predictedQueueTimeHours}}} hours
  Current Tipping Fee: {{{this.currentTippingFee}}}
{{/each}}

Municipal Policies (if any): {{{municipalPolicies}}}

Based on this data, provide the optimized route as a sequence of steps. Ensure that:
1. The route starts from the collector's current location.
2. All eligible pickup requests are included, respecting collector capacity and accepted waste types.
3. The chosen disposal facility is compatible with all collected waste types and minimizes overall route time and cost, considering queue times and tipping fees.
4. Ghana's specific traffic, road, and weather conditions are factored into travel time and fuel consumption estimates.
5. The output adheres strictly to the OptimizedCollectorRoutingOutputSchema.

If the collector's capacity is likely to be exceeded or if there are any other significant issues, include appropriate warnings.
`,
});

const optimizedCollectorRoutingFlow = ai.defineFlow(
  {
    name: 'optimizedCollectorRoutingFlow',
    inputSchema: OptimizedCollectorRoutingInputSchema,
    outputSchema: OptimizedCollectorRoutingOutputSchema,
  },
  async (input) => {
    const {output} = await routeOptimizationPrompt(input);
    return output!;
  },
);
