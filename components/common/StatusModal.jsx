import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { closeStatusModal } from '../../store/slices/uiSlice';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import Button from './Button';

const StatusModal = () => {
  const dispatch = useDispatch();
  const { isOpen, type, title, message, actionLabel } = useSelector((state) => state.ui.statusModal);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={48} className="text-green-500" />;
      case 'error': return <XCircle size={48} className="text-nothing-red" />;
      default: return <Info size={48} className="text-white" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
        case 'success': return 'border-green-500/50';
        case 'error': return 'border-nothing-red/50';
        default: return 'border-nothing-gray';
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => dispatch(closeStatusModal())}
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`relative bg-nothing-dark border ${getBorderColor()} w-full max-w-sm rounded-[2rem] p-8 shadow-2xl flex flex-col items-center text-center`}
      >
        <button 
            onClick={() => dispatch(closeStatusModal())}
            className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white transition-colors"
        >
            <X size={20} />
        </button>

        <div className="mb-6 p-4 bg-nothing-black rounded-full border border-nothing-gray">
            {getIcon()}
        </div>

        <h3 className="text-2xl font-medium tracking-tight mb-2">{title}</h3>
        <p className="text-neutral-400 font-light leading-relaxed mb-8">
            {message}
        </p>

        <Button fullWidth onClick={() => dispatch(closeStatusModal())}>
            {actionLabel || (type === 'error' ? 'Try Again' : 'Close')}
        </Button>

      </motion.div>
    </div>
  );
};

export default StatusModal;
