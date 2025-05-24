
import React from 'react';
import { EstimatedFareDetails } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface CabOptionsDisplayProps {
  options: EstimatedFareDetails[];
  onSelectCab: (cab: EstimatedFareDetails) => void;
  isLoading: boolean; // Global loading state from App.tsx
  onGoBack: () => void;
  bookingCabId?: string | null; // ID of the cab currently being booked
}

interface CabCardProps {
  option: EstimatedFareDetails;
  onSelectCab: (cab: EstimatedFareDetails) => void;
  isLoading: boolean; // Global loading state from App.tsx
  bookingCabId?: string | null; // ID of the cab currently being booked
}

const CabCard: React.FC<CabCardProps> = ({ option, onSelectCab, isLoading, bookingCabId }) => {
  const isCurrentlyBookingThisCab = isLoading && bookingCabId === option.cab.id;

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <img src={option.cab.image} alt={option.cab.name} className="w-full h-40 object-cover" />
      <div className="p-5">
        <div className="flex items-center mb-3">
          {option.cab.icon}
          <h3 className="ml-3 text-xl font-semibold text-slate-800">{option.cab.name}</h3>
        </div>
        <p className="text-sm text-slate-600 mb-1 h-12 overflow-hidden">{option.cab.description}</p>
        <p className="text-xs text-slate-500 mb-3">Capacity: {option.cab.capacity} passengers</p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
            <div className="text-slate-700"><span className="font-medium">Fare:</span> ${option.fare.toFixed(2)}</div>
            <div className="text-slate-700"><span className="font-medium">ETA:</span> {option.eta} mins</div>
            <div className="text-slate-700"><span className="font-medium">Dist:</span> {option.distance} km</div>
            <div className="text-slate-700"><span className="font-medium">Time:</span> {option.duration} mins</div>
        </div>

        <button
          onClick={() => onSelectCab(option)}
          disabled={isLoading} // Disable button if any global loading is active (searching cabs or booking ANY cab)
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isCurrentlyBookingThisCab ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Booking...
            </>
          ) : (
            'Book Now'
          )}
        </button>
      </div>
    </div>
  );
};


const CabOptionsDisplay: React.FC<CabOptionsDisplayProps> = ({ options, onSelectCab, isLoading, onGoBack, bookingCabId }) => {
  if (isLoading && options.length === 0 && !bookingCabId) { // Show main loading spinner if still fetching initial options and not in midst of booking
    return <LoadingSpinner message="Finding best rides for you..." size="lg" />;
  }

  if (options.length === 0 && !isLoading) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">No Cabs Found</h3>
        <p className="text-slate-500 mb-6">We couldn't find any cabs for your request. Please try different locations or try again later.</p>
        <button
            onClick={onGoBack}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition duration-150"
        >
            Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-700">Available Cabs</h2>
        <button
            onClick={onGoBack}
            disabled={isLoading} // Disable if any loading operation is in progress
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition duration-150 disabled:opacity-50"
        >
            &larr; Change Search
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((option) => (
          <CabCard 
            key={option.cab.id} 
            option={option} 
            onSelectCab={onSelectCab} 
            isLoading={isLoading} 
            bookingCabId={bookingCabId} 
          />
        ))}
      </div>
    </div>
  );
};

export default CabOptionsDisplay;
