
import React from 'react';
import { BookingDetails, BookingStatus } from '../types';

interface BookingConfirmationDisplayProps {
  bookingDetails: BookingDetails;
  onNewBooking: () => void;
}

const StatusIndicator: React.FC<{ status: BookingStatus }> = ({ status }) => {
  let bgColor = 'bg-yellow-400';
  let textColor = 'text-yellow-800';

  switch (status) {
    case BookingStatus.CONFIRMED:
      bgColor = 'bg-green-500';
      textColor = 'text-white';
      break;
    case BookingStatus.ARRIVED:
      bgColor = 'bg-blue-500';
      textColor = 'text-white';
      break;
    case BookingStatus.IN_PROGRESS:
      bgColor = 'bg-indigo-500';
      textColor = 'text-white';
      break;
    case BookingStatus.COMPLETED:
      bgColor = 'bg-slate-500';
      textColor = 'text-white';
      break;
    case BookingStatus.CANCELLED:
    case BookingStatus.FAILED:
      bgColor = 'bg-red-500';
      textColor = 'text-white';
      break;
  }

  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};


const BookingConfirmationDisplay: React.FC<BookingConfirmationDisplayProps> = ({ bookingDetails, onNewBooking }) => {
  const { 
    bookingId, pickupLocation, destination, cab, fare, eta, 
    driverName, vehicleModel, vehicleNumber, driverContact, status, driverGreeting 
  } = bookingDetails;

  return (
    <div className="w-full max-w-2xl p-6 md:p-8 bg-white shadow-2xl rounded-xl">
      <div className="text-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-3xl font-extrabold text-slate-800">Booking Confirmed!</h2>
        <p className="text-slate-600 mt-1">Your ride is on its way.</p>
      </div>

      {driverGreeting && (
         <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-sm text-indigo-700 italic">"{driverGreeting}"</p>
            <p className="text-xs text-indigo-500 text-right mt-1">- {driverName}</p>
         </div>
      )}

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-medium">Booking ID:</span>
          <span className="text-slate-700 font-semibold">{bookingId}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-medium">Status:</span>
          <StatusIndicator status={status} />
        </div>
        
        <div className="pt-2">
            <h4 className="font-semibold text-slate-700 mb-1">Trip Details:</h4>
            <p className="text-sm text-slate-600"><span className="font-medium">From:</span> {pickupLocation}</p>
            <p className="text-sm text-slate-600"><span className="font-medium">To:</span> {destination}</p>
        </div>

        <div>
            <h4 className="font-semibold text-slate-700 mb-1">Cab & Fare:</h4>
            <div className="flex items-center">
              {cab.icon}
              <span className="ml-2 text-sm text-slate-600">{cab.name}</span>
            </div>
            <p className="text-sm text-slate-600"><span className="font-medium">Total Fare:</span> ${fare.toFixed(2)}</p>
            <p className="text-sm text-slate-600"><span className="font-medium">Driver ETA:</span> {eta} minutes</p>
        </div>
        
        <div>
            <h4 className="font-semibold text-slate-700 mb-1">Driver Information:</h4>
            <p className="text-sm text-slate-600"><span className="font-medium">Name:</span> {driverName}</p>
            <p className="text-sm text-slate-600"><span className="font-medium">Vehicle:</span> {vehicleModel} ({vehicleNumber})</p>
            <p className="text-sm text-slate-600"><span className="font-medium">Contact:</span> {driverContact}</p>
        </div>
      </div>

      <button
        onClick={onNewBooking}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
      >
        Book Another Ride
      </button>
    </div>
  );
};

export default BookingConfirmationDisplay;
