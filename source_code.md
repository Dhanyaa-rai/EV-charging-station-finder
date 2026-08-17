# EV Charging Station Finder & Booking - Source Code

Below is the complete source code for your project. You can copy this if you need to paste it into a final project report or submission document. 

All of this code is also available on your computer in the `ev-charging-booking` folder and live on your GitHub repository.

---

## 1. Backend Code

### `backend/server.js`
```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const stationRoutes = require('./routes/stationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/stations', stationRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Handling Middleware for JSON parsing errors etc.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Unexpected server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

### `backend/data/store.js`
```javascript
// In-memory data structures
let stations = [
  {
    id: "st-1",
    name: "Kochi Central EV Hub",
    location: "Kochi",
    address: "MG Road, Kochi, Kerala",
    chargingType: "DC Fast Charging",
    availability: "Available",
    operatingHours: "24/7",
    contact: "9876543210",
    totalSlots: 10,
    availableSlots: 4,
    pricePerUnit: 15.5
  },
  {
    id: "st-2",
    name: "Thrissur Green Charge",
    location: "Thrissur",
    address: "Round North, Thrissur",
    chargingType: "AC",
    availability: "Available",
    operatingHours: "06:00 - 22:00",
    contact: "9876543211",
    totalSlots: 5,
    availableSlots: 5,
    pricePerUnit: 12.0
  },
  {
    id: "st-3",
    name: "Calicut EV Point",
    location: "Kozhikode",
    address: "Beach Road, Kozhikode",
    chargingType: "CCS",
    availability: "Busy",
    operatingHours: "24/7",
    contact: "9876543212",
    totalSlots: 4,
    availableSlots: 1,
    pricePerUnit: 18.0
  },
  {
    id: "st-4",
    name: "Bengaluru FastCharge",
    location: "Bengaluru",
    address: "Electronic City, Bengaluru",
    chargingType: "DC Fast Charging",
    availability: "Full",
    operatingHours: "24/7",
    contact: "9876543213",
    totalSlots: 8,
    availableSlots: 0,
    pricePerUnit: 20.0
  },
  {
    id: "st-5",
    name: "Coimbatore EcoCharge",
    location: "Coimbatore",
    address: "Avinashi Road, Coimbatore",
    chargingType: "CHAdeMO",
    availability: "Available",
    operatingHours: "08:00 - 20:00",
    contact: "9876543214",
    totalSlots: 6,
    availableSlots: 6,
    pricePerUnit: 16.5
  },
  {
    id: "st-6",
    name: "Ernakulam Power Station",
    location: "Kochi",
    address: "Edappally, Kochi",
    chargingType: "DC Fast Charging",
    availability: "Offline",
    operatingHours: "24/7",
    contact: "9876543215",
    totalSlots: 12,
    availableSlots: 0,
    pricePerUnit: 15.0
  }
];

let bookings = [
  {
    id: "bk-1",
    userName: "John Doe",
    contact: "1234567890",
    stationId: "st-1",
    date: "2023-11-20",
    time: "10:00",
    vehicleNumber: "KL-07-AB-1234",
    vehicleModel: "Tata Nexon EV",
    chargingType: "DC Fast Charging",
    duration: 2,
    status: "Confirmed"
  },
  {
    id: "bk-2",
    userName: "Alice Smith",
    contact: "0987654321",
    stationId: "st-3",
    date: "2023-11-21",
    time: "14:30",
    vehicleNumber: "KL-11-CD-5678",
    vehicleModel: "MG ZS EV",
    chargingType: "CCS",
    duration: 1,
    status: "Pending"
  },
  {
    id: "bk-3",
    userName: "Bob Johnson",
    contact: "1122334455",
    stationId: "st-2",
    date: "2023-11-22",
    time: "08:00",
    vehicleNumber: "KL-08-EF-9012",
    vehicleModel: "Hyundai Kona",
    chargingType: "AC",
    duration: 3,
    status: "Completed"
  }
];

module.exports = {
  stations,
  bookings
};
```

### `backend/routes/stationRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');

router.route('/')
  .get(stationController.getAllStations)
  .post(stationController.createStation);

