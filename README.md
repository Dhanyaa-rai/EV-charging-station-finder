# EV Charging Station Finder & Booking

## Description
This is a working web application for an EV Charging Station Finder & Booking system, built as a Major Capstone Assessment. It allows electric vehicle users to discover charging stations, view station information, check availability, and manage charging bookings.

## Features
- View available charging stations and total system statistics
- Search charging stations by name, location, or address
- Filter charging stations by charging type and availability
- View detailed station information
- Create charging bookings (automatically reduces station available slots)
- View existing bookings
- View individual booking details
- Update bookings
- Cancel bookings (automatically restores station available slots)
- Dynamic and responsive UI

## Technologies
- HTML
- CSS (Flexbox and modern UI design)
- JavaScript (Vanilla JS, DOM Manipulation, Fetch API)
- Node.js
- Express.js
- REST API
- JSON
- In-memory data store

## Project Structure
```text
ev-charging-booking/
├── backend/
│   ├── server.js (Express server setup)
│   ├── data/
│   │   └── store.js (In-memory stations and bookings array)
│   ├── routes/
│   │   ├── stationRoutes.js (Station routing)
│   │   └── bookingRoutes.js (Booking routing)
│   ├── controllers/
│   │   ├── stationController.js (Station business logic)
│   │   └── bookingController.js (Booking business logic)
│   └── package.json
├── frontend/
│   ├── index.html (Main application view)
│   ├── css/
│   │   └── style.css (Application styles)
│   └── js/
│       └── app.js (Client-side logic and API integration)
├── README.md
├── .gitignore
└── package.json
```

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

1. Clone or extract the project.
2. Navigate to the project root directory.
3. Install the dependencies:
```bash
npm install
```

## Running the application

1. Start the backend Express server:
```bash
node backend/server.js
```
2. Once the server is running, you will see a message: `Server is running on http://localhost:3000`.
3. Open a web browser and navigate to `http://localhost:3000` to access the application.

## API Documentation

### Stations

| Method | Endpoint | Purpose | Example Request Body | Expected Response | Status Code |
|---|---|---|---|---|---|
| GET | `/api/stations` | Get all stations | - | List of stations | 200 |
| GET | `/api/stations/:id` | Get specific station | - | Station object | 200 / 404 |
| POST | `/api/stations` | Create a station | `{ "name": "Test", "location": "Kochi", "address": "...", "chargingType": "AC", "availability": "Available", "operatingHours": "24/7", "contact": "123", "totalSlots": 10, "availableSlots": 10, "pricePerUnit": 15 }` | Created station object | 201 / 400 |
| PUT | `/api/stations/:id` | Update a station | `{ "availability": "Full", "availableSlots": 0 }` | Updated station object | 200 / 404 |
| DELETE| `/api/stations/:id` | Delete a station | - | Success message | 200 / 404 |

### Bookings

| Method | Endpoint | Purpose | Example Request Body | Expected Response | Status Code |
|---|---|---|---|---|---|
| GET | `/api/bookings` | Get all bookings | - | List of bookings | 200 |
| GET | `/api/bookings/:id` | Get specific booking | - | Booking object | 200 / 404 |
| POST | `/api/bookings` | Create a booking | `{ "userName": "John", "contact": "1234567890", "stationId": "st-1", "date": "2023-11-20", "time": "10:00", "vehicleNumber": "KL01", "vehicleModel": "Nexon", "chargingType": "AC", "duration": 2 }` | Created booking object | 201 / 400 |
| PUT | `/api/bookings/:id` | Update a booking | `{ "vehicleModel": "Kona EV" }` | Updated booking object | 200 / 404 |
| DELETE| `/api/bookings/:id` | Cancel a booking | - | Success message | 200 / 404 |

## Validation
- **Frontend Validation:** HTML5 required attributes, type restrictions (e.g., date, time, tel, number), and pattern validation for phone numbers are used to prevent invalid form submission.
- **Backend Validation:** The backend checks for missing required fields (e.g., `userName`, `stationId`) and logical constraints (e.g., `availableSlots` cannot exceed `totalSlots`, `duration` > 0). If validation fails, the server responds with a 400 Bad Request and a JSON error message.

## Error Handling
- REST endpoints return appropriate HTTP status codes (400 for bad request, 404 for not found, 500 for server errors).
- JSON responses contain a `success` boolean to easily parse success or failure on the frontend.
- A global error handling middleware in Express catches unexpected parsing/server errors and returns a clean JSON error response without exposing the server stack trace to the client.

## Testing
To test the APIs using Postman:
1. Start the server (`node backend/server.js`).
2. Open Postman.
3. Use the endpoints listed in the **API Documentation** section.
4. Ensure you set the `Content-Type` header to `application/json` for POST and PUT requests.

## Data Storage
> This version uses an in-memory JavaScript data structure (`store.js`) and does not require a database, in accordance with the assessment requirements. Data will reset if the server restarts.

## Future Improvements
- Integrate a real database (e.g., MongoDB, PostgreSQL) for persistent storage.
- Add user authentication (login/signup) and an admin panel.
- Implement Maps API for geographic location tracking and routing.
- Integrate online payment gateways for booking fees.
- Real-time IoT integration with actual EV chargers to get live availability.
