
/**
 * @fileOverview Local dummy database for testing DEMO with high-fidelity demo data.
 * NOTE: For production real-time tracking, these objects would be moved to Firestore.
 */

export const BOOKING_STATUS = {
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  MATCHED: 'MATCHED',
  COLLECTOR_EN_ROUTE: 'COLLECTOR_EN_ROUTE',
  ARRIVED: 'ARRIVED',
  PICKED_UP: 'PICKED_UP',
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
  // Production Note: These coordinates would be updated via watchPosition() in real-time
  currentLocation: {
    lat: 5.67691,
    lng: -0.16240
  },
  availability: "ONLINE",
  rating: 4.8,
  walletBalance: 420.50,
  reliabilityScore: 4.8,
  historicalAcceptanceRate: 99,
  image: 'https://picsum.photos/seed/kwame/200/200',
  phone: "0559876543"
};

export const DUMMY_ORDERS = [
  {
    id: 'ORD-101',
    customer: 'Ama Owusu',
    phone: '0244001122',
    location: 'Zongo Junction, Madina',
    wasteType: 'Mixed Domestic',
    status: 'REQUESTED',
    price: 'GHS 28',
    time: '2 mins ago'
  },
  {
    id: 'ORD-102',
    customer: 'John Doe',
    phone: '0555123456',
    location: 'Circle Station',
    wasteType: 'Sachet Plastics',
    status: 'APPROVED',
    price: 'GHS 15',
    time: '15 mins ago'
  }
];

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
  tippingFee: 0,
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
  etaPickup: "4 mins"
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
    phone: '0559876543',
    image: 'https://picsum.photos/seed/kwame/200/200'
  }
];

export const ACTIVE_SCENARIO_JOB = {
  pickupId: 'PKP102',
  customerName: 'Ama Owusu',
  customerPhone: '0244001122',
  landmark: 'Opposite Yellow Kiosk, Zongo Junction',
  wasteType: 'Mixed Domestic Waste',
  volume: '0.6 m3',
  weight: '45kg',
  price: 'GH₵ 28',
  status: 'REQUESTED'
};