router.route('/:id')
  .get(stationController.getStationById)
  .put(stationController.updateStation)
  .delete(stationController.deleteStation);

module.exports = router;
```

### `backend/routes/bookingRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router.route('/:id')
  .get(bookingController.getBookingById)
  .put(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
```

### `backend/controllers/stationController.js`
```javascript
const { stations } = require('../data/store');

// GET all stations
exports.getAllStations = (req, res) => {
  res.status(200).json({
    success: true,
    data: stations
  });
};

// GET individual station
exports.getStationById = (req, res) => {
  const station = stations.find(s => s.id === req.params.id);
  if (!station) {
    return res.status(404).json({ success: false, message: 'Charging station not found' });
  }
  res.status(200).json({ success: true, data: station });
};

// POST new station
exports.createStation = (req, res) => {
  const { name, location, address, chargingType, availability, operatingHours, contact, totalSlots, availableSlots, pricePerUnit } = req.body;

  // Basic validation
  if (!name || !location || !address || !chargingType || !availability || totalSlots == null || availableSlots == null || pricePerUnit == null) {
    return res.status(400).json({ success: false, message: 'Missing required station fields' });
  }
  if (availableSlots > totalSlots) {
    return res.status(400).json({ success: false, message: 'Available slots cannot exceed total slots' });
  }
  if (pricePerUnit < 0) {
    return res.status(400).json({ success: false, message: 'Price cannot be negative' });
  }

  const newStation = {
    id: `st-${Date.now()}`,
    name,
    location,
    address,
    chargingType,
    availability,
    operatingHours,
    contact,
    totalSlots,
    availableSlots,
    pricePerUnit
  };

  stations.push(newStation);
  res.status(201).json({ success: true, data: newStation });
};

// PUT update station
exports.updateStation = (req, res) => {
  const index = stations.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Charging station not found' });
  }

  const updatedStation = { ...stations[index], ...req.body };
  
  if (updatedStation.availableSlots > updatedStation.totalSlots) {
    return res.status(400).json({ success: false, message: 'Available slots cannot exceed total slots' });
  }

  stations[index] = updatedStation;
  res.status(200).json({ success: true, data: stations[index] });
};

// DELETE station
exports.deleteStation = (req, res) => {
  const index = stations.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Charging station not found' });
  }

  stations.splice(index, 1);
  res.status(200).json({ success: true, message: 'Station deleted successfully' });
};
```

### `backend/controllers/bookingController.js`
```javascript
const { bookings, stations } = require('../data/store');

// GET all bookings
exports.getAllBookings = (req, res) => {
  res.status(200).json({
    success: true,
    data: bookings
  });
};

// GET individual booking
exports.getBookingById = (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  res.status(200).json({ success: true, data: booking });
};

// POST new booking
exports.createBooking = (req, res) => {
  const { userName, contact, stationId, date, time, vehicleNumber, vehicleModel, chargingType, duration } = req.body;

  // Validation
  if (!userName || !contact || !stationId || !date || !time || !vehicleNumber || !vehicleModel || !chargingType || !duration) {
    return res.status(400).json({ success: false, message: 'Missing required booking fields' });
  }

  if (duration <= 0) {
    return res.status(400).json({ success: false, message: 'Duration must be greater than 0' });
  }

  const stationIndex = stations.findIndex(s => s.id === stationId);
  if (stationIndex === -1) {
    return res.status(400).json({ success: false, message: 'Station does not exist' });
  }

  const station = stations[stationIndex];
  
  if (station.availableSlots <= 0) {
    return res.status(400).json({ success: false, message: 'No available slots at this station' });
  }

  // Create booking
  const newBooking = {
    id: `bk-${Date.now()}`,
    userName,
    contact,
    stationId,
    date,
    time,
    vehicleNumber,
    vehicleModel,
    chargingType,
    duration,
    status: 'Confirmed'
  };

  bookings.push(newBooking);

  // Reduce available slots
  stations[stationIndex].availableSlots -= 1;
  
  // If no slots left, set availability to Full
  if (stations[stationIndex].availableSlots === 0) {
      stations[stationIndex].availability = 'Full';
  }

  res.status(201).json({ success: true, data: newBooking });
};

