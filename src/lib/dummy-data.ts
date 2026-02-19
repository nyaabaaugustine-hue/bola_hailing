/**
 * @fileOverview Local dummy database for testing BorlaHaze.
 */

export const DUMMY_COLLECTORS = [
  {
    collectorId: 'C1',
    name: 'Kwame Asante',
    vehicle: 'Standard Mini-Truck (GA-292-23)',
    currentLocation: { lat: 5.6145, lng: -0.1008 },
    truckCapacityKg: 1000,
    truckCapacityM3: 15,
    acceptedWasteTypes: ['MIXED_DOMESTIC', 'SACHET_PLASTIC', 'ORGANIC_MARKET'],
    reliabilityScore: 4.8,
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
    reliabilityScore: 4.5,
    historicalAcceptanceRate: 92,
    routeEfficiencyScore: 88,
    isAvailable: true,
    rating: 4.7,
    phone: '+233 55 987 6543',
    image: 'https://picsum.photos/seed/driver2/200/200'
  }
];

export const DUMMY_LANDFILLS = [
  { id: 'L1', name: 'Madina Municipal Dump Site', status: 'Moderate', time: '15m', fee: 25 },
  { id: 'L2', name: 'Mallam Site', status: 'Low', time: '5m', fee: 15 },
  { id: 'L3', name: 'Kpone Landfill', status: 'High', time: '45m', fee: 20 }
];

export const RECENT_PICKUPS = [
  { id: 'P1', type: 'Organic Waste', date: 'Oct 12, 2025', price: 'GHS 15', loc: 'Madina', status: 'Completed' },
  { id: 'P2', type: 'Plastics (Sachet)', date: 'Oct 08, 2025', price: 'GHS 8', loc: 'Legon', status: 'Completed' },
  { id: 'P3', type: 'Mixed Refuse', date: 'Today', price: 'GHS 28', loc: 'Madina Zongo Junction', status: 'Active' }
];

export const ACTIVE_SCENARIO_JOB = {
  pickupId: 'JOB-AMADINA-001',
  customerName: 'Ama (Chop Bar)',
  landmark: 'Opposite Yellow Kiosk near Zongo Junction',
  wasteType: 'Mixed Domestic Waste',
  volume: '0.6 m3',
  weight: '45kg',
  price: 'GH₵ 28',
  status: 'Pending Acceptance'
};
