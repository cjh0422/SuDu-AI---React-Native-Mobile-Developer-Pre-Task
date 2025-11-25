# Production Order Management App

A complete mobile-first Production Order (PO) management system built with **Expo**, **React Native**, and **SQLite**.

Live Demo: Run `npx expo start` → Scan with **Expo Go** on your phone

## Features (All Completed)

- Orders Dashboard with real-time search  
- Create new production order (full form + validation + date picker)  
- Order details screen  
- Instant status update (Pending → In Progress → Completed)  
- Fully persistent SQLite storage (data survives app close/reinstall)  
- Local AI Assistant – smart insights & reminders (100% offline)  
- Clean, modern UI with consistent colors and spacing  
- Dark mode support (system automatic)  
- Multiple floating action buttons (+ and AI)

## Tech Stack

- Expo SDK 54 (Managed workflow)  
- Expo Router (file-based routing)  
- expo-sqlite (synchronous API – lightning fast)  
- Zustand (global state)  
- Day.js (date handling)  
- Pure React Native components

## Project Structure
app/
_layout.tsx         → Root layout + DB init
index.tsx           → Dashboard / Orders list
add-order.tsx       → Create order form
order-detail.tsx    → Order details
ai-assistant.tsx    → Local AI insights

src/
auth/LocalAuth.ts  → Simple local auth (PIN code/FaceID/Fingerprint)
database/db.ts      → SQLite setup & demo data
notification/notifications.ts → Local push notifications
store/usePOstore.ts → Zustand store
theme/ThemeContext.tsx → Theming & dark mode
types/index.ts      → TypeScript types

## Get Started

# 1. Install dependencies
npm install

# 2. Install the correct SQLite version
npx expo install expo-sqlite@latest

# 3. Start the app
npx expo start


## AI Usage Log

1. How to insert data with expo-sqlite?
- Showed runSync() and getAllSync(),
- Used sync API throughout for instant updates
2. Form validation for numeric input
- Suggested Yup + Formik
- Implemented manual checks (lighter & faster)
3. Pass object between screens in expo-router
- JSON.stringify + useLocalSearchParams
- Used exactly this method for order details
4. Write AI analysis logic for POs
- Gave rule-based examples on due date & qty
- Built full AI Assistant screen with cards
5. Conditional styling in React Native
- First gave wrong && {color} syntax
- Fixed to variable-based style after syntax error
6. Multiple floating buttons
- Absolute positioning trick
- Created blue “+” and purple “AI” buttons

Thanks for checking out my Production Order Management App! If you have any questions or feedback, feel free to reach out. 