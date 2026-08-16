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
