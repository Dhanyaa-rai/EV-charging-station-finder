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
