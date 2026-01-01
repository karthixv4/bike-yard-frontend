import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay = ({ message = "GETTING THINGS READY" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-nothing-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-nothing-white"
    >
      <div className="relative w-24 h-24 mb-8">
        {/* Animated dotted circle */}
        <motion.div 
          className="absolute inset-0 border-4 border-nothing-dark rounded-full"
        />
        <motion.div 
          className="absolute inset-0 border-t-4 border-nothing-red rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner pulsing dot */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
        </motion.div>
      </div>

      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-medium tracking-tight animate-pulse">{message}</h2>
        <p className="text-xs font-mono text-nothing-gray uppercase tracking-[0.2em] animate-blink">
          Please wait...
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay;