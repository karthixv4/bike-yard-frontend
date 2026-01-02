import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { closeHistoryModal } from '../../store/slices/mechanicSlice';
import { X, Calendar, MapPin, User, CheckCircle2, AlertTriangle, XCircle, FileText } from 'lucide-react';

const HistoryModal = () => {
    const dispatch = useDispatch();
    const { history, historySelectedId } = useSelector((state) => state.mechanic);
    const job = history.find(r => r.id === historySelectedId);

    if (!job) return null;

    const getStatusConfig = (status) => {
        switch (status) {
            case 'completed': return { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2, label: 'Completed' };
            case 'rejected': return { color: 'text-nothing-red', bg: 'bg-nothing-red/10', border: 'border-nothing-red/20', icon: XCircle, label: 'Rejected' };
            case 'cancelled': return { color: 'text-neutral-400', bg: 'bg-neutral-500/10', border: 'border-neutral-500/20', icon: AlertTriangle, label: 'Cancelled' };
            default: return { color: 'text-white', bg: 'bg-white/10', border: 'border-white/20', icon: CheckCircle2, label: status };
        }
    };

    const statusConfig = getStatusConfig(job.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                onClick={() => dispatch(closeHistoryModal())}
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-nothing-dark border border-nothing-gray w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
                <div className="p-6 border-b border-nothing-gray bg-nothing-black/50 flex justify-between items-start">
                    <div>
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase border mb-2 ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                            <StatusIcon size={12} />
                            {statusConfig.label}
                        </div>
                        <h2 className="text-xl font-medium tracking-tight text-white">{job.bikeModel}</h2>
                    </div>
                    <button
                        onClick={() => dispatch(closeHistoryModal())}
                        className="p-2 rounded-full hover:bg-nothing-white/10 transition-colors"
                    >
                        <X size={20} className="text-neutral-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    {/* Basic Info */}
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-3 text-neutral-400">
                            <User size={16} />
                            <span>{job.customerName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-400">
                            <Calendar size={16} />
                            <span>{job.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-400">
                            <MapPin size={16} />
                            <span>{job.location}</span>
                        </div>
                    </div>

                    {/* Financials - Only if completed */}
                    {job.status === 'completed' && (
                        <div className="p-4 bg-nothing-black border border-nothing-gray rounded-xl flex justify-between items-center">
                            <span className="text-sm font-mono text-neutral-400 uppercase">Earnings</span>
                            <span className="text-xl font-medium text-white">₹{job.offerAmount}</span>
                        </div>
                    )}

                    {/* Status Specific Content */}
                    {job.status === 'completed' && job.report && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium flex items-center gap-2 text-white">
                                <FileText size={16} className="text-neutral-400" /> Report Summary
                            </h3>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                {job.report.overallComment ? (
                                    <p className="text-sm text-neutral-300 italic">"{job.report.overallComment}"</p>
                                ) : (
                                    <p className="text-xs text-neutral-500">No comments recorded.</p>
                                )}
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    {Object.entries(job.report.scores).map(([key, score]) => (
                                        <div key={key} className="flex justify-between items-center text-xs font-mono uppercase text-neutral-400">
                                            <span>{key}</span>
                                            <span className={score > 70 ? 'text-green-500' : 'text-yellow-500'}>{score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {(job.status === 'rejected' || job.status === 'cancelled') && (
                        <div className="p-4 bg-nothing-red/5 border border-nothing-red/20 rounded-xl">
                            <span className="text-xs font-mono uppercase text-nothing-red block mb-1">Reason</span>
                            <p className="text-sm text-neutral-300">{job.rejectionReason || "No reason provided."}</p>
                        </div>
                    )}

                </div>
            </motion.div>
        </div>
    );
};

export default HistoryModal;