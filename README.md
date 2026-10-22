# EventHub Ticket Booking System
### ITUE301: Advanced Web Development Frameworks — Practical Examination
**Set F** · Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT  
**Tech Stack:** React (Vite) + Express.js + MongoDB (Mongoose)  
**Total Marks:** 20 Marks (4 Marks × 5 Tasks)

---

## 📌 Project Overview
EventHub is a modern full-stack web application designed to transition local event ticketing away from spreadsheets and paper coupons into an online, automated platform.
- **Attendees** can browse upcoming events, filter by title, view real-time ticket availability, and book tickets.
- **Organizers** can access a dedicated, lazy-loaded control panel to publish new events and monitor inventory.
- **System** enforces security via custom JWT `authGuard`, records request telemetry with `requestLogger`, and validates database constraints with Mongoose.

---

## 📂 Directory Structure

```
itue301-exam-[roll-number]-[batch]/
├── README.md                          # Full system documentation & Viva prep
├── .env.example                       # Root environment variables template
├── .gitignore                         # Git exclusion rules
├── backend/
│   ├── .env                           # Server environment variables
│   ├── .env.example                   # Example template
│   ├── package.json                   # Backend dependencies & scripts
│   ├── server.js                      # Express application entry point
│   ├── postman_collection.json        # Postman / Thunder Client collection
│   ├── config/
│   │   └── db.js                      # Resilient Mongoose connection + auto-seed
│   ├── models/
│   │   ├── Attendee.js                # Attendee schema (name, unique email, role, password)
│   │   ├── Event.js                   # Event schema (title, category, date, venue, ticketsAvailable)
│   │   └── Ticket.js                  # Ticket schema (refs Attendee & Event, quantity, status enum)
│   ├── middleware/
│   │   ├── requestLogger.js           # Logs [METHOD] [PATH] [TIMESTAMP] globally
│   │   ├── authGuard.js               # Validates Bearer token & role guard
│   │   └── errorHandler.js            # Structured JSON error response handler
│   ├── controllers/
│   │   ├── authController.js          # POST /api/v1/auth/login & register
│   │   ├── eventController.js         # GET /api/v1/events & POST /api/v1/events
│   │   └── ticketController.js        # POST /api/v1/tickets, GET /api/v1/tickets/my, PATCH status
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── ticketRoutes.js
│   └── seeds/
│       ├── seed.js                    # Standalone manual seeding script
│       └── seedDataHelper.js          # Auto-seeding helper
└── frontend/
    ├── package.json                   # Frontend dependencies (React 18, Vite, Router, Axios)
    ├── vite.config.js                 # Vite bundler config with /api proxy
    ├── index.html                     # Responsive HTML template with Google Fonts
    └── src/
        ├── main.jsx                   # React root render
        ├── App.jsx                    # Route config & React.lazy Suspense setup
        ├── index.css                  # Custom glassmorphic responsive design system
        ├── context/
        │   └── AuthContext.jsx        # Global auth state { attendee, token, role, login, logout }
        ├── components/
        │   ├── Navbar.jsx             # Navigation with React Router links & session status
        │   ├── ProtectedRoute.jsx     # Route protection with distinct redirect targets
        │   └── EventCard.jsx          # Reusable card with 5 props & Sold Out condition
        └── pages/
            ├── LoginPage.jsx          # Login form with quick demo account buttons
            ├── EventsPage.jsx         # Events grid, client-side title search, & booking form
            ├── MyTicketsPage.jsx      # User's booked tickets with populated references & cancellation
            └── OrganizerPanel.jsx     # Lazy-loaded organizer control panel (role: organizer)
```

---

## 🚀 Quick Setup & Run Instructions

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v22.x)
- **MongoDB** (Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI; if not installed, the backend includes an automatic fallback that boots in-memory MongoDB without any setup needed!)

### 2. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start the Express server (starts on http://localhost:5000)
node server.js
# OR
npm start
```
*Note:* The database will automatically seed demo users, events, and a sample booking if empty! You can also re-seed anytime with `npm run seed`.

### 3. Frontend Setup
```bash
# In a separate terminal, navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the Vite development server (starts on http://localhost:3000)
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Allowed Access |
|---|---|---|---|
| **Attendee** | `rahul@example.com` | `password123` | `/events`, `/my-tickets` |
| **Organizer** | `organizer@eventhub.com` | `password123` | `/events`, `/my-tickets`, `/organizer` |
| **Admin** | `admin@eventhub.com` | `password123` | Full access across all routes |

