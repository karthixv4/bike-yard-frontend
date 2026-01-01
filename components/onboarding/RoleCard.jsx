import React from 'react';
import { motion } from 'framer-motion';

const RoleCard = ({ 
  label,
  subLabel,
  icon: Icon,
  isSelected,
  onClick 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative overflow-hidden group cursor-pointer
        flex flex-col justify-between
        h-48 p-6 rounded-[2rem] border transition-all duration-300
        ${isSelected 
          ? 'bg-nothing-white border-nothing-white' 
          : 'bg-nothing-dark border-nothing-gray hover:border-nothing-muted'
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div className={`
          p-3 rounded-full transition-colors duration-300
          ${isSelected ? 'bg-nothing-black text-nothing-white' : 'bg-nothing-gray text-nothing-white'}
        `}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        
        {/* Custom Radio Indicator - Monochrome */}
        <div className={`
          w-6 h-6 rounded-full border flex items-center justify-center transition-colors
          ${isSelected ? 'border-nothing-black' : 'border-nothing-gray'}
        `}>
           {isSelected && (
             <motion.div 
               initial={{ scale: 0 }} 
               animate={{ scale: 1 }} 
               className="w-3 h-3 rounded-full bg-nothing-black" 
             />
           )}
        </div>
      </div>

      <div className="z-10 mt-auto">
        <h3 className={`
          text-xl font-medium tracking-tight transition-colors
          ${isSelected ? 'text-nothing-black' : 'text-nothing-white'}
        `}>
          {label}
        </h3>
        {subLabel && (
          <p className={`
            text-xs font-mono uppercase mt-2 tracking-widest
            ${isSelected ? 'text-nothing-black opacity-60' : 'text-nothing-muted'}
          `}>
            {subLabel}
          </p>
        )}
      </div>
      
      {/* Subtle shine effect for unselected cards */}
      {!isSelected && (
        <div className="absolute inset-0 bg-gradient-to-tr from-nothing-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </motion.div>
  );
};

export default RoleCard;