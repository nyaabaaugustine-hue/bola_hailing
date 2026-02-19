import { config } from 'dotenv';
config();

import '@/ai/flows/waste-image-classification-flow.ts';
import '@/ai/flows/optimized-collector-routing.ts';
import '@/ai/flows/dynamic-pickup-pricing-flow.ts';
import '@/ai/flows/smart-collector-matching.ts';
import '@/ai/flows/ghana-address-voice-resolution.ts';