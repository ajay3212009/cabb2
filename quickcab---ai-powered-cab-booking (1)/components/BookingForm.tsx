
import React, { useState } from 'react';

interface BookingFormProps {
  onSearchCabs: (pickup: string, destination: string) => void;
  isLoading: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSearchCabs, isLoading }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation.trim() || !destination.trim()) {
      setError('Please enter both pickup and destination locations.');
      return;
    }
    setError('');
    onSearchCabs(pickupLocation, destination);
  };

  return (
    <div className="w-full max-w-lg p-6 md:p-8 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">Where to?</h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="pickup" className="block text-sm font-medium text-slate-600 mb-1">
            Pickup Location
          </label>
          <input
            type="text"
            id="pickup"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            placeholder="e.g., Central Park"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-slate-600 mb-1">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Times Square"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !pickupLocation.trim() || !destination.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            'Search Cabs'
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
