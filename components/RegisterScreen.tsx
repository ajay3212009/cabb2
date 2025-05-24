
import React, { useState, useEffect, useRef } from 'react';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

interface FloatingElement {
  id: number;
  style: React.CSSProperties;
}

type RegistrationStep = 'mobile' | 'otp' | 'details';

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [actionButtonText, setActionButtonText] = useState('Send OTP');
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const backgroundPatternRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState<RegistrationStep>('mobile');
  
  // Step 1: Mobile
  const [mobileNumber, setMobileNumber] = useState('');
  
  // Step 2: OTP
  const [otp, setOtp] = useState('');
  // const mockOtp = "123456"; // Original mock OTP

  // Step 3: Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [headerText, setHeaderText] = useState('Enter Mobile Number');
  const [taglineText, setTaglineText] = useState('We\'ll send you a verification code.');


  useEffect(() => {
    switch (currentStep) {
      case 'mobile':
        setHeaderText('Enter Mobile Number');
        setTaglineText('We\'ll send you a verification code.');
        setActionButtonText('Send OTP');
        break;
      case 'otp':
        setHeaderText('Verify OTP');
        setTaglineText(`Enter the 6-digit code sent to ${mobileNumber}. (Verification temporarily bypassed)`);
        setActionButtonText('Verify Code');
        break;
      case 'details':
        setHeaderText('Create Your Account');
        setTaglineText('Almost there! Just a few more details.');
        setActionButtonText('Create Account');
        break;
    }
  }, [currentStep, mobileNumber]);

  const handleNextStep = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    switch (currentStep) {
      case 'mobile':
        setActionButtonText('Sending OTP...');
        if (!mobileNumber.trim() || !/^\d{10,15}$/.test(mobileNumber.trim())) {
            setError('Please enter a valid mobile number (10-15 digits).');
            setIsLoading(false);
            setActionButtonText('Send OTP');
            return;
        }
        setTimeout(() => {
          setIsLoading(false);
          setCurrentStep('otp');
        }, 1500); // Simulate OTP sending
        break;
      
      case 'otp':
        setActionButtonText('Verifying...');
        // TEMPORARILY BYPASSED OTP CHECK
        // if (otp !== mockOtp) {
        //   setError('Incorrect OTP. Please try again.');
        //   setIsLoading(false);
        //   setActionButtonText('Verify Code');
        //   return;
        // }
        console.log("OTP verification step bypassed for testing.");
        setTimeout(() => {
          setIsLoading(false);
          setCurrentStep('details');
        }, 1000); // Simulate OTP verification
        break;

      case 'details':
        setActionButtonText('Creating Account...');
        if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            setIsLoading(false);
            setActionButtonText('Create Account');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            setIsLoading(false);
            setActionButtonText('Create Account');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            setActionButtonText('Create Account');
            return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setIsLoading(false);
          setActionButtonText('Create Account');
          return;
        }
        setTimeout(() => {
          setIsLoading(false);
          setActionButtonText('✓ Account Created!');
          setTimeout(() => {
            onRegisterSuccess();
          }, 1500);
        }, 2000); // Simulate account creation
        break;
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep === 'otp') {
        setCurrentStep('mobile');
        setOtp(''); // Clear OTP field
    } else if (currentStep === 'details') {
        setCurrentStep('otp');
        // Optionally clear details fields or retain them
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFloatingElements(prevElements => {
        const newElement: FloatingElement = {
          id: Date.now(),
          style: {
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
            background: `rgba(${Math.floor(Math.random()*100 + 50)}, ${Math.floor(Math.random()*100+50)}, ${Math.floor(Math.random()*150+100)}, 0.3)`
          }
        };
        const updatedElements = [...prevElements, newElement].slice(-10); 
        return updatedElements;
      });
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (backgroundPatternRef.current) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        backgroundPatternRef.current.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px)`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'mobile':
        return (
          <div className="relative mb-8 input-field-container transition-transform duration-300">
            <input 
              type="tel" 
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="input-field w-full pt-[18px] pb-[18px] pr-5 pl-[50px] bg-white/5 border border-white/10 rounded-2xl text-white text-base backdrop-blur-xl transition-all duration-300 focus:outline-none focus:border-purple-500/50 focus:bg-white/[.08] focus:shadow-[0_0_0_3px_rgba(147,51,234,0.1),0_8px_32px_rgba(0,0,0,0.3)]"
              placeholder="Mobile Number"
              required
              autoComplete="tel"
              aria-label="Mobile Number"
              disabled={isLoading}
            />
            <span className="input-icon-svg absolute left-[18px] top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-colors duration-300" aria-hidden="true">📱</span>
          </div>
        );
      case 'otp':
        return (
          <div className="relative mb-8 input-field-container transition-transform duration-300">
            <input 
              type="text" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="input-field w-full pt-[18px] pb-[18px] pr-5 pl-[50px] bg-white/5 border border-white/10 rounded-2xl text-white text-base backdrop-blur-xl transition-all duration-300 focus:outline-none focus:border-purple-500/50 focus:bg-white/[.08] focus:shadow-[0_0_0_3px_rgba(147,51,234,0.1),0_8px_32px_rgba(0,0,0,0.3)] tracking-[0.3em] text-center"
              placeholder="______"
              required
              autoComplete="one-time-code"
              aria-label="OTP Code"
              disabled={isLoading}
            />
             <span className="input-icon-svg absolute left-[18px] top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-colors duration-300" aria-hidden="true">💬</span>
          </div>
        );
      case 'details':
        return (
          <>
            <div className="relative mb-5 input-field-container transition-transform duration-300">
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field w-full pt-[18px] pb-[18px] pr-5 pl-[50px] bg-white/5 border border-white/10 rounded-2xl text-white text-base backdrop-blur-xl transition-all duration-300 focus:outline-none focus:border-purple-500/50 focus:bg-white/[.08] focus:shadow-[0_0_0_3px_rgba(147,51,234,0.1),0_8px_32px_rgba(0,0,0,0.3)]"
                placeholder="Full Name"
                required
                autoComplete="name"
                aria-label="Full Name"
                disabled={isLoading}
              />
              <span className="input-icon-svg absolute left-[18px] top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-colors duration-300" aria-hidden="true">👤</span>
            </div>
            
            <div className="relative mb-5 input-field-container transition-transform duration-300">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full pt-[18px] pb-[18px] pr-5 pl-[50px] bg-white/5 border border-white/10 rounded-2xl text-white text-base backdrop-blur-xl transition-all duration-300 focus:outline-none focus:border-purple-500/50 focus:bg-white/[.08] focus:shadow-[0_0_0_3px_rgba(147,51,234,0.1),0_8px_32px_rgba(0,0,0,0.3)]"
                placeholder="Email address"
                required
                autoComplete="email"
                aria-label="Email address"
                disabled={isLoading}
              />
              <span className="input-icon-svg absolute left-[18px] top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-colors duration-300" aria-hidden="true">📧</span>
            </div>

            <div className="relative mb-5 input-field-container transition-transform duration-300">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full pt-[18px] pb-[18px] pr-5 pl-[50px] bg-white/5 border border-white/10 rounded-2xl text-white text-base backdrop-blur-xl transition-all duration-300 focus:outline-none focus:border-purple-500/50 focus:bg-white/[.08] focus:shadow-[0_0_0_3px_rgba(147,51,234,0.1),0_8px_32px_rgba(0,0,0,0.3)]"
                placeholder="Password"
                required
                autoComplete="new-password"
                aria-label="Password"
                disabled={isLoading}
              />
              <span className="input-icon-svg absolute left-[18px] top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-colors duration-300" aria-hidden="true">🔒</span>
            </div>

            <div className="relative mb-8 input-field-container transition-transform duration-300">
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field w-full pt-[18px] pb-[18px] pr-5 pl-[50px] bg-white/5 border border-white/10 rounded-2xl text-white text-base backdrop-blur-xl transition-all duration-300 focus:outline-none focus:border-purple-500/50 focus:bg-white/[.08] focus:shadow-[0_0_0_3px_rgba(147,51,234,0.1),0_8px_32px_rgba(0,0,0,0.3)]"
                placeholder="Confirm Password"
                required
                autoComplete="new-password"
                aria-label="Confirm Password"
                disabled={isLoading}
              />
              <span className="input-icon-svg absolute left-[18px] top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-colors duration-300" aria-hidden="true">🔑</span>
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <>
      <style>{`
        body, html {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0a0a0a !important; 
            overflow-x: hidden;
            overflow-y: auto; 
            min-height: 100vh;
            margin:0;
            padding:0;
        }
        
        #root { 
            width: 100%;
            min-height: 100vh;
        }

        @keyframes backgroundShift { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes logoGlow { 0%, 100% { box-shadow: 0 8px 32px rgba(147, 51, 234, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1); } 50% { box-shadow: 0 12px 48px rgba(147, 51, 234, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .floating-element-item { position: absolute; width: 4px; height: 4px; border-radius: 50%; animation: floatAnimation 15s linear infinite; }
        @keyframes floatAnimation { 0% { transform: translateY(0px) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .input-field-container:focus-within { transform: translateY(-2px); }
        .input-field:focus + .input-icon-svg { color: #9333ea; }
        .action-button-gradient { background: linear-gradient(135deg, #9333ea 0%, #3b82f6 50%, #10b981 100%); }
        .action-button-success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255,255,255,0.1);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }
        .back-button:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.1);
        }
      `}</style>
      <div className="w-full min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] flex flex-col items-center justify-center overflow-hidden relative">
        <div ref={backgroundPatternRef} className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.1)_0%,transparent_50%),radial-gradient(circle_at_60%_20%,rgba(16,185,129,0.05)_0%,transparent_50%)]" style={{ animation: 'backgroundShift 20s ease-in-out infinite' }}></div>
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingElements.map(el => (
            <div key={el.id} className="floating-element-item" style={el.style}></div>
          ))}
        </div>

        {(currentStep === 'otp' || currentStep === 'details') && !isLoading && (
             <button onClick={handleBack} className="back-button" aria-label="Go back">
                &larr;
             </button>
        )}

        <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm px-6 py-8 sm:px-8 sm:py-10 relative z-[2]">
          <div className="text-center mb-8 sm:mb-10" style={{ animation: 'fadeInUp 1s ease-out' }}>
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-blue-500 to-green-500 rounded-[20px] flex items-center justify-center text-3xl mx-auto mb-5 shadow-[0_8px_32px_rgba(147,51,234,0.3),0_0_0_1px_rgba(255,255,255,0.1)]" style={{ animation: 'logoGlow 3s ease-in-out infinite' }}>
              {currentStep === 'mobile' ? '📱' : currentStep === 'otp' ? '💬' : '🚀'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-green-500">
              {headerText}
            </h1>
            <p className="text-base text-gray-400 font-normal">{taglineText}</p>
          </div>

          {error && (
            <div className="w-full bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm text-center" style={{ animation: 'fadeInUp 1s ease-out 0.1s both' }}>
              {error}
            </div>
          )}

          <form className="w-full" style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }} onSubmit={handleNextStep}>
            {renderStepContent()}
            
            <button 
              type="submit" 
              className={`w-full py-[18px] border-none rounded-2xl text-white text-base font-bold cursor-pointer transition-all duration-300 shadow-[0_8px_32px_rgba(147,51,234,0.3),0_0_0_1px_rgba(255,255,255,0.1)] mb-6 relative overflow-hidden hover:translate-y-[-2px] hover:shadow-[0_12px_48px_rgba(147,51,234,0.4),0_0_0_1px_rgba(255,255,255,0.2)] active:translate-y-0 ${actionButtonText.startsWith('✓') ? 'action-button-success' : 'action-button-gradient'} ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
              disabled={isLoading}
            >
              {actionButtonText}
            </button>
          </form>

          {currentStep !== 'details' || !actionButtonText.startsWith('✓') && (
             <div className="text-center text-gray-500 text-sm" style={{ animation: 'fadeInUp 1s ease-out 0.6s both' }}>
                Already have an account?{' '}
                <a href="#" onClick={(e)=>{e.preventDefault(); if(!isLoading) onNavigateToLogin();}} className={`text-purple-500 font-semibold transition-colors duration-300 hover:text-purple-400 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                Sign In
                </a>
            </div>
          )}
        </div>

        {isLoading && !actionButtonText.startsWith('✓') && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000]">
            <div className="w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full" style={{animation: 'spin 1s linear infinite'}}></div>
          </div>
        )}
      </div>
    </>
  );
};

export default RegisterScreen;
    