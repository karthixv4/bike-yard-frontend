import React from 'react';
import { motion } from 'framer-motion';
import { User, Wrench, Bike } from 'lucide-react';
import RoleCard from './RoleCard';
import Button from '../common/Button';

const roles = [
  { id: 'user', label: 'Rider', subLabel: 'Personal Garage', icon: Bike },
  { id: 'seller', label: 'Seller', subLabel: 'Business Hub', icon: User },
  { id: 'mechanic', label: 'Mechanic', subLabel: 'Service Partner', icon: Wrench },
];

const RoleSelection = ({
  selectedRole,
  onSelectRole,
  onContinue,
  onLogin
}) => {
  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Top Navigation for Login */}
      <div className="absolute top-8 right-8 md:right-20 z-20">
        <button
          onClick={onLogin}
          className="text-xs md:text-sm font-mono text-nothing-muted hover:text-nothing-white transition-colors tracking-widest uppercase border-b border-transparent hover:border-nothing-red pb-1"
        >
          Have an account? Login
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full z-10 py-24">

        <div className="mb-16 space-y-6 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-medium tracking-tighter text-nothing-white leading-[0.9]"
          >
            Identify your <br />
            <span className="text-nothing-muted">role in the yard.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-nothing-muted text-lg font-light border-l-2 border-nothing-red pl-4"
          >
            Select your profile type to customize your dashboard experience.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              id={role.id}
              label={role.label}
              subLabel={role.subLabel}
              icon={role.icon}
              isSelected={selectedRole === role.id}
              onClick={() => onSelectRole(role.id)}
            />
          ))}
        </motion.div>

        {/* Action Bar */}
        <motion.div
          className="mt-12 md:mt-20 flex justify-end items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center w-full md:w-auto">
            <div className="hidden md:block font-mono text-[10px] text-nothing-muted uppercase tracking-[0.2em]">
              {selectedRole ? 'Selection Confirmed' : 'Waiting for Input...'}
            </div>
            <Button
              onClick={onContinue}
              disabled={!selectedRole}
              fullWidth={true}
              withArrow
              className="md:w-auto px-10 py-4"
            >
              Continue
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;