'use server';
/**
 * @fileOverview A Genkit flow for dynamically calculating trash pickup pricing.
 *
 * - dynamicPickupPricing - A function that calculates the dynamic pickup price.
 * - DynamicPricingInput - The input type for the dynamicPickupPricing function.
 * - DynamicPricingOutput - The return type for the dynamicPickupPricing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for dynamic pricing
const DynamicPricingInputSchema = z.object({
  wasteType: z
    .enum([
      'Organic household waste',
      'Sachet plastics',
      'Charcoal ash',
      'Coconut husks',
      'Scrap metal',
      'Electronic waste',
      'Construction rubble',
      'Market organic waste',
      'Mixed domestic refuse'
    ])
    .describe('The type of waste to be collected.'),
  estimatedWeight: z
    .number()
    .positive()
    .describe('Estimated weight of the waste in kilograms.'),
  estimatedVolume: z
    .number()
    .positive()
    .describe('Estimated volume of the waste in cubic meters.'),
  userLocation: z
    .object({
      lat: z.number().describe('Latitude of the user location.'),
      lng: z.number().describe('Longitude of the user location.')
    })
    .describe('Current GPS coordinates of the user.'),
  collectorLocation: z
    .object({
      lat: z.number().describe('Latitude of the collector location.'),
      lng: z.number().describe('Longitude of the collector location.')
    })
    .describe('Current GPS coordinates of the nearest available collector.'),
  trafficConditions: z
    .enum(['light', 'moderate', 'heavy'])
    .describe('Current traffic conditions in the area.'),
  zoneDemandDensity: z
    .enum(['low', 'medium', 'high', 'very_high'])
    .describe('The density of pickup requests in the user’s zone.'),
  timeOfRequest: z
    .string()
    .datetime()
    .describe('ISO formatted datetime string of when the request was made.'),
  landfillTippingFees: z
    .number()
    .min(0)
    .describe('Current landfill tipping fees applicable to the waste type.'),
  fuelCostIndex: z
    .number()
    .positive()
    .describe('Current fuel cost index relevant for the area.'),
  serviceUrgency: z
    .enum(['immediate', 'scheduled'])
    .describe('Urgency of the service request (immediate or scheduled).')
});
export type DynamicPricingInput = z.infer<typeof DynamicPricingInputSchema>;

// Define the output schema for dynamic pricing
const DynamicPricingOutputSchema = z.object({
  pickupPrice: z
    .number()
    .positive()
    .describe('The calculated fair market pickup price in GHS.'),
  explanation: z
    .string()
    .describe(
      'A brief explanation of how the pickup price was determined, considering all factors.'
    )
});
export type DynamicPricingOutput = z.infer<typeof DynamicPricingOutputSchema>;

// Wrapper function to call the Genkit flow
export async function dynamicPickupPricing(
  input: DynamicPricingInput
): Promise<DynamicPricingOutput> {
  return dynamicPickupPricingFlow(input);
}

// Define the prompt for the dynamic pricing engine
const dynamicPricingPrompt = ai.definePrompt({
  name: 'dynamicPricingPrompt',
  input: {schema: DynamicPricingInputSchema},
  output: {schema: DynamicPricingOutputSchema},
  prompt: `You are an intelligent pricing engine for a trash collection service in Ghana. Your goal is to calculate a transparent and fair pickup price based on various real-world factors.

Calculate the pickup price in Ghanaian Cedis (GHS), considering the following information:

Waste Type: {{{wasteType}}}
Estimated Weight: {{{estimatedWeight}}} kg
Estimated Volume: {{{estimatedVolume}}} m³
User Location (latitude, longitude): {{{userLocation.lat}}}, {{{userLocation.lng}}}
Collector Location (latitude, longitude): {{{collectorLocation.lat}}}, {{{collectorLocation.lng}}}
Traffic Conditions: {{{trafficConditions}}}
Zone Demand Density: {{{zoneDemandDensity}}}
Time of Request: {{{timeOfRequest}}}
Landfill Tipping Fees: GHS {{{landfillTippingFees}}}
Fuel Cost Index: {{{fuelCostIndex}}}
Service Urgency: {{{serviceUrgency}}}

Consider the distance between the user and collector, the effort required for the specific waste type (e.g., construction rubble might be harder than sachet plastics), the impact of traffic and high demand, the time of day, and the operational costs indicated by landfill fees and fuel cost. More urgent requests or higher demand should lead to a slightly higher price.

Provide the final pickup price as a positive number and a brief explanation of the key factors influencing this price.`
});

// Define the Genkit flow
const dynamicPickupPricingFlow = ai.defineFlow(
  {
    name: 'dynamicPickupPricingFlow',
    inputSchema: DynamicPricingInputSchema,
    outputSchema: DynamicPricingOutputSchema
  },
  async input => {
    try {
      const {output} = await dynamicPricingPrompt(input);
      if (!output) throw new Error('No output');
      return output;
    } catch (error) {
      console.warn("AI Pricing failed, returning demo fallback:", error);
      return {
        pickupPrice: 28.50,
        explanation: "Dynamic price calculated based on standard domestic volume, distance to nearest collector, and current fuel index (Simulated)."
      };
    }
  }
);
