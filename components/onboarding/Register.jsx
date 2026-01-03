import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../store/slices/authSlice';
import Button from '../common/Button';
import Input from '../common/Input';
import DemoCredentials from '../common/DemoCredentials';
import { AlertCircle } from 'lucide-react';

const Register = ({ selectedRole, onBack, onLogin }) => {
  const dispatch = useDispatch();
  const { onboarding, error: apiError, isLoading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (localError) setLocalError(null);
    if (apiError) dispatch(clearError());
  }, [form, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setLocalError('Please enter your full name.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setLocalError('Please enter a valid email address.');
      return false;
    }

    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return false;
    }

    return true;
  };

  const handleRegister = () => {
    if (!validateForm()) return;

    // Collect all data: role, detailed info, and basic credentials
    const completeData = {
      ...form,
      role: selectedRole,
      roleDetails: onboarding.details
    };

    // Dispatch async action
    // @ts-ignore
    dispatch(registerUser(completeData));
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
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-nothing-white">
              Create account.
            </h1>
          </div>
          <p className="text-nothing-muted font-light text-lg">
            {selectedRole
              ? `Joining as a ${selectedRole}.`
              : 'Join our community today.'}
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Jane"
            />
            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Doe"
            />
          </div>
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Min 6 chars"
          />
        </div>

        <div className="pt-4 space-y-4">
          <Button fullWidth withArrow onClick={handleRegister} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={onBack}
              className="text-sm font-mono text-nothing-muted hover:text-nothing-white transition-colors uppercase tracking-widest"
            >
              ← Back
            </button>
            <button
              onClick={onLogin}
              className="text-sm font-mono text-nothing-red hover:text-nothing-white transition-colors tracking-wide uppercase"
            >
              I have an account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;