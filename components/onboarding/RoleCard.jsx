import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const RoleCard = ({
  label,
  subLabel,
  icon: Icon,
  isSelected,
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative overflow-hidden cursor-pointer
        flex flex-col justify-between
        h-72 p-8 rounded-3xl border transition-all duration-500 ease-out
        group
        ${isSelected
          ? 'bg-nothing-white border-nothing-white'
          : 'bg-nothing-dark border-nothing-gray hover:border-nothing-muted'
        }
      `}
    >
      {/* Background Texture for unselected state */}
      {!isSelected && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />
      )}

      {/* Top Section: Icon and Indicator */}
      <div className="flex justify-between items-start z-10">
        <div className={`
          p-4 rounded-2xl border transition-all duration-500
          ${isSelected
            ? 'bg-nothing-black text-nothing-white border-nothing-black'
            : 'bg-nothing-black/50 text-nothing-muted border-nothing-gray group-hover:text-nothing-white group-hover:border-nothing-white'
          }
        `}>
          <Icon size={28} strokeWidth={1.5} />
        </div>

        {/* Selection Circle */}
        <div className={`
          w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500
          ${isSelected
            ? 'border-nothing-black'
            : 'border-nothing-gray group-hover:border-nothing-white'
          }
        `}>
          <motion.div
            initial={false}
            animate={{ scale: isSelected ? 1 : 0 }}
            className="w-3 h-3 rounded-full bg-nothing-black"
          />
        </div>
      </div>

      {/* Bottom Section: Text */}
      <div className="z-10 relative">
        {subLabel && (
          <p className={`
            text-xs font-mono uppercase tracking-[0.15em] mb-3 transition-colors duration-300
            ${isSelected ? 'text-nothing-black/60' : 'text-nothing-muted'}
          `}>
            {subLabel}
          </p>
        )}
        <div className="flex items-end justify-between">
          <h3 className={`
              text-3xl font-medium tracking-tight transition-colors duration-300 leading-none
              ${isSelected ? 'text-nothing-black' : 'text-nothing-white'}
            `}>
            {label}
          </h3>

          {/* Arrow that appears on selection/hover */}
          <div className={`transition-all duration-500 transform ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-50 group-hover:translate-x-0'}`}>
            <ArrowRight size={24} className={isSelected ? 'text-nothing-black' : 'text-nothing-white'} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoleCard;