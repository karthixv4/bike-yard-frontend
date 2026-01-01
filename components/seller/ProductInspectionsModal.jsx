import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductInspections } from '../../store/slices/sellerSlice';
import { X, ShieldCheck, Clock, User, Wrench, AlertTriangle } from 'lucide-react';


const ProductInspectionsModal = ({ productId, productName, onClose }) => {
    const dispatch = useDispatch();
    const { inspections } = useSelector((state) => state.seller);

    useEffect(() => {
        dispatch(fetchProductInspections(productId));
    }, [dispatch, productId]);

    const getStatusStyle = (status) => {
        const normalized = status.toUpperCase();
        switch (normalized) {
            case 'COMPLETED': return 'bg-green-500';
            case 'PENDING': return 'bg-yellow-500';
            case 'REJECTED':
            case 'CANCELLED': return 'bg-nothing-red';
            default: return 'bg-blue-500';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-nothing-dark border border-nothing-gray w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
                <div className="p-6 border-b border-nothing-gray bg-nothing-black/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-medium tracking-tight text-nothing-white flex items-center gap-2">
                            <ShieldCheck className="text-nothing-red" size={20} />
                            Inspection History
                        </h2>
                        <p className="text-xs font-mono text-nothing-muted mt-1">{productName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-nothing-white/10 transition-colors"
                    >
                        <X size={20} className="text-nothing-muted hover:text-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {inspections.length === 0 ? (
                        <div className="text-center py-12 text-nothing-muted">
                            <Clock size={40} className="mx-auto mb-4 opacity-50" />
                            <p className="font-mono text-sm uppercase">No inspections requested yet.</p>
                        </div>
                    ) : (
                        inspections.map((ins) => (
                            <div key={ins.id} className="bg-nothing-black/30 border border-nothing-gray rounded-2xl p-5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${getStatusStyle(ins.status)}`} />
                                        <span className="text-sm font-mono uppercase text-nothing-white">{ins.status.replace('_', ' ')}</span>
                                    </div>
                                    <span className="text-xs font-mono text-nothing-muted">{ins.date}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-nothing-muted font-mono uppercase mb-1">Buyer</p>
                                        <div className="flex items-center gap-2 text-nothing-white">
                                            <User size={14} /> {ins.buyerName}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-nothing-muted font-mono uppercase mb-1">Mechanic</p>
                                        <div className="flex items-center gap-2 text-nothing-white">
                                            <Wrench size={14} /> {ins.mechanicName}
                                        </div>
                                    </div>
                                </div>

                                {/* Rejection Reason */}
                                {ins.status === 'REJECTED' && ins.rejectionReason && (
                                    <div className="bg-nothing-red/10 p-3 rounded-xl border border-nothing-red/20 flex gap-2 text-sm text-nothing-white">
                                        <AlertTriangle size={16} className="text-nothing-red shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-nothing-red text-xs font-mono uppercase block mb-1">Rejection Reason</span>
                                            "{ins.rejectionReason}"
                                        </div>
                                    </div>
                                )}

                                {ins.report && (
                                    <div className="bg-nothing-white/5 p-4 rounded-xl border border-nothing-gray/50">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold uppercase text-nothing-white">Report Score</span>
                                            <span className={`text-lg font-mono ${ins.report.overallScore > 75 ? 'text-green-400' : ins.report.overallScore > 50 ? 'text-yellow-400' : 'text-nothing-red'}`}>
                                                {ins.report.overallScore}/100
                                            </span>
                                        </div>
                                        <p className="text-sm text-nothing-muted italic">"{ins.report.notes}"</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ProductInspectionsModal;