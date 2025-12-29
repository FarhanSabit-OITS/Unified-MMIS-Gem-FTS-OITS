import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { AuthPage } from './components/auth/AuthPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DashboardLayout } from './components/DashboardLayout';
import { LandingPage } from './components/LandingPage';
import { ApiService } from './services/api';
import { Loader2 } from 'lucide-react';

export const App = () => {
  const [view, setView] = useState<'LANDING' | 'AUTH' | 'ONBOARDING' | 'DASHBOARD' | 'VERIFYING'>('LANDING');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [notification, setNotification] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    const init = async () => {
      // 1. Check for Verification Token in URL
      const params = new URLSearchParams(window.location.search);
      const verifyToken = params.get('verify_token');

      if (verifyToken) {
        setView('VERIFYING');
        try {
          // Verify with Backend
          const response = await ApiService.auth.verifyEmail(verifyToken);
          setNotification({ msg: 'Email verified successfully! Please login.', type: 'success' });
          // Clean URL
          window.history.replaceState({}, document.title, "/");
          setView('AUTH');
        } catch (error) {
          setNotification({ msg: 'Verification link expired or invalid.', type: 'error' });
          setView('LANDING');
        }
        return;
      }

      // 2. Check for persisted session
      const savedUser = localStorage.getItem('mmis_user');
      const token = localStorage.getItem('mmis_token');
      
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
        setView('DASHBOARD');
      }
    };

    init();
  }, []);

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('mmis_user', JSON.stringify(userData));
    
    // Redirect logic
    if (userData.kycStatus === 'PENDING' && !userData.isVerified) {
        setView('ONBOARDING');
    } else {
        setView('DASHBOARD');
    }
  };

  const handleLogout = () => {
    ApiService.auth.logout();
    setUser(null);
    setView('LANDING');
  };

  const handleCompleteOnboarding = () => {
    if (user) {
        const updatedUser = { ...user, isVerified: true };
        setUser(updatedUser);
        localStorage.setItem('mmis_user', JSON.stringify(updatedUser));
        setView('DASHBOARD');
    }
  };

  if (view === 'VERIFYING') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Verifying your secure link...</h2>
      </div>
    );
  }

  return (
    <div className="antialiased text-slate-900">
      {notification && (
        <div className={`fixed top-0 left-0 right-0 p-3 text-center text-sm font-bold z-50 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.msg}
          <button onClick={() => setNotification(null)} className="ml-4 underline opacity-80">Dismiss</button>
        </div>
      )}

      {view === 'LANDING' && (
        <LandingPage onLoginClick={() => setView('AUTH')} />
      )}

      {view === 'AUTH' && (
        <AuthPage 
          onSuccess={handleLogin} 
        />
      )}
      
      {view === 'ONBOARDING' && user && (
        <OnboardingWizard 
          user={user} 
          onComplete={handleCompleteOnboarding}
          onCancel={handleLogout}
        />
      )}
      
      {view === 'DASHBOARD' && user && (
        <DashboardLayout 
          user={user} 
          setUser={setUser} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default App;