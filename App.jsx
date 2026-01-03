import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { setRole, logout } from './store/slices/authSlice';
import RoleSelection from './components/onboarding/RoleSelection';
import RoleDetails from './components/onboarding/RoleDetails';
import Login from './components/onboarding/Login';
import Register from './components/onboarding/Register';
import SellerDashboard from './components/seller/SellerDashboard';
import MechanicDashboard from './components/mechanic/MechanicDashboard';
import UserDashboard from './components/user/UserDashboard';
import CustomLoaders from './components/common/CustomLoaders';
import StatusModal from './components/common/StatusModal';
import ThemeToggle from './components/common/ThemeToggle';
import LandingPage from './components/landing/LandingPage';


const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, onboarding } = useSelector((state) => state.auth);
  const { activeLoader, theme } = useSelector((state) => state.ui);

  // Local view state for navigation
  const [currentView, setCurrentView] = useState('landing');

  // Use role from Redux
  const selectedRole = onboarding.role;

  // --- THEME MANAGEMENT ---
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
      root.classList.remove('dark');
    } else {
      root.classList.remove('light-mode');
      root.classList.add('dark');
    }
  }, [theme]);

  const getProgressWidth = () => {
    if (isAuthenticated) return '100%';
    if (currentView === 'login') return '100%';
    if (currentView === 'landing') return '0%';
    // Onboarding flow: Roles -> Details -> Register
    switch (currentView) {
      case 'roles': return selectedRole ? '25%' : '5%';
      case 'details': return '50%';
      case 'register': return '75%';
      default: return '0%';
    }
  };

  const handleSelectRole = (role) => {
    dispatch(setRole(role));
  };

  const handleRoleContinue = () => {
    if (selectedRole) {
      setCurrentView('details');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setCurrentView('login');
  }

  const renderContent = () => {
    if (isAuthenticated && user) {
      if (user.role === 'seller') return <SellerDashboard />;
      if (user.role === 'mechanic') return <MechanicDashboard />;
      return <UserDashboard />;
    }

    // 2. Unauthenticated Onboarding Flow
    return (
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            <LandingPage
              onGetStarted={() => setCurrentView('roles')}
              onLogin={() => setCurrentView('login')}
            />
          </motion.div>
        )}
        {currentView === 'roles' && (
          <motion.div
            key="roles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {/* Add a specific back button for roles to landing if needed, or rely on browser back */}
            <div className="absolute top-8 left-8 z-50">
              <button onClick={() => setCurrentView('landing')} className="text-sm font-mono text-nothing-muted hover:text-white uppercase tracking-widest">
                ← Home
              </button>
            </div>
            <RoleSelection
              selectedRole={selectedRole}
              onSelectRole={handleSelectRole}
              onContinue={handleRoleContinue}
              onLogin={() => setCurrentView('login')}
            />
          </motion.div>
        )}

        {currentView === 'details' && selectedRole && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-center"
          >
            <RoleDetails
              role={selectedRole}
              onBack={() => setCurrentView('roles')}
              onContinue={() => setCurrentView('register')}
            />
          </motion.div>
        )}

        {currentView === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-center"
          >
            <Login
              onBack={() => setCurrentView('landing')}
              onRegister={() => setCurrentView('roles')} // Redirect register to role selection flow
            />
          </motion.div>
        )}

        {currentView === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-center"
          >
            <Register
              selectedRole={selectedRole}
              onBack={() => setCurrentView('details')}
              onLogin={() => setCurrentView('login')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen w-full bg-nothing-black text-nothing-white flex flex-col relative overflow-hidden font-sans selection:bg-nothing-red selection:text-white transition-colors duration-300">

      {/* GLOBAL UI OVERLAYS */}
      {!isAuthenticated && currentView !== 'landing' && <ThemeToggle />}
      <AnimatePresence>
        {activeLoader && <CustomLoaders type={activeLoader} />}
      </AnimatePresence>
      <StatusModal />

      {/* Background ambient noise/dots - Only show if not on landing page to avoid conflict with landing design */}
      {currentView !== 'landing' && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {renderContent()}
      </main>

      {/* Decorative Bottom Bar - Progress Indicator */}
      {!isAuthenticated && currentView !== 'landing' && (
        <div className="h-2 w-full bg-nothing-dark absolute bottom-0 z-50">
          <motion.div
            className="h-full bg-nothing-red"
            initial={{ width: '0%' }}
            animate={{ width: getProgressWidth() }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>
      )}
    </div>
  );
};

export default App;