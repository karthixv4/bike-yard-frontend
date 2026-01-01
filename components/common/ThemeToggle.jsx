import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/slices/uiSlice';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  // Default to fixed positioning if no className provided
  const containerClass = className || "fixed top-6 right-6 z-50";

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`${containerClass} group outline-none`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      <motion.div
        layout
        className={`
          flex items-center gap-2 p-1 rounded-full border backdrop-blur-md transition-colors duration-300
          ${isDark
            ? 'bg-nothing-black/50 border-nothing-gray hover:border-white'
            : 'bg-white/50 border-nothing-gray hover:border-black'
          }
        `}
      >
        {/* Toggle Pill */}
        <motion.div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center shadow-sm
            ${isDark ? 'bg-nothing-gray text-white' : 'bg-white text-black'}
          `}
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30
          }}
        >
          {isDark ? (
            <Moon size={16} strokeWidth={2} />
          ) : (
            <Sun size={16} strokeWidth={2} />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
};

export default ThemeToggle;