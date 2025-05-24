import React, { useState, useEffect, useRef } from 'react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void; // New prop for navigating to register screen
}

interface FloatingElement {
  id: number;
  style: React.CSSProperties;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginButtonText, setLoginButtonText] = useState('Sign In');
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const backgroundPatternRef = useRef<HTMLDivElement>(null);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setLoginButtonText('Signing In...');

    setTimeout(() => {
      setIsLoading(false);
      setLoginButtonText('✓ Welcome back!');
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    }, 2000);
  };
  
  const socialLogin = (provider: string) => {
    setIsLoading(true); // Show loading for social login as well
    setLoginButtonText(`Connecting with ${provider}...`); // Update main button text or a dedicated message area
    
    setTimeout(() => {
        setIsLoading(false);
        setLoginButtonText(`✓ Signed in with ${provider}`); // Update for feedback
         setTimeout(() => {
            onLoginSuccess();
        }, 1500);
    }, 1000); // Simulate API call
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
        .login-button-gradient { background: linear-gradient(135deg, #9333ea 0%, #3b82f6 50%, #10b981 100%); }
        .login-button-success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
      `}</style>
      <div className="w-full min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] flex flex-col items-center justify-center overflow-hidden relative">
        <div ref={backgroundPatternRef} className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.1)_0%,transparent_50%),radial-gradient(circle_at_60%_20%,rgba(16,185,129,0.05)_0%,transparent_50%)]" style={{ animation: 'backgroundShift 20s ease-in-out infinite' }}></div>
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingElements.map(el => (
            <div key={el.id} className="floating-element-item" style={el.style}></div>
          ))}
        </div>

        <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm px-6 py-10 sm:px-8 sm:py-12 relative z-[2]">
          <div className="text-center mb-12 sm:mb-16" style={{ animation: 'fadeInUp 1s ease-out' }}>
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-blue-500 to-green-500 rounded-[20px] flex items-center justify-center text-3xl mx-auto mb-5 shadow-[0_8px_32px_rgba(147,51,234,0.3),0_0_0_1px_rgba(255,255,255,0.1)]" style={{ animation: 'logoGlow 3s ease-in-out infinite' }}>
              🚗
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-green-500">
              QuickCab Login
            </h1>
            <p className="text-base text-gray-400 font-normal">Your ride, your way</p>
          </div>

          <form className="w-full" style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }} onSubmit={handleLogin}>
            <div className="relative mb-6 input-field-container transition-transform duration-300">
              <input 
                type="email" 
                className="input-field w-full pt-[18px] pb-[18px] pr-5 pl-[50px] bg-white/5 border border-white/10 rounded-2xl text-white text-base backdrop-blur-xl transition-all duration-300 focus:outline-none focus:border-purple-500/50 focus:bg-white/[.08] focus:shadow-[0_0_0_3px_rgba(147,51,234,0.1),0_8px_32px_rgba(0,0,0,0.3)]"
                placeholder="Email address"
                required
                autoComplete="email"
                aria-label="Email address"
                disabled={isLoading}
              />
              <span className="input-icon-svg absolute left-[18px] top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-colors duration-300" aria-hidden="true">📧</span>
            </div>

            <div className="relative mb-4 input-field-container transition-transform duration-300">
              <input 
                type="password" 
                className="input-field w-full pt-[18px] pb-[18px] pr-5 pl-[50px] bg-white/5 border border-white/10 rounded-2xl text-white text-base backdrop-blur-xl transition-all duration-300 focus:outline-none focus:border-purple-500/50 focus:bg-white/[.08] focus:shadow-[0_0_0_3px_rgba(147,51,234,0.1),0_8px_32px_rgba(0,0,0,0.3)]"
                placeholder="Password"
                required
                autoComplete="current-password"
                aria-label="Password"
                disabled={isLoading}
              />
              <span className="input-icon-svg absolute left-[18px] top-1/2 -translate-y-1/2 text-lg text-gray-500 transition-colors duration-300" aria-hidden="true">🔒</span>
            </div>
            
            <div className="text-right mb-8">
              <a href="#" onClick={(e)=>{e.preventDefault(); if (!isLoading) alert('Forgot Password Clicked!');}} className={`text-gray-500 text-sm transition-colors duration-300 hover:text-purple-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                Forgot Password?
              </a>
            </div>

            <button 
              type="submit" 
              className={`w-full py-[18px] border-none rounded-2xl text-white text-base font-bold cursor-pointer transition-all duration-300 shadow-[0_8px_32px_rgba(147,51,234,0.3),0_0_0_1px_rgba(255,255,255,0.1)] mb-6 relative overflow-hidden hover:translate-y-[-2px] hover:shadow-[0_12px_48px_rgba(147,51,234,0.4),0_0_0_1px_rgba(255,255,255,0.2)] active:translate-y-0 ${loginButtonText.startsWith('✓') ? 'login-button-success' : 'login-button-gradient'} ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
              disabled={isLoading}
            >
              {loginButtonText}
            </button>
          </form>

          <div className="flex items-center my-6 sm:my-8 text-gray-500 text-sm w-full">
            <span className="flex-1 h-px bg-white/10"></span>
            <span className="px-4">Or continue with</span>
            <span className="flex-1 h-px bg-white/10"></span>
          </div>

          <div className="flex gap-4 mb-6 sm:mb-8 w-full">
            <button onClick={() => {if(!isLoading) socialLogin('Google')}} aria-label="Sign in with Google" className={`flex-1 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl flex items-center justify-center hover:bg-white/10 hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
              🔍
            </button>
            <button onClick={() => {if(!isLoading) socialLogin('Apple')}} aria-label="Sign in with Apple" className={`flex-1 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl flex items-center justify-center hover:bg-white/10 hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
              🍎
            </button>
            <button onClick={() => {if(!isLoading) socialLogin('Facebook')}} aria-label="Sign in with Facebook" className={`flex-1 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl flex items-center justify-center hover:bg-white/10 hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
              📘
            </button>
          </div>

          <div className="text-center text-gray-500 text-sm" style={{ animation: 'fadeInUp 1s ease-out 0.6s both' }}>
            Don't have an account?{' '}
            <a href="#" onClick={(e)=>{e.preventDefault(); if(!isLoading) onNavigateToRegister();}} className={`text-purple-500 font-semibold transition-colors duration-300 hover:text-purple-400 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Sign up
            </a>
          </div>
        </div>

        {isLoading && !loginButtonText.startsWith('✓') && ( // Only show overlay if actively loading and not showing success
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000]">
            <div className="w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full" style={{animation: 'spin 1s linear infinite'}}></div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginScreen;