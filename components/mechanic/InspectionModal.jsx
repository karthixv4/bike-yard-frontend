import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { closeInspectionModal, acceptInspection, rejectRequest } from '../../store/slices/mechanicSlice';
import { X, MapPin, Calendar, DollarSign, Info, ArrowLeft, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';

const REJECTION_REASONS = [
  "Offer too low",
  "Location too far",
  "Schedule conflict",
  "Lack of expertise for this model",
  "Other"
];

const InspectionModal = () => {
  const dispatch = useDispatch();
  const { requests, selectedRequestId } = useSelector((state) => state.mechanic);
  const request = requests.find(r => r.id === selectedRequestId);

  const [showRejectForm, setShowRejectForm] = useState(false);
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  if (!request) return null;

  const handleReject = () => {
    const finalReason = selectedReason === 'Other' ? customReason : selectedReason;
    dispatch(rejectRequest({ reason: finalReason }));
  };

  const handleAccept = () => {
    dispatch(acceptInspection(request.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={() => dispatch(closeInspectionModal())}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="relative bg-nothing-dark border border-nothing-gray w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-nothing-gray flex justify-between items-start bg-nothing-black/50">
          <div>
            {!showRejectForm ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-500/20 text-yellow-500 uppercase tracking-wider">New Request</span>
                </div>
                <h2 className="text-xl font-medium tracking-tight">{request.bikeModel}</h2>
                <p className="text-sm text-neutral-400 font-mono">Customer: {request.customerName}</p>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => setShowRejectForm(false)} className="p-1 rounded-full hover:bg-white/10">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-medium tracking-tight text-nothing-red">Reject Request</h2>
              </div>
            )}
          </div>
          <button
            onClick={() => dispatch(closeInspectionModal())}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-neutral-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {!showRejectForm ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-nothing-black border border-nothing-gray space-y-1">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <DollarSign size={14} />
                    <span className="text-xs font-mono uppercase tracking-widest">Offer</span>
                  </div>
                  <div className="text-xl font-medium">₹{request.offerAmount}</div>
                </div>
                <div className="p-4 rounded-2xl bg-nothing-black border border-nothing-gray space-y-1">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <Calendar size={14} />
                    <span className="text-xs font-mono uppercase tracking-widest">Posted</span>
                  </div>
                  <div className="text-xl font-medium">{request.date}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                  <MapPin className="text-nothing-red mt-1 shrink-0" size={20} />
                  <div>
                    <h4 className="text-sm font-medium">Location</h4>
                    <p className="text-neutral-400 text-sm mt-0.5">{request.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                  <Info className="text-neutral-400 mt-1 shrink-0" size={20} />
                  <div>
                    <h4 className="text-sm font-medium">Job Details</h4>
                    <p className="text-neutral-400 text-sm mt-0.5 leading-relaxed">{request.details}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex gap-3 p-4 bg-nothing-red/10 border border-nothing-red/20 rounded-xl text-nothing-red">
                <AlertTriangle size={20} className="shrink-0" />
                <p className="text-sm">Rejecting a gig might affect your mechanic score slightly if done frequently.</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-mono uppercase tracking-widest text-neutral-400">Select Reason</label>
                <div className="space-y-2">
                  {REJECTION_REASONS.map(reason => (
                    <button
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`w-full text-left p-4 rounded-xl border transition-colors ${selectedReason === reason
                          ? 'bg-nothing-white text-nothing-black border-nothing-white'
                          : 'bg-nothing-black border-nothing-gray text-neutral-400 hover:border-neutral-500'
                        }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              {selectedReason === 'Other' && (
                <div className="space-y-2">
                  <label className="text-sm font-mono uppercase tracking-widest text-neutral-400">Specify Reason</label>
                  <textarea
                    className="w-full bg-nothing-black border border-nothing-gray rounded-xl p-4 text-white outline-none focus:border-nothing-white resize-none"
                    rows={3}
                    placeholder="Please explain..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                </div>
              )}
            </motion.div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-nothing-gray bg-nothing-dark flex justify-between gap-4">
          {!showRejectForm ? (
            <>
              <button
                onClick={() => setShowRejectForm(true)}
                className="px-6 py-3 rounded-full text-sm font-mono text-nothing-red hover:bg-nothing-red/10 transition-colors uppercase tracking-wide w-full"
              >
                Decline
              </button>
              <Button onClick={handleAccept} fullWidth withArrow className="py-3 px-6 text-sm">
                Accept Job
              </Button>
            </>
          ) : (
            <Button onClick={handleReject} fullWidth className="py-3 px-6 text-sm bg-nothing-red text-white">
              Confirm Rejection
            </Button>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default InspectionModal;