/**
 * @fileOverview Local dummy database for testing BorlaHaze.
 */

export const DUMMY_COLLECTORS = [
  {
    collectorId: 'C1',
    name: 'Kojo Mensah',
    vehicle: 'White Box Truck (GA-292-23)',
    currentLocation: { lat: 5.6145, lng: -0.1008 },
    truckCapacityKg: 1000,
    truckCapacityM3: 15,
    acceptedWasteTypes: ['MIXED_DOMESTIC', 'SACHET_PLASTIC', 'ORGANIC_MARKET'],
    reliabilityScore: 98,
    historicalAcceptanceRate: 99,
    routeEfficiencyScore: 92,
    isAvailable: true,
    rating: 4.9,
    phone: '+233 24 123 4567',
    image: 'https://picsum.photos/seed/driver1/200/200'
  },
  {
    collectorId: 'C2',
    name: 'Amara Okafor',
    vehicle: 'Open Bed Truck (GW-102-21)',
    currentLocation: { lat: 5.5600, lng: -0.2100 },
    truckCapacityKg: 2500,
    truckCapacityM3: 30,
    acceptedWasteTypes: ['BUILDING_RUBBLE', 'METAL_SCRAP'],
    reliabilityScore: 95,
    historicalAcceptanceRate: 92,
    routeEfficiencyScore: 88,
    isAvailable: true,
    rating: 4.7,
    phone: '+233 55 987 6543',
    image: 'https://picsum.photos/seed/driver2/200/200'
  },
  {
    collectorId: 'C3',
    name: 'David Tetteh',
    vehicle: 'Compactor Truck (GR-554-24)',
    currentLocation: { lat: 5.6200, lng: -0.1700 },
    truckCapacityKg: 5000,
    truckCapacityM3: 45,
    acceptedWasteTypes: ['MIXED_DOMESTIC', 'ORGANIC_MARKET'],
    reliabilityScore: 99,
    historicalAcceptanceRate: 100,
    routeEfficiencyScore: 95,
    isAvailable: false,
    rating: 5.0,
    phone: '+233 20 555 1212',
    image: 'https://picsum.photos/seed/driver3/200/200'
  }
];

export const DUMMY_LANDFILLS = [
  { id: 'L1', name: 'Kpone Landfill', status: 'Moderate', time: '15m', fee: 25 },
  { id: 'L2', name: 'Mallam Site', status: 'Low', time: '5m', fee: 15 },
  { id: 'L3', name: 'Abelekuma Site', status: 'High', time: '45m', fee: 20 }
];

export const RECENT_PICKUPS = [
  { id: 'P1', type: 'Organic Waste', date: 'Oct 12, 2025', price: 'GHS 15', loc: 'Madina', status: 'Completed' },
  { id: 'P2', type: 'Plastics (Sachet)', date: 'Oct 08, 2025', price: 'GHS 8', loc: 'Legon', status: 'Completed' },
  { id: 'P3', type: 'Mixed Refuse', date: 'Today', price: 'GHS 25', loc: 'East Legon', status: 'Active' }
];
