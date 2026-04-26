# 🚀 SmartChain AI – Predictive Logistics Intelligence

An AI-powered logistics platform that transforms basic shipment tracking into **predictive intelligence** by analyzing real-time data and providing explainable AI risk assessments.

---

## 🎯 The Problem

Traditional logistics systems only answer:
👉 *“Where is my package?”*

They do **NOT** answer:
👉 *“What will happen to my delivery?”*

---

## 💡 Our Solution

SmartChain AI goes beyond tracking locations. It provides deep predictive intelligence by:
* **Analyzing Live Conditions:** Factors in real-time weather and traffic conditions.
* **Predicting Delivery Risks:** Automatically flags shipments as High, Medium, or Low risk.
* **Providing Explainable AI Insights:** Uses Google Gemini AI to give human-readable reasons for potential delays or risks.

---

## 🔥 Key Features

* 📍 **Real-Time Route Visualization:** Interactive, animated maps powered by Leaflet and CartoDB.
* 🌦️ **Environmental Awareness:** Integrates OpenWeather API to detect storms, heavy rain, or extreme heat.
* 🚗 **Smart Routing:** Uses OSRM (Open Source Routing Machine) for accurate pathfinding and distance calculation.
* 🤖 **Explainable AI Reasoning:** Leverages Google Gemini to explain *why* a shipment is at risk.
* 📊 **Interactive Dashboard:** Beautiful, dark-themed UI with real-time charts (Recharts) and glassmorphism design.

---

## ⚙️ Tech Stack

**Frontend:**
* ⚛️ **React 18** (built with Vite)
* 📘 **TypeScript** for type safety
* 🎨 **Tailwind CSS v4** for modern, responsive utility styling
* 🗺️ **Leaflet / React-Leaflet** for high-performance mapping
* 📈 **Recharts** for data visualization
* 🎬 **Framer Motion** for smooth UI animations

**Backend & Database (BaaS):**
* 🗄️ **Supabase** (PostgreSQL) for persistent data storage and real-time updates

**AI & External APIs:**
* ✨ **Google Gemini Pro** (AI insights & risk generation)
* 🗺️ **OSRM API** (Road routing & coordinates)
* 🌦️ **OpenWeather API** (Live weather conditions)

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/Kanchi2006/smart-route-ai.git
cd smart-route-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
VITE_SUPABASE_URL="your_supabase_url"
VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_anon_key"
VITE_GEMINI_API_KEY="your_gemini_api_key"
```

### 4. Start the Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🧠 Example AI Output

```yaml
Route: Bangalore → Delhi  
Risk: High  
Status: Delayed  
Reason: "Severe thunderstorms detected near Hyderabad causing significant traffic congestion on NH44. Expect delays of 4-6 hours."
```
