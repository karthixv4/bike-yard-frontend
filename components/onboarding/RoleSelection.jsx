import React from 'react';
import { motion } from 'framer-motion';
import { User, Wrench, Bike } from 'lucide-react';
import RoleCard from './RoleCard';
import Button from '../common/Button';

const roles = [
  { id: 'user', label: 'Rider', subLabel: 'BUY & INSPECT', icon: Bike },
  { id: 'seller', label: 'Seller', subLabel: 'LIST INVENTORY', icon: User },
  { id: 'mechanic', label: 'Mechanic', subLabel: 'OFFER SERVICES', icon: Wrench },
];

const RoleSelection = ({ 
  selectedRole, 
  onSelectRole, 
  onContinue,
  onLogin
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Top Navigation for Login - Shifted left to make room for Theme Toggle */}
      <div className="absolute top-8 right-20 z-20">
        <button 
          onClick={onLogin}
          className="text-sm font-mono text-nothing-muted hover:text-nothing-white transition-colors tracking-widest uppercase"
        >
          Have an account? Login
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full z-10 pb-20 pt-20">
        
        <div className="mb-12 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-medium tracking-tighter text-nothing-white"
          >
            Tell us what you do?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-nothing-muted text-lg md:text-xl max-w-md font-light"
          >
            To give you the best experience we need to know your role.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
          className="mt-16 flex justify-end items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex gap-4 items-center w-full md:w-auto">
             <div className="hidden md:block font-mono text-xs text-nothing-muted mr-4">
               {selectedRole ? 'STEP 1 COMPLETE' : 'SELECT AN OPTION'}
             </div>
             <Button 
               onClick={onContinue} 
               disabled={!selectedRole}
               fullWidth={true}
               withArrow
               className="md:w-auto"
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