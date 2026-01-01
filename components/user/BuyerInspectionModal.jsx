import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, MapPin, User, ShieldCheck, FileText, Wrench, AlertCircle, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedInspection, cancelInspection } from '../../store/slices/buyerSlice';
import Button from '../common/Button';

const BuyerInspectionModal = () => {
    const dispatch = useDispatch();
    const { selectedInspection } = useSelector((state) => state.buyer);

    if (!selectedInspection) return null;

    const { id, product, mechanic, status, reportData, offerAmount, scheduledDate, buyer } = selectedInspection;

    const getStatusColor = (s) => {
        switch (s) {
            case 'COMPLETED': return 'text-green-500 border-green-500/30 bg-green-500/10';
            case 'ACCEPTED': return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
            case 'REJECTED': return 'text-nothing-red border-nothing-red/30 bg-nothing-red/10';
            case 'CANCELLED': return 'text-neutral-500 border-neutral-500/30 bg-neutral-500/10';
            default: return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
        }
    };

    const statusLabel = status.replace('_', ' ');

    const handleCancel = () => {
        dispatch(cancelInspection(id));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => dispatch(clearSelectedInspection())}
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-nothing-dark border border-nothing-gray w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <button
                    onClick={() => dispatch(clearSelectedInspection())}
                    className="absolute top-4 right-4 z-20 p-2 bg-nothing-black rounded-full hover:bg-nothing-white/20 transition-colors"
                >
                    <X size={20} className="text-nothing-muted hover:text-white" />
                </button>

                {/* Header with Product Info */}
                <div className="p-8 border-b border-nothing-gray bg-nothing-black/50">
                    <div className="flex gap-4">
                        <div className="w-20 h-20 bg-neutral-900 rounded-2xl border border-nothing-gray overflow-hidden shrink-0 flex items-center justify-center">
                            {product?.images?.[0]?.url ? (
                                <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                                <ShieldCheck size={32} className="text-nothing-muted" />
                            )}
                        </div>
                        <div>
                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase border mb-2 ${getStatusColor(status)}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${status === 'COMPLETED' ? 'bg-green-500' : status === 'CANCELLED' ? 'bg-neutral-500' : 'bg-current animate-pulse'}`} />
                                {statusLabel}
                            </div>
                            <h2 className="text-xl font-medium text-nothing-white leading-tight">{product?.title || 'Inspection Details'}</h2>
                            <div className="flex items-center gap-4 text-sm text-nothing-muted mt-2 font-mono">
                                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(scheduledDate).toLocaleDateString()}</span>
                                <span>Offer: ₹{offerAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">

                    {/* Report Section - Only if Completed */}
                    {status === 'COMPLETED' && reportData && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-lg font-medium text-nothing-white flex items-center gap-2">
                                <FileText className="text-nothing-red" size={20} /> Inspection Report
                            </h3>

                            <div className="bg-nothing-black/40 border border-nothing-gray rounded-2xl p-6 space-y-6">
                                {reportData.overallComment && (
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 italic text-nothing-muted text-sm">
                                        "{reportData.overallComment}"
                                    </div>
                                )}

                                {reportData.scores && (
                                    <div className="space-y-4">
                                        {Object.entries(reportData.scores).map(([key, score]) => (
                                            <div key={key} className="space-y-1">
                                                <div className="flex justify-between text-xs font-mono uppercase text-nothing-muted">
                                                    <span>{key}</span>
                                                    <span className={Number(score) > 75 ? 'text-green-500' : Number(score) > 50 ? 'text-yellow-500' : 'text-red-500'}>
                                                        {String(score)}/100
                                                    </span>
                                                </div>
                                                <div className="h-1.5 bg-nothing-dark rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${score}%` }}
                                                        transition={{ duration: 1, ease: "circOut" }}
                                                        className={`h-full rounded-full ${Number(score) > 75 ? 'bg-green-500' : Number(score) > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mechanic & Seller Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Mechanic Info */}
                        <div className="bg-nothing-black/20 border border-nothing-gray rounded-2xl p-5 space-y-3">
                            <h4 className="text-sm font-mono uppercase text-nothing-muted flex items-center gap-2">
                                <Wrench size={14} /> Assigned Mechanic
                            </h4>
                            {mechanic ? (
                                <div>
                                    <p className="text-nothing-white font-medium">{mechanic.user?.name || "Mechanic Assigned"}</p>
                                    {mechanic.shopAddress && (
                                        <p className="text-xs text-nothing-muted mt-1 flex items-start gap-1">
                                            <MapPin size={12} className="mt-0.5 shrink-0" /> {mechanic.shopAddress}
                                        </p>
                                    )}
                                    {mechanic.experienceYears && (
                                        <div className="mt-3 inline-block px-2 py-1 bg-white/5 rounded text-[10px] text-nothing-muted border border-white/10">
                                            {mechanic.experienceYears} Years Exp.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4 text-center">
                                    <Clock size={24} className="text-nothing-gray mb-2" />
                                    <p className="text-xs text-nothing-muted">
                                        {status === 'CANCELLED' ? 'Request Cancelled' : 'Waiting for mechanic...'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Seller Info */}
                        <div className="bg-nothing-black/20 border border-nothing-gray rounded-2xl p-5 space-y-3">
                            <h4 className="text-sm font-mono uppercase text-nothing-muted flex items-center gap-2">
                                <User size={14} /> Seller
                            </h4>
                            <div>
                                <p className="text-nothing-white font-medium">{product?.seller?.businessName || "Private Seller"}</p>
                                {product?.seller?.isVerified && (
                                    <div className="mt-2 flex items-center gap-1 text-[10px] text-green-500 font-mono uppercase">
                                        <CheckCircle2 size={12} /> Verified Business
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {status === 'PENDING' && (
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                                <AlertCircle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-500/80 leading-relaxed">
                                    Your request has been broadcasted to nearby mechanics. You will be notified once a mechanic accepts your offer.
                                </p>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-nothing-gray">
                                <Button variant="secondary" onClick={handleCancel} className="text-nothing-red border-nothing-red/30 hover:bg-nothing-red/10 text-xs px-4 py-2">
                                    <Trash2 size={14} className="mr-2" /> Cancel Request
                                </Button>
                            </div>
                        </div>
                    )}

                    {status === 'CANCELLED' && (
                        <div className="flex items-start gap-3 p-4 bg-nothing-white/5 border border-nothing-gray rounded-xl">
                            <AlertCircle size={20} className="text-nothing-muted shrink-0 mt-0.5" />
                            <p className="text-xs text-nothing-muted leading-relaxed">
                                This inspection request has been cancelled. You can place a new request from the bike details page.
                            </p>
                        </div>
                    )}

                </div>

            </motion.div>
        </div>
    );
};

export default BuyerInspectionModal;