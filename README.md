# Wedding Interactive Website - AI Agent Context

## 
 Project Goal

This project is a Node.js-powered website for our wedding. The primary objective is to create a **memorable, interactive experience for all guests**, making it easy to contribute and relive the event.

**Key Guest Interactions:**
- Watch our wedding video.
- Share their personal photos and videos from the event (to a shared gallery).
- Sign a digital guestbook.
- See an interactive map displaying where visitors are viewing the site from, with auto-pinned locations.

---

## 
 Key Features - Detailed Implementation Requirements

*This section provides specific tasks the AI should focus on for each feature.*

### 1. Wedding Video Playback
- **Requirement:** Securely host and stream our wedding video.
- **Implementation Note:** Video file `wedding_video.mp4` will be placed in `/public/videos`. The backend should serve this file efficiently. Frontend needs a simple HTML5 video player.

### 2. Shared Photo/Video Album
- **Requirement:** Guests can upload pictures and videos, displayed in a gallery. Needs moderation.
- **Backend:**
    - API endpoint for secure media uploads (`POST /api/album/upload`).
    - API endpoint to retrieve all approved media (`GET /api/album`).
    - API endpoint for moderation (`POST /api/album/moderate` - admin only, for approve/remove).
    - Media should be stored in the `/uploads` directory.
    - Database entries for each upload: `filename`, `filepath`, `mimetype`, `uploadedBy`, `timestamp`, `approved` (boolean, default false).
- **Frontend:**
    - An upload form allowing guests to select files.
    - A gallery component to display uploaded and *approved* photos/videos.

### 3. Digital Guestbook
- **Requirement:** Guests can leave messages, wishes, and memories, displayed chronologically.
- **Backend:**
    - API endpoint for submitting guestbook entries (`POST /api/guestbook`).
    - API endpoint to retrieve all entries (`GET /api/guestbook`).
    - Database entries for each message: `name` (optional), `message`, `timestamp`.
- **Frontend:**
    - A form for submitting messages.
    - A section to display all guestbook messages in reverse chronological order (newest first).

### 4. Interactive Visitor Map
- **Requirement:** Uses IP geolocation to auto-pin locations of site visitors; updates in real-time.
- **Backend:**
    - Middleware to capture visitor IP addresses on *every page load*.
    - Geolocation lookup (using a service like ip-api.com, ensure API key/rate limits are considered).
    - API endpoint to retrieve visitor locations (`GET /api/map/locations`).
    - Database entries for visitor logs: `ip_address`, `latitude`, `longitude`, `city`, `country`, `timestamp`.
    - **Crucial:** Implement IP address rate limiting or daily aggregation to avoid excessive database writes and geolocation API calls.
- **Frontend:**
    - Integrate with a mapping API (Google Maps preferred).
    - Initialize map centered on a general area (e.g., world map).
    - Fetch visitor locations from backend and display them as pins on the map.
    - Implement real-time updates (e.g., using WebSockets or periodic AJAX requests).

---

## 
 Tech Stack - Confirmed Choices

*This section helps the AI focus on specific technologies for implementation.*

- **Backend:** Node.js, Express.js (for routing)
- **Frontend:** React (create a `frontend/` directory with a standard React setup)
- **Database:** MongoDB (using Mongoose for schema definition)
- **Mapping API:** Google Maps Platform (requires API Key)
- **Geolocation API:** `ip-api.com` (free tier, consider paid if expecting high traffic, API key might not be required for free tier but check docs)
- **Storage:** Local file system (`/uploads` directory)
- **Authentication:** None required for viewing. For uploads/moderation, simple token-based or API key auth might be considered if truly needed for admin. (Initially, no auth for guest uploads for simplicity, moderation handled separately.)

---

## 
 Directory Structure - Confirmed

*This structure should be respected for all code generation and file operations.*

/wedding-site/
├── .env.example
├── package.json
├── README.md
├── public/                 # Static assets for the frontend
│   └── videos/
│       └── wedding_video.mp4
├── uploads/                # Directory for uploaded guest media (needs write permissions)
├── backend/
│   ├── models/             # Mongoose schemas (User.js, Photo.js, GuestbookEntry.js, VisitorLog.js)
│   ├── routes/             # Express route definitions (auth.js, video.js, album.js, guestbook.js, map.js)
│   ├── controllers/        # Business logic for routes
│   │   ├── authController.js
│   │   ├── videoController.js
│   │   ├── albumController.js
│   │   ├── guestbookController.js
│   │   └── mapController.js
│   ├── utils/              # Utility functions (e.g., geolocation, error handling)
│   │   ├── geo.js
│   │   └── errorHandler.js
│   └── config/             # Database connection, app settings
│       └── db.js
└── frontend/               # React application
├── public/
├── src/
│   ├── components/     # Reusable React components (VideoPlayer.jsx, Gallery.jsx, GuestbookForm.jsx, MapViewer.jsx)
│   ├── pages/          # Page-level components (HomePage.jsx, AlbumPage.jsx, GuestbookPage.jsx, MapPage.jsx)
│   ├── services/       # API interaction logic
│   │   ├── api.js
│   │   └── authService.js (if auth is added later)
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
└── vite.config.js      # Or similar build config