*(Tip: On the Login page, click the quick demo buttons to auto-fill these credentials instantly!)*

---

## 📋 Task-by-Task Implementation Summary

### Task 1: React Component Architecture (4 Marks)
- Created `LoginPage`, `EventsPage`, `MyTicketsPage`, and `OrganizerPanel`.
- Implemented reusable `EventCard` inside `/components` receiving **5 mandatory props**: `title`, `category`, `date`, `venue`, and `ticketsAvailable`.
- Displayed all five values with icons and formatted dates.
- Implemented the sold-out conditional check at the top: renders a high-visibility `"Sold Out"` badge if `ticketsAvailable === 0`, otherwise renders the `"Book Ticket"` button.

### Task 2: React Routing and State Management (4 Marks)
- Configured React Router v6 in `App.jsx` with routes:
  - `/` → `LoginPage`
  - `/events` → `EventsPage` (protected)
  - `/my-tickets` → `MyTicketsPage` (protected)
  - `/organizer` → `OrganizerPanel` (lazy-loaded with `React.lazy()` and `<Suspense>`)
- Built `Navbar` with `<NavLink>` tags preventing full-page reloads.
- Created `AuthContext` holding `{ attendee, token, role, login, logout }` with `localStorage` persistence.
- Implemented `ProtectedRoute` with **two distinct failure redirects**:
  - Missing token → redirects to `/` (LoginPage).
  - Role mismatch (e.g. attendee accessing `/organizer`) → redirects to `/events` with a warning alert (does not log out).
- In `EventsPage`, implemented an interactive booking form using `useState` managing `selectedEvent` and `ticketQuantity`.

### Task 3: Express REST API + Middleware (4 Marks)
- Implemented endpoints under `/api/v1/`:
  - `POST /api/v1/auth/login`: Authenticates attendee, issues JWT Bearer token.
  - `GET /api/v1/events`: Public event list sorted by date.
  - `POST /api/v1/tickets`: Protected; books tickets and atomically decrements `ticketsAvailable`.
  - `GET /api/v1/tickets/my`: Protected; returns attendee's own tickets.
  - `PATCH /api/v1/tickets/:id/status`: Protected; updates status (`booked`, `cancelled`, `used`).
- **`requestLogger` Middleware**: Applied globally via `app.use(requestLogger)`. Logs `[METHOD] [PATH] [TIMESTAMP]` for every request.
- **`authGuard` Middleware**: Extracts Bearer token from `Authorization` header, verifies with `jwt.verify`, attaches `req.user`, and returns `401 Unauthorized` if invalid or missing.
- **Global Error Handler**: Catches all errors as the last middleware and returns clean JSON `{ success: false, error: ... }` with appropriate status codes (200, 201, 400, 401, 500).

### Task 4: REST API Consumption in React (4 Marks)
- In `EventsPage`, used `useEffect()` on component mount to call `GET /api/v1/events`.
- Maintained three distinct states: `events`, `loading`, and `error`.
- Built state rendering:
  1. Animated spinner while `loading` is true.
  2. Red alert message if `error` occurs.
  3. Dynamic rendering of `EventCard` components with live API data.
- Added a client-side search input that filters already-fetched events in real-time by title using `.filter()` without triggering additional network requests.

### Task 5: MongoDB + Mongoose Schema Design and Validation (4 Marks)
- Three comprehensive Mongoose schemas created:
  - **Attendee**: `name` (required), `email` (required, unique, regex validated), `role` (enum: attendee, organizer, admin), `password` (hashed with bcrypt).
  - **Event**: `title` (required), `category` (String), `date` (required), `venue` (required), `ticketsAvailable` (Number, min: 0).
  - **Ticket**: `attendeeId` (ref: Attendee), `eventId` (ref: Event), `quantity` (min: 1), `bookingDate` (default: Date.now), `status` (enum: `booked`, `cancelled`, `used`, default: `booked`).
- `POST /api/v1/tickets` enforces `ticketsAvailable >= quantity` (returns 400 JSON error if violated) before calling `Ticket.create` and decrements `ticketsAvailable`.
- `GET /api/v1/tickets/my` uses:
  - `.populate('attendeeId', 'name email')`
  - `.populate('eventId', 'title date venue')`