// PUT update booking
exports.updateBooking = (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  if (bookings[index].status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot update a cancelled booking' });
  }

  const updatedBooking = { ...bookings[index], ...req.body };
  
  updatedBooking.id = bookings[index].id; 
  updatedBooking.stationId = bookings[index].stationId; 
  
  bookings[index] = updatedBooking;
  res.status(200).json({ success: true, data: bookings[index] });
};

// DELETE booking (Cancel)
exports.deleteBooking = (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  const booking = bookings[index];

  if (booking.status !== 'Cancelled') {
    // Increase station available slots
    const stationIndex = stations.findIndex(s => s.id === booking.stationId);
    if (stationIndex !== -1) {
      stations[stationIndex].availableSlots += 1;
      if (stations[stationIndex].availableSlots > 0 && stations[stationIndex].availability === 'Full') {
        stations[stationIndex].availability = 'Available'; 
      }
    }
  }

  bookings.splice(index, 1);
  
  res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
};
```

---

## 2. Frontend Code

### `frontend/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EV ChargeFinder</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="header">
        <div class="container header-content">
            <div class="logo">
                <h1>EV ChargeFinder</h1>
                <p class="subtitle">Find. Book. Charge.</p>
            </div>
            <nav class="main-nav">
                <button id="nav-dashboard" class="nav-btn active">Dashboard</button>
                <button id="nav-stations" class="nav-btn">Stations</button>
                <button id="nav-bookings" class="nav-btn">My Bookings</button>
            </nav>
        </div>
    </header>

    <main class="container main-content">
        <!-- Messages -->
        <div id="message-container" class="message-container hidden"></div>

        <!-- Dashboard Section -->
        <section id="section-dashboard" class="section active">
            <h2>Dashboard</h2>
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Total Stations</h3>
                    <p id="stat-total-stations" class="stat-value">0</p>
                </div>
                <div class="stat-card">
                    <h3>Available Stations</h3>
                    <p id="stat-available-stations" class="stat-value">0</p>
                </div>
                <div class="stat-card">
                    <h3>Active Bookings</h3>
                    <p id="stat-active-bookings" class="stat-value">0</p>
                </div>
                <div class="stat-card">
                    <h3>Completed Bookings</h3>
                    <p id="stat-completed-bookings" class="stat-value">0</p>
                </div>
            </div>
        </section>

        <!-- Stations Section -->
        <section id="section-stations" class="section hidden">
            <div class="section-header">
                <h2>Charging Stations</h2>
                <div class="filters">
                    <input type="text" id="search-input" placeholder="Search stations, location..." class="search-input">
                    <select id="filter-type" class="filter-select">
                        <option value="All">All Types</option>
                        <option value="AC">AC</option>
                        <option value="DC Fast Charging">DC Fast Charging</option>
                        <option value="CCS">CCS</option>
                        <option value="CHAdeMO">CHAdeMO</option>
                    </select>
                    <select id="filter-availability" class="filter-select">
                        <option value="All">All Availability</option>
                        <option value="Available">Available</option>
                        <option value="Busy">Busy</option>
                        <option value="Full">Full</option>
                        <option value="Offline">Offline</option>
                    </select>
                </div>
            </div>
            <div id="stations-grid" class="stations-grid">
                <!-- Station Cards will be injected here -->
            </div>
        </section>

        <!-- Bookings Section -->
        <section id="section-bookings" class="section hidden">
            <div class="section-header">
                <h2>My Bookings</h2>
            </div>
            <div id="bookings-list" class="bookings-list">
                <!-- Bookings will be injected here -->
            </div>
        </section>
    </main>

    <!-- Station Details Modal -->
    <div id="modal-station-details" class="modal hidden">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 id="modal-station-name">Station Name</h2>
            <div class="modal-body" id="modal-station-body">
                <!-- Details injected here -->
            </div>
            <div class="modal-actions">
                <button id="btn-open-booking" class="btn btn-primary">Book Now</button>
            </div>
        </div>
    </div>

    <!-- Booking Form Modal -->
    <div id="modal-booking-form" class="modal hidden">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 id="booking-modal-title">Make a Booking</h2>
            <form id="booking-form" class="booking-form">
                <input type="hidden" id="booking-id">
                <div class="form-group">
                    <label for="book-station">Station</label>
                    <select id="book-station" required disabled>
                        <!-- Options injected -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="book-name">Full Name</label>
                    <input type="text" id="book-name" required>
                </div>
                <div class="form-group">
                    <label for="book-contact">Contact Number</label>
                    <input type="tel" id="book-contact" required pattern="[0-9]{10}" title="10 digit phone number">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="book-date">Date</label>
                        <input type="date" id="book-date" required>
                    </div>
                    <div class="form-group">
                        <label for="book-time">Time</label>
                        <input type="time" id="book-time" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="book-vehicle-num">Vehicle Number</label>
                        <input type="text" id="book-vehicle-num" required>
                    </div>
                    <div class="form-group">
                        <label for="book-vehicle-model">Vehicle Model</label>
                        <input type="text" id="book-vehicle-model" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="book-type">Charging Type</label>
                        <select id="book-type" required>
                            <option value="AC">AC</option>
                            <option value="DC Fast Charging">DC Fast Charging</option>
                            <option value="CCS">CCS</option>
                            <option value="CHAdeMO">CHAdeMO</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="book-duration">Duration (Hours)</label>
                        <input type="number" id="book-duration" min="1" max="24" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" id="btn-submit-booking">Confirm Booking</button>
                    <button type="button" class="btn btn-secondary close-modal-btn">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Booking Details Modal -->
    <div id="modal-booking-details" class="modal hidden">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Booking Details</h2>
            <div class="modal-body" id="modal-booking-body">
                <!-- Details injected here -->
            </div>
        </div>
    </div>

    <script src="js/app.js"></script>
