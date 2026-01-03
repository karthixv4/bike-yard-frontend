import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { addBikeToGarage } from '../../store/slices/buyerSlice';
import { X, Bike } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { openStatusModal } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';

const AddBikeModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    registration: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.brand || !formData.model || !formData.year) {
      dispatch(openStatusModal({ type: 'error', title: 'Missing Details', message: 'Brand, Model and Year are required' }));
      return;
    }

    dispatch(addBikeToGarage({
      brand: formData.brand,
      model: formData.model,
      year: Number(formData.year),
      registration: formData.registration
    })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-nothing-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="relative bg-nothing-dark border border-nothing-gray w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-nothing-gray flex justify-between items-center bg-nothing-black/50">
          <h2 className="text-xl font-medium tracking-tight text-nothing-white flex items-center gap-2">
            <Bike size={20} className="text-nothing-red" /> Add New Bike
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-nothing-white/10 transition-colors"
          >
            <X size={20} className="text-nothing-muted hover:text-nothing-white" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Brand" name="brand" placeholder="e.g. KTM" value={formData.brand} onChange={handleChange} />
            <Input label="Model" name="model" placeholder="e.g. Duke 390" value={formData.model} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Year" name="year" type="number" placeholder="2022" value={formData.year} onChange={handleChange} />
            <Input label="Registration No. (Optional)" name="registration" placeholder="MH 02 XX 1234" value={formData.registration} onChange={handleChange} />
          </div>

          <p className="text-xs text-nothing-muted font-mono leading-relaxed bg-nothing-black p-3 rounded-lg border border-nothing-gray">
            Adding accurate details helps us recommend the correct spare parts and allows you to book services easily.
          </p>
        </div>

        <div className="p-6 border-t border-nothing-gray bg-nothing-dark flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 rounded-full text-sm font-mono text-nothing-muted hover:text-nothing-white transition-colors uppercase tracking-wide">
            Cancel
          </button>
          <Button onClick={handleSubmit} withArrow className="py-3 px-6 text-sm">
            Save to Garage
          </Button>
        </div>

      </motion.div>
    </div>
  );
};

export default AddBikeModal;