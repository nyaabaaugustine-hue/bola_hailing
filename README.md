
# DEMO | Premium Trash Hailing Infrastructure (Ghana)

**DEMO** is a high-fidelity waste management platform designed to digitize refuse collection in Ghana. It functions like a ride-hailing app (Uber/Bolt) but for trash, connecting households and businesses with verified waste collectors through AI-powered classification and dynamic pricing.

---

## 🎬 Video Production Script & Brief

### 1. Project Vision
Sustainable infrastructure for a cleaner, smarter Ghana. DEMO solves the "last-mile" waste problem by providing instant, reliable, and fair-priced pickups in areas with informal addressing.

### 2. Core Storyline: "The Ama & Kwame Scenario"

**Scene 1: The Request (Customer Side)**
*   **Persona:** Ama Owusu, chop bar owner in Madina.
*   **Problem:** End of day, high volume of mixed waste (food leftovers, sachet plastics, ash). No formal street name.
*   **Action:** Ama opens the **DEMO** app.
    *   **Landmark Resolution:** She enters "Opposite Yellow Kiosk, Zongo Junction."
    *   **AI Scan:** She takes a photo of the waste.
    *   **AI Insight:** The system identifies: *Mixed Domestic Waste (45kg, 0.6m³).*
    *   **Dynamic Price:** Platform generates a fair quote of **GH₵ 28**.
    *   **Payment:** Ama pays via **MTN Mobile Money**.

**Scene 2: The Acceptance (Collector Side)**
*   **Persona:** Kwame Mensah, Mini-Truck operator.
*   **Action:** Kwame is online and receives a "New Job Alert."
    *   **Mission:** Pickup at Zongo Junction for GH₵ 28.
    *   **Acceptance:** Kwame reviews Ama’s rating and accepts.
    *   **Navigation:** Guided routing avoids traffic and potholes.

**Scene 3: Fulfillment & Disposal**
*   **Action:** Kwame arrives, Ama verifies. Kwame loads the truck.
*   **Disposal:** The app routes Kwame to the nearest compatible authorized landfill (Madina Municipal Dump Site).
*   **Earnings:** Kwame earns **GH₵ 23** instantly (after GH₵ 5 platform commission).

**Scene 4: Fleet Command (Admin Side)**
*   **Action:** Operations managers monitor the live heatmap.
*   **Impact:** Real-time data on weight diversion and fleet efficiency.

---

## 🛠 Technical Architecture

*   **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS.
*   **UI Components:** ShadCN UI (Custom Premium Theme).
*   **AI Engine (Genkit):**
    *   **Waste Classification:** Image-to-data flow for volume and type estimation.
    *   **Dynamic Pricing:** Real-time calculation based on fuel, distance, and tipping fees.
    *   **Landmark Resolution:** Translating local descriptions into precise GPS coordinates.
    *   **Route Optimization:** Multi-stop routing for collectors.
*   **Backend:** Genkit Server Actions with Firebase integration capability.

---

## 🚀 Key Value Propositions

1.  **Landmark Intelligence:** No digital address required. We understand "Yellow Kiosk" logic.
2.  **Visual Quotes:** Stop haggling. AI sees the trash and sets a fair price.
3.  **MoMo Integration:** Seamless cashless transactions for a digitized economy.
4.  **Authorized Disposal:** We ensure trash goes to landfills, not gutters.

---

© 2025 DEMO Infrastructure. Developed for a Cleaner Ghana.