</body>
</html>
```

### `frontend/css/style.css`
```css
:root {
    --primary-color: #10b981;
    --primary-hover: #059669;
    --secondary-color: #3b82f6;
    --danger-color: #ef4444;
    --dark-color: #1f2937;
    --light-color: #f3f4f6;
    --text-main: #374151;
    --text-muted: #6b7280;
    --bg-body: #f9fafb;
    --card-bg: #ffffff;
    --border-color: #e5e7eb;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-body);
    color: var(--text-main);
    line-height: 1.6;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    background-color: var(--card-bg);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
}

.logo h1 {
    color: var(--primary-color);
    font-size: 24px;
    margin-bottom: 2px;
}

.subtitle {
    font-size: 14px;
    color: var(--text-muted);
}

.main-nav {
    display: flex;
    gap: 15px;
}

.nav-btn {
    background: none;
    border: none;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s;
}

.nav-btn:hover {
    background-color: var(--light-color);
    color: var(--text-main);
}

.nav-btn.active {
    background-color: #ecfdf5;
    color: var(--primary-color);
}

/* Main Content */
.main-content {
    padding: 40px 20px;
}

.section {
    display: none;
}

.section.active {
    display: block;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 15px;
}

.section-header h2 {
    font-size: 28px;
    color: var(--dark-color);
}

