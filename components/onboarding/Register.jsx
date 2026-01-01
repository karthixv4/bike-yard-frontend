import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/authSlice';
import Button from '../common/Button';
import Input from '../common/Input';

const Register = ({ selectedRole, onBack, onLogin }) => {
  const dispatch = useDispatch();
  const { onboarding, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    // Collect all data: role, detailed info, and basic credentials
    const completeData = {
      ...form,
      role: selectedRole,
      roleDetails: onboarding.details
    };

    dispatch(registerUser(completeData));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 w-full max-w-md mx-auto relative z-10">
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

        {error && (
          <div className="bg-nothing-red/10 border border-nothing-red/50 p-4 rounded-xl text-nothing-red text-sm font-mono">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
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
            placeholder="Create a password"
          />
        </div>

        <div className="pt-4 space-y-4">
          <Button fullWidth withArrow onClick={handleRegister}>
            Sign Up
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