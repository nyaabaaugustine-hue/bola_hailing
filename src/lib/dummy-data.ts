/**
 * @fileOverview Local dummy database for testing BorlaHaze with high-fidelity demo data.
 */

export const BOOKING_STATUS = {
  REQUESTED: 'REQUESTED',
  MATCHED: 'MATCHED',
  COLLECTOR_EN_ROUTE: 'COLLECTOR_EN_ROUTE',
  ARRIVED: 'ARRIVED',
  PICKED_UP: 'PICKED_UP',
  DISPOSED: 'DISPOSED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const DEMO_USER = {
  id: "USR001",
  name: "Ama Owusu",
  phone: "0244001122",
  location: {
    type: "LANDMARK",
    description: "Opposite Yellow Kiosk, Zongo Junction, Madina",
    lat: 5.67955,
    lng: -0.16421,
    digitalAddress: "GM-025-1234"
  },
  accountType: "SMALL_BUSINESS",
  defaultPaymentMethod: "MTN_MOMO"
};

export const DEMO_COLLECTOR = {
  id: "COL001",
  name: "Kwame Mensah",
  truckType: "Mini Truck",
  vehicle: "Mini-Truck (GA-292-23)",
  capacity_m3: 1.5,
  acceptedWasteTypes: [
    "MIXED_DOMESTIC",
    "ORGANIC_MARKET",
    "SACHET_PLASTIC"
  ],
  currentLocation: {
    lat: 5.67691,
    lng: -0.16240
  },
  availability: "ONLINE",
  rating: 4.8,
  walletBalance: 0,
  reliabilityScore: 4.8,
  historicalAcceptanceRate: 99,
  image: 'https://picsum.photos/seed/kwame/200/200'
};

export const DEMO_AI_OUTPUT = {
  wasteType: "MIXED_DOMESTIC",
  estimatedVolume_m3: 0.6,
  estimatedWeight_kg: 45,
  hazardDetected: false,
  pickupDifficulty: "LOW",
  requiredTruckType: "Mini Truck"
};

export const DEMO_PRICING = {
  distance_km: 2.3,
  zoneDemandFactor: 1.2,
  fuelIndex: 0.95,
  tippingFee: 4.00,
  serviceUrgency: "NORMAL",
  pickupFee: 28.00,
  platformCommission: 5.00,
  collectorEarnings: 23.00
};

export const DEMO_ROUTING = {
  collectorToPickup: [
    [5.67691, -0.16240],
    [5.67830, -0.16350],
    [5.67955, -0.16421]
  ],
  pickupToLandfill: [
    [5.67955, -0.16421],
    [5.68210, -0.16690],
    [5.68400, -0.17010]
  ],
  etaPickup: "7 mins",
  etaDisposal: "14 mins"
};

export const DEMO_LANDFILL = {
  id: "LAN001",
  name: "Madina Municipal Dump Site",
  lat: 5.68400,
  lng: -0.17010,
  acceptedWasteTypes: [
    "MIXED_DOMESTIC",
    "ORGANIC_MARKET"
  ],
  tippingFee: 4.00,
  queuePrediction: "LOW",
  status: 'Low Traffic',
  time: '14m'
};

export const DEMO_TRANSACTION = {
  transactionId: "TXN983223",
  network: "MTN",
  amount: 28.00,
  status: "SUCCESS",
  timestamp: "2026-02-19T18:34:21Z"
};

export const RECENT_PICKUPS = [
  { id: 'P1', type: 'Organic Waste', date: 'Oct 12, 2025', price: 'GHS 15', loc: 'Madina', status: 'Completed' },
  { id: 'P2', type: 'Plastics (Sachet)', date: 'Oct 08, 2025', price: 'GHS 8', loc: 'Legon', status: 'Completed' },
  { id: 'P3', type: 'Mixed Refuse', date: 'Today', price: 'GHS 28', loc: 'Madina Zongo Junction', status: 'Active' }
];

export const DUMMY_COLLECTORS = [
  {
    collectorId: 'COL001',
    name: 'Kwame Mensah',
    vehicle: 'Mini Truck (GA-292-23)',
    currentLocation: { lat: 5.67691, lng: -0.16240 },
    truckCapacityKg: 1000,
    truckCapacityM3: 1.5,
    acceptedWasteTypes: ['MIXED_DOMESTIC', 'SACHET_PLASTIC', 'ORGANIC_MARKET'],
    reliabilityScore: 4.8,
    historicalAcceptanceRate: 99,
    routeEfficiencyScore: 92,
    isAvailable: true,
    rating: 4.8,
    phone: '+233 24 400 1122',
    image: 'https://picsum.photos/seed/kwame/200/200'
  },
  {
    collectorId: 'COL002',
    name: 'Amara Okafor',
    vehicle: 'Open Bed Truck (GW-102-21)',
    currentLocation: { lat: 5.5600, lng: -0.2100 },
    truckCapacityKg: 2500,
    truckCapacityM3: 3.0,
    acceptedWasteTypes: ['BUILDING_RUBBLE', 'METAL_SCRAP'],
    reliabilityScore: 4.5,
    historicalAcceptanceRate: 92,
    routeEfficiencyScore: 88,
    isAvailable: true,
    rating: 4.7,
    phone: '+233 55 987 6543',
    image: 'https://picsum.photos/seed/amara/200/200'
  }
];

export const DUMMY_LANDFILLS = [
  { id: 'LAN001', name: 'Madina Municipal Dump Site', status: 'Low', time: '14m', fee: 4 },
  { id: 'LAN002', name: 'Mallam Site', status: 'Low', time: '5m', fee: 15 },
  { id: 'LAN003', name: 'Kpone Landfill', status: 'High', time: '45m', fee: 20 }
];

export const ACTIVE_SCENARIO_JOB = {
  pickupId: 'PKP102',
  customerName: 'Ama Owusu',
  landmark: 'Opposite Yellow Kiosk, Zongo Junction',
  wasteType: 'Mixed Domestic Waste',
  volume: '0.6 m3',
  weight: '45kg',
  price: 'GH₵ 28',
  status: 'REQUESTED'
};
