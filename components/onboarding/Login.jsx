import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import Button from '../common/Button';
import Input from '../common/Input';
import DemoCredentials from '../common/DemoCredentials';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = ({ onBack, onRegister }) => {
  const dispatch = useDispatch();
  const { error: apiError, isLoading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (localError) setLocalError(null);
    if (apiError) dispatch(clearError());
  }, [email, password, dispatch]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setLocalError('Please enter your email address.');
      return false;
    }
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email format.');
      return false;
    }
    if (!password) {
      setLocalError('Password is required.');
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validateForm()) return;
    dispatch(loginUser({ email, password }));
  };

  const activeError = localError || apiError;
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 w-full max-w-md mx-auto relative z-10">

      <DemoCredentials />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-8"
      >
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-nothing-white">
            Welcome back.
          </h1>
          <p className="text-nothing-muted font-light text-lg">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Enhanced Error Display */}
        <div className="min-h-[3rem]">
          <AnimatePresence mode="wait">
            {activeError && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-nothing-red/10 border border-nothing-red/50 p-4 rounded-xl flex items-start gap-3 overflow-hidden"
              >
                <AlertCircle size={20} className="text-nothing-red shrink-0 mt-0.5" />
                <p className="text-nothing-red text-sm font-mono leading-relaxed">
                  {activeError}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={localError && !email ? 'Required' : undefined}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-nothing-white transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={localError && !password ? 'Required' : undefined}
          />
        </div>

        <div className="pt-4 space-y-4">
          <Button fullWidth withArrow onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Login'}
          </Button>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={onBack}
              className="text-sm font-mono text-nothing-muted hover:text-nothing-white transition-colors"
            >
              ← BACK
            </button>
            <button
              onClick={onRegister}
              className="text-sm font-mono text-nothing-red hover:text-nothing-white transition-colors tracking-wide uppercase"
            >
              Create Account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;