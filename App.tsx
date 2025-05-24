
import React, { useState, useCallback, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen'; // Import RegisterScreen
import BookingForm from './components/BookingForm';
import CabOptionsDisplay from './components/CabOptionsDisplay';
import BookingConfirmationDisplay from './components/BookingConfirmationDisplay';
import MapPlaceholder from './components/MapPlaceholder';
import LoadingSpinner from './components/LoadingSpinner';
import { getAvailableCabsAndFares, confirmBooking } from './services/bookingService';
import { AppView, EstimatedFareDetails, BookingDetails, BookingRequestData } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('LOGIN'); // Start with LOGIN view
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [availableCabs, setAvailableCabs] = useState<EstimatedFareDetails[]>([]);
  const [selectedCabForBooking, setSelectedCabForBooking] = useState<EstimatedFareDetails | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  const resetSearch = () => {
    setPickupLocation('');
    setDestination('');
    setAvailableCabs([]);
    setSelectedCabForBooking(null);
    setErrorMessage(null);
  };
  
  const resetToHome = () => {
    resetSearch();
    setBookingDetails(null);
    setCurrentView('HOME');
  };

  // --- Authentication and Navigation Handlers ---
  const handleLoginSuccess = () => {
    setCurrentView('HOME');
  };

  const handleNavigateToRegister = () => {
    setCurrentView('REGISTER');
  };
  
  const handleNavigateToLogin = () => {
    setCurrentView('LOGIN');
  };

  const handleRegisterSuccess = () => {
    // After successful registration, navigate to home
    setCurrentView('HOME'); 
    // Optionally, you could show a success message here before navigating
  };
  // --- End Authentication and Navigation Handlers ---


  const handleSearchCabs = useCallback(async (pickup: string, dest: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setPickupLocation(pickup);
    setDestination(dest);
    setSelectedCabForBooking(null); // Reset selected cab when new search initiated
    setCurrentView('LOADING'); 
    try {
      const cabs = await getAvailableCabsAndFares(pickup, dest);
      if (cabs.length === 0 && pickup && dest) {
         setErrorMessage("No cabs found for the selected route. Please try different locations.");
      }
      setAvailableCabs(cabs);
      setCurrentView('SELECTING_CAB');
    } catch (error) {
      console.error("Failed to search cabs:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred while searching for cabs.");
      setCurrentView('ERROR');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectCab = useCallback(async (cabOption: EstimatedFareDetails) => {
    if (!pickupLocation || !destination) {
        setErrorMessage("Pickup and destination are missing. Please start over.");
        setCurrentView('ERROR');
        return;
    }
    setSelectedCabForBooking(cabOption); // Set this first so UI can react
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentView('LOADING'); 

    const bookingRequest: BookingRequestData = {
      pickupLocation,
      destination,
      cabId: cabOption.cab.id,
    };

    try {
      const details = await confirmBooking(bookingRequest, cabOption);
      setBookingDetails(details);
      setCurrentView('CONFIRMATION');
    } catch (error) {
      console.error("Failed to book cab:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred during booking.");
      setCurrentView('ERROR'); 
    } finally {
      setIsLoading(false);
      // Don't reset selectedCabForBooking here, it might be needed if user goes back from error
    }
  }, [pickupLocation, destination]);
  
  useEffect(() => {
    // Clear error message when navigating away from error view or loading a new view,
    // unless it's the loading view itself (which might set its own temporary messages).
    if (currentView !== 'ERROR' && currentView !== 'LOADING' && errorMessage) {
      // setErrorMessage(null); // Decided to let error messages persist until explicitly cleared by user action or new successful operation
    }
  }, [currentView, errorMessage]);


  const renderContent = () => {
    switch (currentView) {
      case 'LOGIN':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} onNavigateToRegister={handleNavigateToRegister} />;
      case 'REGISTER':
        return <RegisterScreen onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={handleNavigateToLogin} />;
      case 'HOME':
        return <BookingForm onSearchCabs={handleSearchCabs} isLoading={isLoading} />;
      case 'LOADING':
        return <LoadingSpinner message={selectedCabForBooking ? "Confirming your booking..." : "Finding available rides..."} size="lg" />;
      case 'SELECTING_CAB':
        return (
          <CabOptionsDisplay
            options={availableCabs}
            onSelectCab={handleSelectCab}
            isLoading={isLoading}
            onGoBack={() => { resetSearch(); setCurrentView('HOME');}}
            bookingCabId={selectedCabForBooking?.cab.id} 
          />
        );
      case 'CONFIRMATION':
        return bookingDetails ? (
          <BookingConfirmationDisplay bookingDetails={bookingDetails} onNewBooking={resetToHome} />
        ) : (
          <div className="text-center p-8">
            <p className="text-red-500">Error: Booking details are missing.</p>
            <button onClick={resetToHome} className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded">Start Over</button>
          </div>
        );
      case 'ERROR':
        return (
          <div className="text-center p-8 bg-white shadow-xl rounded-xl max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-red-700 mb-2">Oops! Something went wrong.</h3>
            <p className="text-slate-600 mb-6">{errorMessage || "An unexpected error occurred."}</p>
            <button
              onClick={() => {
                setErrorMessage(null); // Clear error on trying again
                if (currentView === 'ERROR' && selectedCabForBooking && availableCabs.length > 0) { 
                  // If error happened during booking confirmation, go back to cab selection
                  setCurrentView('SELECTING_CAB');
                  setSelectedCabForBooking(null); // Clear the cab that failed booking attempt
                } else { 
                  // Otherwise, go back to home/booking form
                  resetToHome();
                }
              }}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition duration-150"
            >
              {selectedCabForBooking && availableCabs.length > 0 && currentView === 'ERROR' ? 'Try Another Cab' : 'Try Again'}
            </button>
          </div>
        );
      default: // Fallback to HOME if view is unrecognized
        return <BookingForm onSearchCabs={handleSearchCabs} isLoading={isLoading} />;
    }
  };
  
  // If on login or register screen, render only that screen, otherwise render full app layout
  if (currentView === 'LOGIN' || currentView === 'REGISTER') {
    return renderContent(); // renderContent will correctly pick LoginScreen or RegisterScreen
  }

  // Main App Layout (for HOME, SELECTING_CAB, CONFIRMATION, LOADING, ERROR views)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-gray-100 flex flex-col items-center justify-start p-4 selection:bg-indigo-100 selection:text-indigo-700"> {/* Changed justify-center to justify-start for better layout control */}
      <header className="w-full max-w-4xl mx-auto my-8 text-center"> {/* Added my-8 for margin */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-2">
          QuickCab
        </h1>
        <p className="text-slate-600 mt-1 text-sm md:text-base">Your AI-Powered Ride Hailing Service</p>
      </header>
      
      <main className="w-full flex flex-col items-center space-y-8 flex-grow"> {/* Added flex-grow to push footer down */}
        {/* Conditionally render MapPlaceholder based on view */}
        {(currentView === 'SELECTING_CAB' || (currentView === 'HOME' && (pickupLocation || destination))) && (
            <div className="w-full max-w-3xl">
                 <MapPlaceholder 
                    pickupLocation={pickupLocation} 
                    destination={destination} 
                    bookingStatus={bookingDetails?.status} 
                />
            </div>
        )}
        <div className="w-full flex justify-center">
            {renderContent()}
        </div>
         {currentView === 'CONFIRMATION' && bookingDetails && ( 
            <div className="w-full max-w-3xl mt-8">
                 <MapPlaceholder 
                    pickupLocation={bookingDetails.pickupLocation} 
                    destination={bookingDetails.destination} 
                    bookingStatus={bookingDetails.status} 
                />
            </div>
        )}
      </main>

      <footer className="w-full max-w-4xl mx-auto mt-12 py-6 text-center border-t border-slate-200"> {/* Added py-6 and border-t */}
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} QuickCab Inc. All rights reserved.
          <br/> {/* Added line break for better readability */}
          Powered by React, TailwindCSS, and Gemini AI.
        </p>
        {!process.env.API_KEY && (
          <p className="text-xs text-red-500 mt-1">
            Note: Gemini API key not detected. AI features may be limited or non-functional.
          </p>
        )}
      </footer>
    </div>
  );
};

export default App;
