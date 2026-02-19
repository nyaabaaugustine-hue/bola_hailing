
# DEMO | Premium Trash Hailing Infrastructure (Ghana)

**DEMO** is a high-fidelity waste management platform designed to digitize refuse collection in Ghana. It functions like a ride-hailing app (Uber/Bolt) but for trash, connecting households and businesses with verified waste collectors through AI-powered classification and dynamic pricing.

---

## 🎬 Video Production Script & Brief

### 1. Project Vision
Sustainable infrastructure for a cleaner, smarter Ghana. DEMO solves the "last-mile" waste problem by providing instant, reliable, and fair-priced pickups in areas with informal addressing.

### 2. Core Storyline: "The Ama & Kwame Scenario"

**Scene 1: The Request (Customer Side)**
*   **Persona:** Ama Owusu, chop bar owner in Madina.
*   **Action:** Ama opens the **DEMO** app, enters "Opposite Yellow Kiosk" (Landmark Resolution), takes a photo of waste (AI Scan), and pays via MTN Mobile Money.

**Scene 2: The Acceptance (Collector Side)**
*   **Persona:** Kwame Mensah, Mini-Truck operator.
*   **Action:** Kwame receives a "New Job Alert" on his dashboard, reviews Ama's location, and accepts.

**Scene 3: Fulfillment**
*   **Action:** Kwame arrives (tracked in real-time by Ama). He verifies the pickup and completes the job. No disposal destination is required as Kwame's vendor handles independent processing.

---

## 📱 Page & Feature Guide

### 1. Homepage (`/`)
*   **Hero Section**: High-impact visual branding: "Trash Hailing Reimagined."
*   **Trust Indicators**: Verified operators, USSD support (*713#), and regional availability (Accra & Kumasi).

### 2. Login Portal (`/login`)
*   **Multi-Role Entry**: Dedicated access points for Customers, Collectors, and Admins.

### 3. Customer Dashboard (`/dashboard`)
*   **Pickup Request Form**: Landmark resolution, AI image scan, and dynamic pricing.
*   **Live Tracking**: Real-time visual confirmation of the matched collector (Currently Simulated).
*   **Direct Communication**: Integrated "Call Driver" functionality.

### 4. Collector Dashboard (`/collector`)
*   **Duty Status**: Online/Offline toggle with immediate UI feedback.
*   **Earnings Card**: Professional wallet view showing daily earnings and trip counts.
*   **Mission Control**: Detailed job view with landmark details and "Call Customer" option.

### 5. Admin Fleet Command (`/admin`)
*   **Network Overview**: Live stats on drivers, revenue, and total pickups.
*   **Order Management**: Review, approve, or cancel incoming requests in real-time.

---

## 🚀 Production Roadmap: Real-Time Tracking

To move from simulation to production-ready GPS tracking, the following are required:

1.  **Google Maps API Key**:
    *   Enable **Maps JavaScript API** (for the map).
    *   Enable **Places API (New)** (for landmark resolution).
2.  **Firestore Real-Time Sync**:
    *   Replace `dummy-data.ts` with Firestore listeners on the `/jobs/{jobId}` collection.
    *   The `liveCollectorLocation` field in Firestore will drive the truck icon on Ama's map.
3.  **Geolocation API**:
    *   The Collector app will use `navigator.geolocation.watchPosition()` to push coordinates to Firestore every 5-10 seconds.
