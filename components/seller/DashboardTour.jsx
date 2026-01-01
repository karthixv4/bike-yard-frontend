import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { nextTourStep, closeTour, addSampleData } from '../../store/slices/sellerSlice';
import Button from '../common/Button';
import { X, TrendingUp, Package, DollarSign } from 'lucide-react';

const steps = [
  {
    title: "Welcome to Your Dashboard",
    description: "This is your command center. Track your business performance, manage inventory, and handle orders all in one place.",
    icon: null
  },
  {
    title: "Track Your Analytics",
    description: "Keep an eye on revenue, total orders, and product views. Real-time data to help you grow.",
    icon: TrendingUp
  },
  {
    title: "Manage Inventory",
    description: "Add new bikes or parts, update stock levels, and manage pricing effortlessly.",
    icon: Package
  },
  {
    title: "Start Selling",
    description: "You're all set! We've added a sample product so you can see how the dashboard looks.",
    icon: DollarSign
  }
];

const DashboardTour = () => {
  const dispatch = useDispatch();
  const { tourStep } = useSelector((state) => state.seller);
  const currentStep = steps[tourStep];

  const handleNext = () => {
    if (tourStep === steps.length - 1) {
      dispatch(addSampleData());
      dispatch(closeTour());
    } else {
      dispatch(nextTourStep());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => dispatch(closeTour())}
      />

      {/* Modal */}
      <motion.div 
        key={tourStep}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-nothing-dark border border-nothing-gray w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-hidden"
      >
        {/* Decorative Grid Background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'linear-gradient(#262626 1px, transparent 1px), linear-gradient(90deg, #262626 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />

        <button 
          onClick={() => dispatch(closeTour())}
          className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-nothing-black border border-nothing-gray flex items-center justify-center mb-2">
            {currentStep.icon ? (
              <currentStep.icon size={32} className="text-nothing-red" />
            ) : (
              <span className="font-mono text-2xl text-nothing-white">{(tourStep + 1).toString().padStart(2, '0')}</span>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-medium tracking-tight">{currentStep.title}</h2>
            <p className="text-neutral-400 font-light leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2 py-4">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === tourStep ? 'w-8 bg-nothing-red' : 'w-2 bg-nothing-gray'
                }`}
              />
            ))}
          </div>

          <Button onClick={handleNext} withArrow fullWidth>
            {tourStep === steps.length - 1 ? 'Finish Tour' : 'Next Step'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardTour;