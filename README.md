
# DEMO | Premium Trash Hailing Infrastructure (Ghana)

**DEMO** is a high-fidelity waste management platform designed to digitize refuse collection in Ghana. It functions like a ride-hailing app (Uber/Bolt) but for trash, connecting households and businesses with verified waste collectors through AI-powered classification and dynamic pricing.

---

## 🎬 Video Production Script & Brief

### 1. Project Vision
Sustainable infrastructure for a cleaner, smarter Ghana. DEMO solves the "last-mile" waste problem by providing instant, reliable, and fair-priced pickups in areas with informal addressing.

### 2. Core Storyline: "The Ama & Kwame Scenario"

**Scene 1: The Request (Customer Side)**
*   **Persona:** Ama Owusu, chop bar owner in Madina.
*   **Action:** Ama opens the **DEMO** app.
    *   **Landmark Resolution:** She enters "Opposite Yellow Kiosk, Zongo Junction."
    *   **AI Scan:** She takes a photo of the waste.
    *   **AI Insight:** Identifies *Mixed Domestic Waste (45kg, 0.6m³).*
    *   **Dynamic Price:** Quote generated: **GH₵ 28**.
    *   **Payment:** Paid via **MTN Mobile Money**.

**Scene 2: The Acceptance (Collector Side)**
*   **Persona:** Kwame Mensah, Mini-Truck operator.
*   **Action:** Kwame receives a "New Job Alert" for Zongo Junction.
    *   **Acceptance:** Kwame reviews Ama’s details and accepts.
    *   **Navigation:** Guided routing avoids traffic to reach Ama.

**Scene 3: Fulfillment**
*   **Action:** Kwame arrives, Ama verifies. Kwame loads the truck.
*   **Completion:** Kwame confirms pickup. The platform journey ends here as the vendor handles internal processing.

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
*   **Impact Metrics**: Real-time tracking of "Total Weight Diversion."

### 4. Collector Dashboard (`/collector`)
*   **Duty Status**: Online/Offline toggle with immediate UI feedback.
*   **Earnings Card**: Professional wallet view showing daily earnings and trip counts.
*   **Incoming Mission**: "Uber-style" overlay for new requests with price and landmark details.

### 5. Admin Fleet Command (`/admin`)
*   **Network Overview**: Live stats on drivers, revenue, and total pickups.
*   **Order Management**: Review, approve, or cancel incoming requests.

---

## 🚀 Future Roadmap: Real-Time Tracking Requirements

To move from simulation to production-ready GPS tracking, the following are required:
1.  **Google Maps API Key**: Enabling the Maps JavaScript SDK.
2.  **Firestore Real-Time Sync**: Replacing `dummy-data.ts` with a Firestore listener on the `/jobs/{jobId}` path.
3.  **Geolocation API**: Utilizing `navigator.geolocation.watchPosition()` on the Collector's device.