/* Dashboard Stats */
.dashboard-stats {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.stat-card {
    background-color: var(--card-bg);
    flex: 1;
    min-width: 200px;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    text-align: center;
    border: 1px solid var(--border-color);
}

.stat-card h3 {
    font-size: 16px;
    color: var(--text-muted);
    font-weight: 500;
}

.stat-value {
    font-size: 36px;
    font-weight: 700;
    color: var(--primary-color);
    margin-top: 10px;
}

/* Filters */
.filters {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.search-input, .filter-select {
    padding: 10px 15px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
}

.search-input {
    min-width: 250px;
}

.search-input:focus, .filter-select:focus {
    border-color: var(--primary-color);
}

/* Station Grid */
.stations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.station-card {
    background-color: var(--card-bg);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
}

.station-card h3 {
    font-size: 20px;
    color: var(--dark-color);
    margin-bottom: 5px;
}

.station-location {
    color: var(--text-muted);
    font-size: 14px;
    margin-bottom: 15px;
}

.station-details {
    flex-grow: 1;
    margin-bottom: 20px;
}

.station-details p {
    font-size: 14px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
}

.badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.badge.available { background-color: #d1fae5; color: #065f46; }
.badge.busy { background-color: #fef3c7; color: #92400e; }
.badge.full { background-color: #fee2e2; color: #991b1b; }
.badge.offline { background-color: #e5e7eb; color: #374151; }

.station-actions {
    display: flex;
    gap: 10px;
}

/* Buttons */
.btn {
    padding: 10px 15px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    font-family: inherit;
    text-align: center;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
}

.btn-primary:hover { background-color: var(--primary-hover); }

.btn-secondary {
    background-color: var(--light-color);
    color: var(--text-main);
}

.btn-secondary:hover { background-color: #e5e7eb; }

.btn-danger {
    background-color: var(--danger-color);
    color: white;
}

.btn-danger:hover { background-color: #dc2626; }

.btn-block {
    width: 100%;
}
.station-actions .btn {
    flex: 1;
}

/* Modals */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal.hidden {
    display: none;
}

.modal-content {
    background-color: var(--card-bg);
    padding: 30px;
    border-radius: 10px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
}

.close-modal {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    cursor: pointer;
    color: var(--text-muted);
}

.modal-content h2 {
    margin-bottom: 20px;
    color: var(--dark-color);
}

.detail-row {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    padding: 12px 0;
}
.detail-row:last-child {
    border-bottom: none;
}
.detail-label {
    width: 40%;
    font-weight: 600;
    color: var(--text-muted);
}
.detail-value {
    width: 60%;
    color: var(--dark-color);
}

/* Forms */
.form-group {
    margin-bottom: 15px;
}

.form-row {
    display: flex;
    gap: 15px;
}

.form-row .form-group {
    flex: 1;
}

label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-main);
}

input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-family: inherit;
    font-size: 14px;
}
input[disabled], select[disabled] {
    background-color: var(--light-color);
}
.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 25px;
}

/* Bookings List */
.bookings-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.booking-card {
    background-color: var(--card-bg);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    border: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
}
.booking-info h3 {
    margin-bottom: 5px;
    font-size: 18px;
}
.booking-info p {
    font-size: 14px;
    color: var(--text-muted);
}
.booking-actions {
    display: flex;
    gap: 10px;
}

/* Messages */
.message-container {
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 6px;
    font-weight: 500;
}
.message-container.hidden { display: none; }
.message-success { background-color: #d1fae5; color: #065f46; border: 1px solid #34d399; }
.message-error { background-color: #fee2e2; color: #991b1b; border: 1px solid #f87171; }

@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }
    .form-row {
        flex-direction: column;
        gap: 0;
    }
    .station-actions {
        flex-direction: column;
    }
}
```

### `frontend/js/app.js`
```javascript
const API_BASE = '/api';

// State
let stations = [];
let bookings = [];

// DOM Elements
const sections = {
    dashboard: document.getElementById('section-dashboard'),
    stations: document.getElementById('section-stations'),
    bookings: document.getElementById('section-bookings')
};

const navButtons = {
    dashboard: document.getElementById('nav-dashboard'),
    stations: document.getElementById('nav-stations'),
    bookings: document.getElementById('nav-bookings')
};

const modals = {
    stationDetails: document.getElementById('modal-station-details'),
    bookingForm: document.getElementById('modal-booking-form'),
    bookingDetails: document.getElementById('modal-booking-details')
};

// Event Listeners - Navigation
Object.keys(navButtons).forEach(key => {
    navButtons[key].addEventListener('click', () => navigateTo(key));
});

// Event Listeners - Close Modals
document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        Object.values(modals).forEach(modal => modal.classList.add('hidden'));
    });
});

// Event Listeners - Search & Filter
document.getElementById('search-input').addEventListener('input', renderStations);
document.getElementById('filter-type').addEventListener('change', renderStations);
document.getElementById('filter-availability').addEventListener('change', renderStations);

// Event Listeners - Forms
document.getElementById('booking-form').addEventListener('submit', handleBookingSubmit);

