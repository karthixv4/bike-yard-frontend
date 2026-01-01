import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';
import Button from '../common/Button';
import Input from '../common/Input';

const Login = ({ onBack, onRegister }) => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 w-full max-w-md mx-auto relative z-10">
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

        {error && (
            <div className="bg-nothing-red/10 border border-nothing-red/50 p-4 rounded-xl text-nothing-red text-sm font-mono">
                {error}
            </div>
        )}

        <div className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="pt-4 space-y-4">
          <Button fullWidth withArrow onClick={handleLogin}>
            Login
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