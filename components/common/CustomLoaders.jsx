import React from 'react';
import { motion } from 'framer-motion';
import { Scan, ShoppingBag, Upload, Tag, Plus, Image as ImageIcon, ArrowUp, Fingerprint, Cloud, Database, Box, RefreshCw, UserCheck, Bike, ClipboardCheck, Lock, FileText, Trash2, Truck, MinusCircle } from 'lucide-react';

const CustomLoaders = ({ type }) => {
  if (!type) return null;

  const renderContent = () => {
    switch (type) {
      case 'inspection':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 border-2 border-nothing-red/30 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 border border-nothing-red rounded-full border-t-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <Scan size={40} className="text-nothing-red" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Requesting Mechanic</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest animate-pulse">Scanning nearby experts...</p>
            </div>
          </div>
        );

      case 'checkout':
      case 'buying-bike':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 bg-nothing-dark border border-nothing-gray rounded-2xl flex items-center justify-center overflow-hidden">
              <motion.div
                className="absolute inset-x-0 bottom-0 bg-nothing-white"
                initial={{ height: "0%" }}
                animate={{ height: "100%" }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
              />
              <ShoppingBag size={32} className="relative z-10 mix-blend-difference text-white" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Processing Order</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Securing payments...</p>
            </div>
          </div>
        );
      case 'fetching-inspection-details':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center bg-nothing-dark border border-nothing-gray rounded-2xl">
              <FileText size={32} className="text-nothing-white" />
              <motion.div
                className="absolute -bottom-2 -right-2 bg-nothing-red p-2 rounded-full border-4 border-black"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <Scan size={14} className="text-white" />
              </motion.div>
              <motion.div
                className="absolute inset-0 border-t-2 border-nothing-red rounded-2xl"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Retrieving Report</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Fetching details...</p>
            </div>
          </div>
        );
      case 'adding-to-cart':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center bg-nothing-dark border border-nothing-gray rounded-2xl">
              <ShoppingBag size={32} className="text-nothing-white" />
              <motion.div
                className="absolute -top-2 -right-2 bg-green-500 p-2 rounded-full border-4 border-black"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Plus size={14} className="text-black" strokeWidth={3} />
              </motion.div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Adding to Cart</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Updating order...</p>
            </div>
          </div>
        );

      case 'removing-from-cart':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center bg-nothing-dark border border-nothing-gray rounded-2xl">
              <ShoppingBag size={32} className="text-nothing-white opacity-50" />
              <motion.div
                className="absolute -top-2 -right-2 bg-nothing-red p-2 rounded-full border-4 border-black"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <MinusCircle size={14} className="text-white" strokeWidth={3} />
              </motion.div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Removing Item</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Updating cart...</p>
            </div>
          </div>
        );
      case 'fetching-profile':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center bg-nothing-dark border border-nothing-gray rounded-full">
              <UserCheck size={32} className="text-nothing-white" />
              <motion.div
                className="absolute inset-0 border-2 border-nothing-red rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Loading Profile</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Retrieving details...</p>
            </div>
          </div>
        );
      case 'auth':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 bg-nothing-red rounded-sm"
                  animate={{ y: [-10, 0, -10] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Authenticating</p>
          </div>
        );

      // --- NEW LOADERS ---

      case 'signing':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 border-2 border-dashed border-nothing-gray rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <Fingerprint size={40} className="text-nothing-red animate-pulse" />
              <motion.div
                className="absolute inset-0 bg-nothing-red/10 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Securing Upload</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Requesting Signature...</p>
            </div>
          </div>
        );

      case 'uploading':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <Cloud size={48} className="text-nothing-white" />
              <motion.div
                className="absolute"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -20, opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowUp size={20} className="text-nothing-red font-bold" />
              </motion.div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Uploading Images</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Sending to Cloud...</p>
            </div>
          </div>
        );

      case 'saving':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 bg-nothing-dark border border-nothing-gray rounded-xl flex items-center justify-center">
              <Database size={32} className="text-nothing-muted" />
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Finalizing Listing</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Saving Product...</p>
            </div>
          </div>
        );

      case 'fetching-inventory':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <Box size={40} className="text-nothing-white" />
              <motion.div
                className="absolute inset-0 border border-nothing-gray rounded-xl"
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-[-10px] w-12 h-1 bg-nothing-red blur-sm"
                animate={{ width: [20, 50, 20], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Syncing Inventory</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Retrieving your listings...</p>
            </div>
          </div>
        );

      case 'deleting-product':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center bg-nothing-dark border border-nothing-red/30 rounded-2xl">
              <Trash2 size={32} className="text-nothing-red" />
              <motion.div
                className="absolute inset-0 border-2 border-nothing-red rounded-2xl"
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: [0, 1, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute -top-4"
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{ y: 20, opacity: 0, scale: 0.5 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Box size={20} className="text-nothing-muted" />
              </motion.div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight text-nothing-red">Deleting Item</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Removing from inventory...</p>
            </div>
          </div>
        );

      case 'accepting-job':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center bg-nothing-dark border border-nothing-gray rounded-2xl">
              <ClipboardCheck size={32} className="text-nothing-white" />
              <motion.div
                className="absolute -top-2 -right-2 bg-nothing-red p-2 rounded-full border-4 border-black"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <Lock size={14} className="text-white" />
              </motion.div>
              <motion.div
                className="absolute inset-0 border-2 border-nothing-red rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Securing Job</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Locking request to your ID...</p>
            </div>
          </div>
        );

      case 'updating-product':
      case 'updating-profile':
      case 'updating-order':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center bg-nothing-dark border border-nothing-gray rounded-full">
              <RefreshCw size={32} className="text-nothing-white animate-spin-slow" />
              <motion.div
                className="absolute inset-0 border-2 border-nothing-red rounded-full border-r-transparent border-b-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Updating Status</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Syncing changes...</p>
            </div>
          </div>
        );
      case 'adding-bike':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <Bike size={40} className="text-nothing-white" />
              <motion.div
                className="absolute inset-0 border-2 border-dashed border-nothing-gray rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute bottom-0 right-0 p-1 bg-nothing-red rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Plus size={16} className="text-white" />
              </motion.div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Onboarding Bike</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Adding to garage...</p>
            </div>
          </div>
        );
      // Fallback loaders
      case 'listing':
      case 'category':
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center bg-nothing-dark border border-nothing-gray rounded-xl">
              <Tag size={32} className="text-nothing-white" />
              <motion.div
                className="absolute -top-2 -right-2 bg-nothing-red p-1.5 rounded-full border-4 border-black"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <Plus size={14} className="text-white" />
              </motion.div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium tracking-tight">Adding Category</h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Updating taxonomy...</p>
            </div>
          </div>
        );
      case 'image-upload':

      default:
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-nothing-gray border-t-nothing-white rounded-full animate-spin" />
            <p className="text-xs font-mono text-neutral-500 uppercase">Loading</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-nothing-black/95 backdrop-blur-md flex items-center justify-center text-white"
    >
      {renderContent()}
    </motion.div>
  );
};

export default CustomLoaders;