// Initialization
async function init() {
    await fetchData();
    navigateTo('dashboard');
}

// Fetch Data
async function fetchData() {
    try {
        const [stationsRes, bookingsRes] = await Promise.all([
            fetch(`${API_BASE}/stations`).then(res => res.json()),
            fetch(`${API_BASE}/bookings`).then(res => res.json())
        ]);

        if (stationsRes.success) stations = stationsRes.data;
        if (bookingsRes.success) bookings = bookingsRes.data;
        
        updateDashboard();
    } catch (error) {
        showMessage('Error fetching data from server.', 'error');
    }
}

// Navigation
function navigateTo(sectionKey) {
    // Hide all
    Object.values(sections).forEach(sec => sec.classList.remove('active', 'hidden'));
    Object.values(sections).forEach(sec => sec.classList.add('hidden'));
    
    Object.values(navButtons).forEach(btn => btn.classList.remove('active'));

    // Show selected
    sections[sectionKey].classList.remove('hidden');
    sections[sectionKey].classList.add('active');
    navButtons[sectionKey].classList.add('active');

    if (sectionKey === 'dashboard') updateDashboard();
    if (sectionKey === 'stations') renderStations();
    if (sectionKey === 'bookings') renderBookings();
}

// Render Dashboard
function updateDashboard() {
    document.getElementById('stat-total-stations').textContent = stations.length;
    document.getElementById('stat-available-stations').textContent = stations.filter(s => s.availability === 'Available').length;
    document.getElementById('stat-active-bookings').textContent = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length;
    document.getElementById('stat-completed-bookings').textContent = bookings.filter(b => b.status === 'Completed').length;
}

