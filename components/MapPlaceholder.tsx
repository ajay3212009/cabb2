
import React from 'react';

interface MapPlaceholderProps {
  pickupLocation?: string;
  destination?: string;
  bookingStatus?: string;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ pickupLocation, destination, bookingStatus }) => {
  let message = "Map will display ride progress here.";
  if (pickupLocation && destination && !bookingStatus) {
    message = `Visualizing route from ${pickupLocation} to ${destination}.`;
  } else if (bookingStatus) {
    message = `Tracking your ride for booking: ${bookingStatus}`;
  }

  return (
    <div className="w-full h-64 md:h-96 bg-slate-200 rounded-lg shadow-inner flex items-center justify-center p-4">
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-.553-.894L15 2m-6 5l6-3m-6 3l6 10" />
        </svg>
        <p className="text-slate-500 text-sm font-medium">{message}</p>
        <p className="text-xs text-slate-400 mt-1">(Interactive map integration is a future enhancement)</p>
      </div>
    </div>
  );
};

export default MapPlaceholder;
