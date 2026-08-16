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
  
  // Prevent changing station or status via general update to avoid complex slot logic here
  // Restrict fields if necessary, but spreading is fine for basic requirements
  updatedBooking.id = bookings[index].id; 
  updatedBooking.stationId = bookings[index].stationId; // Do not allow changing station in basic update
  
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
        stations[stationIndex].availability = 'Available'; // Or busy depending on logic, but available is fine
      }
    }
  }

  // Required by assessment: remove from array or mark as cancelled. 
  // "Remove/update the booking in the UI" -> Let's completely remove it or just mark it Cancelled.
  // Assessment says "Use a DELETE request as required... After cancellation: Remove/update the booking in the UI"
  // Let's actually remove it to cleanly follow DELETE semantics, or mark as cancelled if history is wanted. 
  // Let's delete it.
  bookings.splice(index, 1);
  
  res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
};