// Render Stations
function renderStations() {
    const grid = document.getElementById('stations-grid');
    grid.innerHTML = '';

    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const typeFilter = document.getElementById('filter-type').value;
    const availFilter = document.getElementById('filter-availability').value;

    const filtered = stations.filter(station => {
        const matchesSearch = station.name.toLowerCase().includes(searchTerm) || 
                              station.location.toLowerCase().includes(searchTerm) ||
                              station.address.toLowerCase().includes(searchTerm);
        const matchesType = typeFilter === 'All' || station.chargingType === typeFilter;
        const matchesAvail = availFilter === 'All' || station.availability === availFilter;
        
        return matchesSearch && matchesType && matchesAvail;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<p>No stations found matching your criteria.</p>';
        return;
    }

    filtered.forEach(station => {
        const card = document.createElement('div');
        card.className = 'station-card';
        card.innerHTML = `
            <h3>${station.name}</h3>
            <p class="station-location">${station.location}</p>
            <div class="station-details">
                <p><span>Type:</span> <strong>${station.chargingType}</strong></p>
                <p><span>Status:</span> <span class="badge ${station.availability.toLowerCase()}">${station.availability}</span></p>
                <p><span>Slots:</span> <strong>${station.availableSlots}/${station.totalSlots}</strong></p>
                <p><span>Price:</span> <strong>₹${station.pricePerUnit}/unit</strong></p>
            </div>
            <div class="station-actions">
                <button class="btn btn-secondary btn-view-station" data-id="${station.id}">View Details</button>
                <button class="btn btn-primary btn-book-station" data-id="${station.id}" ${station.availableSlots === 0 ? 'disabled' : ''}>Book Now</button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.btn-view-station').forEach(btn => {
        btn.addEventListener('click', (e) => openStationDetails(e.target.dataset.id));
    });
    document.querySelectorAll('.btn-book-station').forEach(btn => {
        btn.addEventListener('click', (e) => openBookingForm(e.target.dataset.id));
    });
}

// Open Station Details Modal
function openStationDetails(id) {
    const station = stations.find(s => s.id === id);
    if (!station) return;

    document.getElementById('modal-station-name').textContent = station.name;
    document.getElementById('modal-station-body').innerHTML = `
        <div class="detail-row"><div class="detail-label">Location</div><div class="detail-value">${station.location}</div></div>
        <div class="detail-row"><div class="detail-label">Address</div><div class="detail-value">${station.address}</div></div>
        <div class="detail-row"><div class="detail-label">Charging Type</div><div class="detail-value">${station.chargingType}</div></div>
        <div class="detail-row"><div class="detail-label">Status</div><div class="detail-value"><span class="badge ${station.availability.toLowerCase()}">${station.availability}</span></div></div>
        <div class="detail-row"><div class="detail-label">Hours</div><div class="detail-value">${station.operatingHours}</div></div>
        <div class="detail-row"><div class="detail-label">Contact</div><div class="detail-value">${station.contact}</div></div>
        <div class="detail-row"><div class="detail-label">Available Slots</div><div class="detail-value">${station.availableSlots} / ${station.totalSlots}</div></div>
        <div class="detail-row"><div class="detail-label">Price</div><div class="detail-value">₹${station.pricePerUnit} per unit</div></div>
    `;

    const bookBtn = document.getElementById('btn-open-booking');
    bookBtn.onclick = () => {
        modals.stationDetails.classList.add('hidden');
        openBookingForm(station.id);
    };
    bookBtn.disabled = station.availableSlots === 0;

    modals.stationDetails.classList.remove('hidden');
}

// Open Booking Form (Create or Edit)
function openBookingForm(stationId, bookingId = null) {
    const form = document.getElementById('booking-form');
    form.reset();
    document.getElementById('booking-id').value = '';

    // Populate station dropdown
    const stationSelect = document.getElementById('book-station');
    stationSelect.innerHTML = stations.map(s => `<option value="${s.id}">${s.name} (${s.chargingType})</option>`).join('');
    
    if (stationId) {
        stationSelect.value = stationId;
    }

    if (bookingId) {
        // Edit mode
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            document.getElementById('booking-modal-title').textContent = 'Update Booking';
            document.getElementById('booking-id').value = booking.id;
            document.getElementById('book-name').value = booking.userName;
            document.getElementById('book-contact').value = booking.contact;
            document.getElementById('book-date').value = booking.date;
            document.getElementById('book-time').value = booking.time;
            document.getElementById('book-vehicle-num').value = booking.vehicleNumber;
            document.getElementById('book-vehicle-model').value = booking.vehicleModel;
            document.getElementById('book-type').value = booking.chargingType;
            document.getElementById('book-duration').value = booking.duration;
            document.getElementById('btn-submit-booking').textContent = 'Update Booking';
        }
    } else {
        document.getElementById('booking-modal-title').textContent = 'Make a Booking';
        document.getElementById('btn-submit-booking').textContent = 'Confirm Booking';
    }

    modals.bookingForm.classList.remove('hidden');
}

// Handle Booking Form Submit
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const bookingId = document.getElementById('booking-id').value;
    
    const payload = {
        userName: document.getElementById('book-name').value,
        contact: document.getElementById('book-contact').value,
        stationId: document.getElementById('book-station').value,
        date: document.getElementById('book-date').value,
        time: document.getElementById('book-time').value,
        vehicleNumber: document.getElementById('book-vehicle-num').value,
        vehicleModel: document.getElementById('book-vehicle-model').value,
        chargingType: document.getElementById('book-type').value,
        duration: parseInt(document.getElementById('book-duration').value)
    };

    try {
        let res;
        if (bookingId) {
            // Update
            res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            res = await fetch(`${API_BASE}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        const data = await res.json();
        
        if (data.success) {
            showMessage(bookingId ? 'Booking updated successfully!' : 'Booking created successfully!', 'success');
            modals.bookingForm.classList.add('hidden');
            await fetchData(); // Refresh all data to update slots
            if (!sections.bookings.classList.contains('hidden')) {
                renderBookings(); // re-render if on bookings page
            } else if (!sections.stations.classList.contains('hidden')) {
                renderStations(); // re-render if on stations page
            }
        } else {
            showMessage(data.message || 'Failed to save booking.', 'error');
        }
    } catch (error) {
        showMessage('Network error occurred.', 'error');
    }
}

// Render Bookings List
function renderBookings() {
    const list = document.getElementById('bookings-list');
    list.innerHTML = '';

    if (bookings.length === 0) {
        list.innerHTML = '<p>You have no bookings.</p>';
        return;
    }

    // Sort bookings by newest first or just display as is
    const sorted = [...bookings].reverse();

    sorted.forEach(booking => {
        const station = stations.find(s => s.id === booking.stationId);
        const stationName = station ? station.name : 'Unknown Station';
        
        const card = document.createElement('div');
        card.className = 'booking-card';
        card.innerHTML = `
            <div class="booking-info">
                <h3>${stationName}</h3>
                <p>Date & Time: <strong>${booking.date} at ${booking.time}</strong></p>
                <p>Vehicle: <strong>${booking.vehicleModel} (${booking.vehicleNumber})</strong></p>
                <p>Status: <span class="badge ${booking.status === 'Cancelled' ? 'full' : 'available'}">${booking.status}</span></p>
            </div>
            <div class="booking-actions">
                <button class="btn btn-secondary btn-view-booking" data-id="${booking.id}">View</button>
                ${booking.status !== 'Cancelled' ? `<button class="btn btn-primary btn-edit-booking" data-id="${booking.id}">Edit</button>` : ''}
                ${booking.status !== 'Cancelled' ? `<button class="btn btn-danger btn-cancel-booking" data-id="${booking.id}">Cancel</button>` : ''}
            </div>
        `;
        list.appendChild(card);
    });

    // Attach events
    document.querySelectorAll('.btn-view-booking').forEach(btn => {
        btn.addEventListener('click', (e) => openBookingDetails(e.target.dataset.id));
    });
    document.querySelectorAll('.btn-edit-booking').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const b = bookings.find(x => x.id === e.target.dataset.id);
            if(b) openBookingForm(b.stationId, b.id);
        });
    });
    document.querySelectorAll('.btn-cancel-booking').forEach(btn => {
        btn.addEventListener('click', (e) => cancelBooking(e.target.dataset.id));
    });
}

