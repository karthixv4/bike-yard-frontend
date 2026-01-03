import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { X, Calendar, Wrench, User, MapPin, CheckCircle2, Clock, AlertTriangle, XCircle, History } from 'lucide-react';

const BikeHistoryModal = ({ bikeName, onClose }) => {
    const { bikeHistory, isHistoryLoading } = useSelector((state) => state.buyer);

    const getStatusIcon = (status) => {
        const s = status.toLowerCase();
        switch (s) {
            case 'completed': return <CheckCircle2 size={16} className="text-green-500" />;
            case 'pending': return <Clock size={16} className="text-yellow-500" />;
            case 'cancelled': return <XCircle size={16} className="text-neutral-500" />;
            case 'rejected': return <AlertTriangle size={16} className="text-nothing-red" />;
            default: return <Wrench size={16} className="text-blue-500" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-nothing-dark border border-nothing-gray w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
                <div className="p-6 border-b border-nothing-gray flex justify-between items-center bg-nothing-black/50">
                    <div>
                        <h2 className="text-xl font-medium tracking-tight text-nothing-white flex items-center gap-2">
                            <History size={20} className="text-nothing-red" /> Service History
                        </h2>
                        <p className="text-xs font-mono text-nothing-muted mt-1">{bikeName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-nothing-white/10 transition-colors"
                    >
                        <X size={20} className="text-nothing-muted hover:text-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                    {isHistoryLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="w-8 h-8 border-2 border-nothing-gray border-t-nothing-red rounded-full animate-spin" />
                            <p className="text-xs font-mono text-nothing-muted uppercase">Loading Records...</p>
                        </div>
                    ) : bikeHistory.length === 0 ? (
                        <div className="text-center py-12 text-nothing-muted border border-dashed border-nothing-gray rounded-2xl">
                            <History size={40} className="mx-auto mb-4 opacity-50" />
                            <p className="font-mono text-sm uppercase">No service history found.</p>
                            <p className="text-xs mt-2 opacity-70">Completed services and inspections will appear here.</p>
                        </div>
                    ) : (
                        <div className="relative pl-4 space-y-8">
                            {/* Vertical Line */}
                            <div className="absolute left-0 top-2 bottom-2 w-px bg-nothing-gray" />

                            {bikeHistory.map((item) => (
                                <div key={item.id} className="relative pl-6">
                                    {/* Dot on Line */}
                                    <div className={`absolute left-[-4px] top-1.5 w-2 h-2 rounded-full border-2 border-nothing-dark ${item.status === 'COMPLETED' ? 'bg-green-500' :
                                        item.status === 'PENDING' ? 'bg-yellow-500' : 'bg-neutral-500'
                                        }`} />

                                    <div className="bg-nothing-black/40 border border-nothing-gray rounded-xl p-4 hover:border-nothing-white/30 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-xs font-mono text-nothing-muted flex items-center gap-1">
                                                <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                            <div className="flex items-center gap-1.5 bg-nothing-white/5 px-2 py-0.5 rounded text-[10px] font-mono uppercase border border-nothing-white/10 text-nothing-white">
                                                {getStatusIcon(item.status)}
                                                {item.status}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-medium text-nothing-white mb-1">
                                            {item.type === 'SERVICE' ? (item.serviceType || 'General Service') : 'Vehicle Inspection'}
                                        </h3>

                                        <div className="space-y-2 mt-3 pt-3 border-t border-nothing-gray/50">
                                            {item.mechanic ? (
                                                <div className="flex items-center gap-2 text-sm text-nothing-muted">
                                                    <div className="w-5 h-5 rounded-full bg-nothing-white/10 flex items-center justify-center">
                                                        <User size={10} />
                                                    </div>
                                                    <span>{item.mechanic.user?.name || "Mechanic"}</span>
                                                    {item.mechanic.user?.phone && (
                                                        <span className="text-xs opacity-60">• {item.mechanic.user.phone}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-nothing-muted italic">Mechanic not assigned</div>
                                            )}

                                            {item.mechanic?.shopAddress && (
                                                <div className="flex items-center gap-2 text-xs text-nothing-muted opacity-80">
                                                    <MapPin size={12} className="ml-1" /> {item.mechanic.shopAddress}
                                                </div>
                                            )}

                                            <div className="flex justify-end mt-2">
                                                <span className="font-mono text-nothing-white">₹{item.offerAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default BikeHistoryModal;