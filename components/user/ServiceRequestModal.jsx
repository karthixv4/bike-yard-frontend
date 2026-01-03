import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { requestService } from '../../store/slices/buyerSlice';
import { openStatusModal } from '../../store/slices/uiSlice';
import { X, Wrench, Calendar, DollarSign, PenTool, Check } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useDispatch } from 'react-redux';


const SERVICE_TYPES = [
    "General Service & Oil Change",
    "Water Wash & Polish",
    "Chain Cleaning & Lube",
    "Brake Pad Replacement",
    "Engine Tuning / Repair",
    "Accidental Repair",
    "Tyre Puncture / Change"
];

const ServiceRequestModal = ({ bikeId, bikeName, onClose }) => {
    const dispatch = useDispatch();

    const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
    const [offerAmount, setOfferAmount] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [message, setMessage] = useState('');

    // Calculate minimum date (Tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const handleSubmit = () => {
        if (!offerAmount) {
            dispatch(openStatusModal({ type: 'error', title: 'Missing Offer', message: 'Please enter an offer amount.' }));
            return;
        }
        if (!scheduledDate) {
            dispatch(openStatusModal({ type: 'error', title: 'Select Date', message: 'Please select a preferred service date.' }));
            return;
        }

        dispatch(requestService({
            userBikeId: bikeId,
            serviceType,
            offerAmount: Number(offerAmount),
            scheduledDate,
            message
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
                className="relative bg-nothing-dark border border-nothing-gray w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="p-6 border-b border-nothing-gray flex justify-between items-center bg-nothing-black/50">
                    <div>
                        <h2 className="text-xl font-medium tracking-tight text-nothing-white flex items-center gap-2">
                            <Wrench size={20} className="text-nothing-red" /> Request Service
                        </h2>
                        <p className="text-xs font-mono text-nothing-muted mt-1">{bikeName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-nothing-white/10 transition-colors"
                    >
                        <X size={20} className="text-nothing-muted hover:text-nothing-white" />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

                    {/* Service Type Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-mono uppercase text-nothing-muted tracking-widest ml-1">Select Service Type</label>
                        <div className="grid grid-cols-1 gap-2">
                            {SERVICE_TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setServiceType(type)}
                                    className={`
                                text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center justify-between
                                ${serviceType === type
                                            ? 'bg-nothing-white text-nothing-black border-nothing-white'
                                            : 'bg-nothing-black border-nothing-gray text-nothing-muted hover:border-nothing-white/50 hover:text-nothing-white'
                                        }
                            `}
                                >
                                    {type}
                                    {serviceType === type && <Check size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Preferred Date"
                            type="date"
                            min={minDate}
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="text-sm"
                        />
                        <Input
                            label="Offer Amount (₹)"
                            placeholder="e.g. 2500"
                            type="number"
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                            className="text-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-mono uppercase tracking-widest text-nothing-muted">Additional Instructions</label>
                        <textarea
                            rows={2}
                            className="w-full bg-nothing-dark border border-nothing-gray rounded-xl p-3 text-sm text-nothing-white focus:border-nothing-white transition-colors outline-none resize-none placeholder-nothing-muted"
                            placeholder="e.g. Please use Motul 7100 oil, fix loose mirror..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-nothing-black border border-nothing-gray rounded-xl">
                        <PenTool size={16} className="text-nothing-muted shrink-0 mt-0.5" />
                        <p className="text-xs text-nothing-muted leading-relaxed">
                            A mechanic will accept your request based on the service type and offer. Payment is handled after service completion.
                        </p>
                    </div>
                </div>

                <div className="p-6 border-t border-nothing-gray bg-nothing-dark flex justify-end gap-4">
                    <Button onClick={handleSubmit} withArrow fullWidth className="py-3 px-6 text-sm">
                        Post Request
                    </Button>
                </div>

            </motion.div>
        </div>
    );
};

export default ServiceRequestModal;