- Demonstrates validation failure handling cleanly in JSON format without server crashes.

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Public | Attendee/organizer login; returns JWT token & user |
| `GET` | `/api/v1/events` | Public | Returns all upcoming events |
| `GET` | `/api/v1/events/:id` | Public | Returns single event details |
| `POST` | `/api/v1/events` | Protected (Organizer) | Publishes a new event |
| `POST` | `/api/v1/tickets` | Protected (Attendee) | Books tickets and decrements event stock |
| `GET` | `/api/v1/tickets/my` | Protected (Attendee) | Returns attendee's tickets with populated refs |
| `PATCH` | `/api/v1/tickets/:id/status` | Protected (Attendee) | Updates status (`booked`, `cancelled`, `used`) |

---

## 🧪 Postman Testing (For Practical Report Screenshot 2)

A ready-to-import Postman collection is located at:
`backend/postman_collection.json`

1. Open Postman or Thunder Client in VS Code.
2. Click **Import** → select `backend/postman_collection.json`.
3. Run request **1. Login Attendee** (this automatically saves the Bearer token).
4. Run request **3. Book Ticket**:
   - Status code returned: **`201 Created`**
   - Take a screenshot of this response for **Screenshot 2** in your practical examination report!

---

## 🎓 Viva Voce Preparation Guide (Questions & Answers)

**Q1: What does `requestLogger` do and where is it registered?**  
*Answer:* `requestLogger` is a custom Express middleware registered globally with `app.use(requestLogger)` before routes. For every incoming HTTP request, it logs `[METHOD] [PATH] [TIMESTAMP]` to the console (e.g. `[POST] [/api/v1/tickets] [2026-10-22T04:13:15.759Z]`), providing request traceability and auditing.

**Q2: How does `authGuard` protect routes?**  
*Answer:* It inspects the HTTP `Authorization` request header for a `Bearer <token>`. If the header is missing or does not start with `Bearer `, it terminates the request immediately with HTTP 401 Unauthorized. If present, it validates the token signature and expiration using `jwt.verify(token, secret)`. Upon success, it attaches the decoded user object to `req.user` and calls `next()`.

**Q3: How is overbooking prevented during ticket creation?**  
*Answer:* When `POST /api/v1/tickets` is invoked, the controller first queries the event by ID using `Event.findById(eventId)`. It checks if `event.ticketsAvailable < quantity`. If true, it returns HTTP 400 Bad Request with a clear JSON message (`"Insufficient tickets available"`). Only if sufficient tickets remain does it create the `Ticket` document and call `Event.findByIdAndUpdate(eventId, { $inc: { ticketsAvailable: -quantity } })`.

**Q4: What is Mongoose `.populate()` and why is it used in `GET /api/v1/tickets/my`?**  
*Answer:* In MongoDB, references are stored as `ObjectId` values (`attendeeId` and `eventId`). Mongoose `.populate('attendeeId', 'name email')` and `.populate('eventId', 'title date venue')` automatically perform a join-like operation, replacing the ObjectIds with the actual referenced documents and projecting only the specified fields.

**Q5: Why did we use `React.lazy()` and `<Suspense>` for `OrganizerPanel`?**  
*Answer:* `React.lazy` enables code-splitting. Instead of bundling the entire `OrganizerPanel` into the initial JavaScript bundle loaded by ordinary attendees, Vite splits it into an independent chunk (`dist/assets/OrganizerPanel-*.js`). It is downloaded over the network on-demand only when an authorized organizer navigates to `/organizer`. `<Suspense fallback={<LoadingFallback />}>` provides a loading UI while the chunk downloads.

**Q6: What is the difference between the two redirects in `ProtectedRoute`?**  
*Answer:* If a visitor is not logged in (`!isAuthenticated`), `ProtectedRoute` redirects them to `/` (LoginPage). However, if an attendee is logged in but lacks the required role (e.g. attempting to open `/organizer`), it redirects to `/events` while maintaining their active login session, rather than forcing a logout.

---

## 📷 Exam Report Submission Checklist

- [x] **Public GitHub Repository**: Named `itue301-exam-[roll-number]-[batch]`
- [x] **Screenshot 1**: `EventsPage` in browser showing event cards with title, category, date, venue, tickets available, and the "Sold Out" badge on the exclusive masterclass.
- [x] **Screenshot 2**: Postman / Thunder Client showing **201 Created** on `POST /api/v1/tickets`.
- [x] **Screenshot 3**: MongoDB / Compass view displaying a saved document from the `tickets` or `events` collection.
- [x] **Final Commit SHA**: Recorded in the submission Google Form.
