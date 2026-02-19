
# DEMO | Premium Trash Hailing Infrastructure (Ghana)

**DEMO** is a high-fidelity waste management platform designed to digitize refuse collection in Ghana. It functions like a ride-hailing app (Uber/Bolt) but for trash, connecting households and businesses with verified waste collectors through AI-powered classification and dynamic pricing.

---

## 🎬 Video Production Script & Brief

### 1. Project Vision
Sustainable infrastructure for a cleaner, smarter Ghana. DEMO solves the "last-mile" waste problem by providing instant, reliable, and fair-priced pickups in areas with informal addressing.

### 2. Core Storyline: "The Ama & Kwame Scenario"

**Scene 1: The Request (Customer Side)**
*   **Persona:** Ama Owusu, chop bar owner in Madina.
*   **Problem:** End of day, high volume of mixed waste. No formal street name.
*   **Action:** Ama opens the **DEMO** app.
    *   **Landmark Resolution:** She enters "Opposite Yellow Kiosk, Zongo Junction."
    *   **AI Scan:** She takes a photo of the waste.
    *   **AI Insight:** The system identifies: *Mixed Domestic Waste (45kg, 0.6m³).*
    *   **Dynamic Price:** Platform generates a fair quote of **GH₵ 28**.
    *   **Payment:** Ama pays via **MTN Mobile Money**.

**Scene 2: The Acceptance (Collector Side)**
*   **Persona:** Kwame Mensah, Mini-Truck operator.
*   **Action:** Kwame receives a "New Job Alert."
    *   **Mission:** Pickup at Zongo Junction for GH₵ 28.
    *   **Acceptance:** Kwame reviews Ama’s details and accepts.
    *   **Navigation:** Guided routing avoids traffic to reach Ama.

**Scene 3: Fulfillment & Success**
*   **Action:** Kwame arrives, Ama verifies. Kwame loads the truck.
*   **Completion:** Kwame confirms pickup on the app. The vendor's internal processing takes over from here.
*   **Earnings:** Kwame earns **GH₵ 23** instantly (after GH₵ 5 platform commission).

---

## 📱 Page & Feature Guide

### 1. Homepage (`/`)
*   **Hero Section**: High-impact visual branding emphasizing "Trash Hailing Reimagined."
*   **Trust Indicators**: Badges for verified operators, USSD support (*713#), and regional availability (Accra & Kumasi).
*   **Solution Cards**: Clear paths for "Households" (Convenience) and "Business" (Fleet Management).

### 2. Login Portal (`/login`)
*   **Multi-Role Entry**: Dedicated access points for Customers, Collectors, and Admins.
*   **Persona Identification**: Brief descriptions of each role to guide user simulation.

### 3. Customer Dashboard (`/dashboard`)
*   **Pickup Request Form**:
    *   **Step 1: Location**: Choose between Landmarks, GhanaPost Digital Address, or GPS.
    *   **Step 2: AI Scan**: Functional image upload simulating waste classification.
    *   **Step 3: Quote**: Dynamic GHS pricing based on AI analysis.
    *   **Step 4: Dispatch**: Real-time visual confirmation of the matched collector.
*   **Live Tracking**: Interactive map view with collector profile, rating, and direct "Call" functionality.
*   **Impact Metrics**: Real-time tracking of "Total Weight Diversion" and "Total Pickups."

### 4. Collector Dashboard (`/collector`)
*   **Duty Status**: Online/Offline toggle with immediate UI feedback.
*   **Earnings Card**: Professional wallet view showing daily earnings, trip counts, and remaining vehicle capacity.
*   **Incoming Mission**: "Uber-style" overlay for new requests with distance, price, and landmark details.
*   **In-Job Navigation**: One-tap access to navigation and direct customer calling.

### 5. Admin Fleet Command (`/admin`)
*   **Network Overview**: Live stats on active drivers, network revenue, and total pickups.
*   **Live Order Management**: A command center to review, approve, or cancel incoming requests.
*   **Operational Heatmap**: Visualization of network activity and driver distribution.

---

## 🛠 Technical Architecture

*   **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS.
*   **UI Components:** ShadCN UI (Custom Premium Theme).
*   **AI Engine (Genkit):**
    *   **Waste Classification**: Image-to-data flow for volume and type estimation.
    *   **Dynamic Pricing**: Real-time calculation based on fuel, distance, and density.
    *   **Landmark Resolution**: Translating local descriptions into precise GPS coordinates.
*   **Backend:** Genkit Server Actions with simulation capability.

---

© 2025 DEMO Infrastructure. Developed for a Cleaner Ghana.
