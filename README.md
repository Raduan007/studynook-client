# StudyNook – Library Study Room Booking

StudyNook is a full-stack web application where students and library users can list study rooms they control, and any registered user can browse, search, filter, and book those rooms for a specific date and time slot.

## 🚀 Live Site

[Visit StudyNook Live](https://studynook-client.vercel.app/)

## ✨ Key Features

- **Smart Room Booking:** Select a date and hourly time slots (08:00–20:00), with automatic conflict detection to prevent double-bookings.
- **Secure JWT Authentication:** Email/password and Google OAuth sign-in via Firebase, with tokens stored in HTTP-only cookies for maximum security.
- **Room Management Dashboard:** Room owners can list, edit, and delete their own study rooms from a private `/my-listings` dashboard.
- **My Bookings Dashboard:** Every user has a `/my-bookings` page to view, track status, and cancel upcoming reservations.
- **Search & Filter:** Instantly search rooms by name and filter by amenities (Whiteboard, Projector, Wi-Fi, Power Outlets, etc.) with a responsive chip-based UI.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop — with loading spinners, toast notifications, and a polished UI throughout.

## 🛠️ Technology Stack

- **Frontend Framework:** React 18 + Vite
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router v6
- **State & Auth:** React Context API + Firebase Authentication
- **Data Fetching:** Axios
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Auth Security:** JWT stored in HTTP-only cookies

## 💻 Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Raduan007/studynook-client.git
   cd studynook-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

Configured for SPA deployment with routing rewrite rules for:
- **Vercel** (`vercel.json`)
- **Firebase Hosting** (`firebase.json`)