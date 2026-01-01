import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  withArrow = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = "flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-nothing-red text-white rounded-full hover:bg-[#b0141b] active:scale-[0.98] px-8 py-4 text-lg shadow-lg shadow-nothing-red/20",
    secondary: "bg-transparent border border-nothing-gray text-nothing-white rounded-full hover:border-nothing-white hover:bg-white/5 active:scale-[0.98] px-8 py-4",
    icon: "p-4 rounded-full bg-nothing-gray hover:bg-neutral-700 text-white active:scale-90"
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {withArrow && <ArrowRight size={20} />}
      </span>
    </motion.button>
  );
};

export default Button;