// Open Booking Details
function openBookingDetails(id) {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    const station = stations.find(s => s.id === booking.stationId);
    
    document.getElementById('modal-booking-body').innerHTML = `
        <div class="detail-row"><div class="detail-label">Booking ID</div><div class="detail-value">${booking.id}</div></div>
        <div class="detail-row"><div class="detail-label">User Name</div><div class="detail-value">${booking.userName}</div></div>
        <div class="detail-row"><div class="detail-label">Contact</div><div class="detail-value">${booking.contact}</div></div>
        <div class="detail-row"><div class="detail-label">Station</div><div class="detail-value">${station ? station.name : booking.stationId}</div></div>
        <div class="detail-row"><div class="detail-label">Date & Time</div><div class="detail-value">${booking.date} ${booking.time}</div></div>
        <div class="detail-row"><div class="detail-label">Vehicle</div><div class="detail-value">${booking.vehicleModel} (${booking.vehicleNumber})</div></div>
        <div class="detail-row"><div class="detail-label">Charging Type</div><div class="detail-value">${booking.chargingType}</div></div>
        <div class="detail-row"><div class="detail-label">Duration</div><div class="detail-value">${booking.duration} Hour(s)</div></div>
        <div class="detail-row"><div class="detail-label">Status</div><div class="detail-value"><span class="badge ${booking.status === 'Cancelled' ? 'full' : 'available'}">${booking.status}</span></div></div>
    `;

    modals.bookingDetails.classList.remove('hidden');
}

// Cancel Booking
async function cancelBooking(id) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        const res = await fetch(`${API_BASE}/bookings/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        
        if (data.success) {
            showMessage('Booking cancelled successfully.', 'success');
            await fetchData();
            renderBookings();
        } else {
            showMessage(data.message || 'Failed to cancel booking.', 'error');
        }
    } catch (error) {
        showMessage('Network error occurred.', 'error');
    }
}

// Show Messages
function showMessage(msg, type) {
    const container = document.getElementById('message-container');
    container.textContent = msg;
    container.className = `message-container message-${type}`;
    
    setTimeout(() => {
        container.classList.add('hidden');
    }, 3000);
}

// Run
document.addEventListener('DOMContentLoaded', init);
```
