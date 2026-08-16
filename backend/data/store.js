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
