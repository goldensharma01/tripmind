# TripMind

AI-powered MERN travel itinerary app. Upload flight tickets, hotel bookings, or travel PDFs — TripMind extracts the details with OpenAI and generates a day-by-day itinerary.

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios, react-dropzone, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT + bcryptjs
- **AI:** OpenAI GPT-4o (document extraction + itinerary generation)
- **Uploads:** Multer (local storage)

## Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally or Atlas URI
- OpenAI API key

### Backend

```bash
cd server
npm install
```

Edit `server/.env` with your values, then:

```bash
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Environment Variables

**server/.env**

| Variable | Description |
|----------|-------------|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret for signing tokens |
| JWT_EXPIRES_IN | Token expiry (default 7d) |
| PORT | API port (default 5000) |
| OPENAI_API_KEY | OpenAI API key |
| CLIENT_URL | Frontend URL for CORS |

**client/.env**

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend URL (proxied via Vite in dev) |

## MongoDB Collections

Mongoose creates these automatically:

- **users** — name, email, hashed password
- **uploads** — file metadata + AI extracted data
- **itineraries** — generated trips with days, activities, shareId
