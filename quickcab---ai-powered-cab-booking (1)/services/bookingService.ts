
import {
  CabOption,
  EstimatedFareDetails,
  BookingRequestData,
  BookingDetails,
  BookingStatus,
  CabType,
} from '../types';
import { AVAILABLE_CAB_OPTIONS, DUMMY_DRIVERS, API_REQUEST_DELAY } from '../constants';
import { generateDriverGreeting, generateCabDescription } from './geminiService';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate fetching available cabs and calculating fares
export const getAvailableCabsAndFares = async (pickup: string, destination: string): Promise<EstimatedFareDetails[]> => {
  await delay(API_REQUEST_DELAY);

  if (!pickup || !destination) {
    // throw new Error("Pickup and destination are required.");
    // To prevent app crash on empty input, return empty array. Error handling in UI.
    console.warn("Pickup or destination is empty. Returning no cabs.");
    return [];
  }
  
  // Simulate varying distances and durations
  const baseDistance = Math.random() * 20 + 5; // 5km to 25km
  const baseDuration = baseDistance * (Math.random() * 2 + 2.5); // 2.5 to 4.5 mins per km

  const estimatedCabs: EstimatedFareDetails[] = await Promise.all(AVAILABLE_CAB_OPTIONS.map(async (cab) => {
    const distance = baseDistance * (1 + (Math.random() - 0.5) * 0.2); // +/- 10% variation
    const duration = baseDuration * (1 + (Math.random() - 0.5) * 0.2); // +/- 10% variation
    
    const fare = cab.baseFare + (distance * cab.perKmRate) + (duration * cab.perMinuteRate);
    const eta = Math.floor(Math.random() * 10 + 5); // 5 to 15 minutes ETA

    // Optionally fetch dynamic description from Gemini here, or use static one
    // For this example, we are using static one from constants.tsx to reduce API calls during search
    // const dynamicDescription = await generateCabDescription(cab.name, cab.type);

    return {
      cab: { ...cab /* description: dynamicDescription */ }, // If using dynamic description
      distance: parseFloat(distance.toFixed(1)),
      duration: Math.round(duration),
      fare: parseFloat(fare.toFixed(2)),
      eta: eta,
    };
  }));

  return estimatedCabs.sort((a,b) => a.fare - b.fare); // Sort by fare
};

// Simulate booking a cab
export const confirmBooking = async (request: BookingRequestData, estimatedDetails: EstimatedFareDetails): Promise<BookingDetails> => {
  await delay(API_REQUEST_DELAY + 1000); // Longer delay for booking

  // Simulate a small chance of booking failure
  if (Math.random() < 0.05) { // 5% chance of failure
    throw new Error("Booking failed. No drivers available for the selected cab. Please try another option.");
  }

  const driverPool = DUMMY_DRIVERS.filter(d => {
      // Simple logic: specific drivers for specific cab types (can be expanded)
      if (estimatedDetails.cab.type === CabType.LUXURY) return d.vehicleModel.includes("Mercedes") || d.vehicleModel.includes("Tesla");
      if (estimatedDetails.cab.type === CabType.SUV) return d.vehicleModel.includes("CR-V") || d.vehicleModel.includes("SUV");
      if (estimatedDetails.cab.type === CabType.MINIVAN) return d.vehicleModel.includes("Transit");
      return true; // Other types can be driven by anyone else
  });
  
  const randomDriver = driverPool[Math.floor(Math.random() * driverPool.length)] || DUMMY_DRIVERS[0];


  const bookingId = `QCB-${Date.now().toString().slice(-6)}`;
  const vehicleNumber = `XX${Math.floor(Math.random()*90)+10}YY${Math.floor(Math.random()*9000)+1000}`;

  // Generate AI driver greeting
  const driverGreeting = await generateDriverGreeting(randomDriver.name, estimatedDetails.cab.name, request.destination);

  return {
    bookingId,
    pickupLocation: request.pickupLocation,
    destination: request.destination,
    cab: estimatedDetails.cab,
    fare: estimatedDetails.fare,
    eta: estimatedDetails.eta, // Initial ETA from search, could be updated live
    driverName: randomDriver.name,
    vehicleModel: randomDriver.vehicleModel,
    vehicleNumber: vehicleNumber,
    driverContact: randomDriver.contact,
    status: BookingStatus.CONFIRMED,
    driverGreeting: driverGreeting,
  };
};