---

## 
 Setup & Execution Instructions for AI Agent

*This section tells the AI how to interact with the project environment (run commands, etc.).*

1.  **Initial Setup:**
    - Ensure `MongoDB` is running locally or provide connection string via `.env`.
    - Create a `.env` file at the project root based on `.env.example`. Required variables:
        - `PORT=3000`
        - `MONGODB_URI=mongodb://localhost:27017/wedding_site`
        - `Maps_API_KEY=YOUR_API_KEY`
        - `IP_GEOLOCATION_API_KEY=YOUR_API_KEY` (if `ip-api.com` requires one for your usage or if using another service)

2.  **Install Dependencies:**
    - From the project root (`/wedding-site`): `npm install`
    - For frontend: `cd frontend && npm install`

3.  **Run the Server:**
    - From the project root (`/wedding-site`): `npm run dev` (This script should be added to `package.json` to concurrently start both backend and frontend).
        *If concurrent startup is complex, provide separate commands:*\
        - Backend: `cd backend && node server.js`
        - Frontend: `cd frontend && npm run dev`

4.  **Run Tests:**
    - Backend tests: `cd backend && npm test`
    - Frontend tests: `cd frontend && npm test` (or `cd frontend && npm run test` if applicable)

---

## 
 High-Level Architecture Overview for AI

*This section helps the AI understand the system flow.*

- **Mono-repository Structure:** The project is structured as a mono-repo with a `backend/` (Node.js/Express) and `frontend/` (React) directory.
- **Node.js Server (`server.js`):**
    - Acts as the main entry point, serving the React app.
    - Handles all API requests (video, album, guestbook, map).
    - Connects to MongoDB.
    - Manages file uploads to `/uploads`.
- **Express Routes:** Define the API endpoints listed below.
- **MongoDB:** Centralized data storage for media metadata, guestbook entries, and visitor logs.
- **React Frontend:** Displays UI, interacts with backend APIs, renders video player, gallery, guestbook, and map.
- **Moderation:** Initially, a manual process. The AI should consider how to build the foundation for future moderation features.

### Key Routes (Expected)

- **`/`**: Serves the main frontend React application.
- **`/api/video`**: Endpoint to serve `wedding_video.mp4`.
- **`/api/album`**:
    - `GET /api/album`: Retrieve approved media list.
    - `POST /api/album/upload`: Handle media uploads.
- **`/api/guestbook`**:
    - `GET /api/guestbook`: Retrieve guestbook entries.
    - `POST /api/guestbook`: Submit new guestbook entry.
- **`/api/map/locations`**: `GET /api/map/locations`: Retrieve visitor geolocation data.
- **`/api/map/log-visit`**: `POST /api/map/log-visit`: Endpoint for frontend to ping for visitor logging.

---

## 
 AI Agent Guidance - Specific Directives

*This section provides explicit instructions on how the AI should approach tasks.*

- **Prioritize Modular Design:** Create distinct modules (controllers, models, routes, components, services) as per the `Directory Structure` section.
- **Frontend Framework:** Use **React** for the frontend. Set up a standard React project within the `frontend/` directory (e.g., using Vite or Create React App).
- **Database ORM:** Use **Mongoose** for interacting with MongoDB in the backend. Define clear schemas.
- **Error Handling:** Implement robust error handling in the backend (e.g., middleware for catching errors, sending appropriate HTTP status codes).
- **IP Geolocation:** Use `ip-api.com` for geolocation. Implement rate limiting or a daily aggregation mechanism for `mapController.js` to prevent abuse/over-usage of the API.
- **Testing:** For every new feature (e.g., a new endpoint, a new utility function), **generate corresponding unit/integration tests** using Jest for the backend and React Testing Library/Jest for the frontend (if applicable). Ensure tests run with the provided `npm test` commands.
- **Documentation:** Generate basic JSDoc/ESDoc comments for new functions and classes.
- **Refinement:** Be prepared to iterate based on test results or explicit feedback.

---

## 
 Future Improvements / TODO for AI Consideration

*The AI can consider these for follow-up tasks after initial features are complete.*

- Add full user authentication for guests uploading photos/videos.
- Develop a dedicated admin dashboard for photo/video moderation and guestbook management.
- Enhance map with clustering for dense pin areas and custom pin designs.
- Implement real-time notifications (e.g., using WebSockets) for new uploads or guestbook entries.

---

## 
 Credits

Project inspired by previous attempts in:
- [`bbasketballer75/the-poradas-main`](https://github.com/bbasketballer75/the-poradas-main)
- [`bbasketballer75/the-poradas`](https://github.com/bbasketballer75/the-poradas)

This version is a fresh start with a clear focus and structure.