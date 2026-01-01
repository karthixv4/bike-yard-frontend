import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBuyerOrder, cancelBuyerOrder } from '../../store/slices/buyerSlice';
import { X, Package, Truck, CheckCircle2, Clock, MapPin, AlertTriangle, Bike, Wrench } from 'lucide-react';
import Button from '../common/Button';

// Timeline Component (Reusable logic but local for isolation)
const OrderTimeline = ({ status, createdAt }) => {
    const steps = ['processing', 'shipped', 'out_for_delivery', 'delivered'];
    const normalizedStatus = status.toLowerCase();
    const currentStepIndex = steps.indexOf(normalizedStatus);

    if (normalizedStatus === 'paid') return (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500">
            <CheckCircle2 size={20} />
            <div>
                <p className="font-medium text-sm">Order Confirmed</p>
                <p className="text-xs opacity-80">We've received your order and are processing it.</p>
            </div>
        </div>
    );

    if (normalizedStatus === 'cancelled') return (
        <div className="flex items-center gap-3 p-4 bg-nothing-red/10 border border-nothing-red/20 rounded-xl text-nothing-red">
            <AlertTriangle size={20} />
            <div>
                <p className="font-medium text-sm">Order Cancelled</p>
                <p className="text-xs opacity-80">This order has been cancelled and refunded if applicable.</p>
            </div>
        </div>
    );

    return (
        <div className="py-4">
            <div className="flex justify-between relative px-4">
                <div className="absolute top-3 left-4 right-4 h-0.5 bg-nothing-gray -z-0" />
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isActive = index === currentStepIndex;

                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 bg-nothing-dark
                                ${isCompleted ? 'border-green-500 text-green-500' : 'border-nothing-gray text-nothing-gray'}
                                ${isActive ? 'bg-green-500 border-green-500 text-black' : ''}
                             `}>
                                {isCompleted && !isActive && <CheckCircle2 size={14} />}
                                {isActive && <div className="w-2 h-2 bg-black rounded-full animate-pulse" />}
                                {!isCompleted && !isActive && <div className="w-2 h-2 rounded-full bg-current" />}
                            </div>
                            <span className={`text-[10px] font-mono uppercase tracking-widest ${isCompleted ? 'text-nothing-white' : 'text-nothing-muted'}`}>
                                {step.replace(/_/g, ' ')}
                            </span>
                        </div>
                    );
                })}
            </div>
            <p className="text-center text-xs text-nothing-muted font-mono mt-4">
                Latest Update: {new Date(createdAt).toLocaleDateString()}
            </p>
        </div>
    );
};

const BuyerOrderModal = ({ onCancelClick }) => {
    const dispatch = useDispatch();
    const { selectedOrder } = useSelector((state) => state.buyer);

    if (!selectedOrder) return null;

    const handleCancel = () => {
        onCancelClick(selectedOrder.id);
    };

    const isCancellable = ['paid', 'processing', 'pending'].includes(selectedOrder.status.toLowerCase());

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                onClick={() => dispatch(setSelectedBuyerOrder(null))}
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-nothing-dark border border-nothing-gray w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-nothing-gray flex justify-between items-center bg-nothing-black/50">
                    <div>
                        <h2 className="text-xl font-medium tracking-tight text-nothing-white flex items-center gap-2">
                            <Package className="text-nothing-red" size={20} />
                            Order Details
                        </h2>
                        <p className="text-xs font-mono text-nothing-muted mt-1">#{selectedOrder.id}</p>
                    </div>
                    <button
                        onClick={() => dispatch(setSelectedBuyerOrder(null))}
                        className="p-2 rounded-full hover:bg-nothing-white/10 transition-colors"
                    >
                        <X size={20} className="text-nothing-muted hover:text-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">

                    {/* Timeline */}
                    <OrderTimeline status={selectedOrder.status} createdAt={selectedOrder.createdAt} />

                    {/* Items List */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-nothing-white uppercase tracking-widest font-mono border-b border-nothing-gray pb-2">
                            Items
                        </h3>
                        {selectedOrder.items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 bg-nothing-black/30 rounded-2xl border border-nothing-gray">
                                <div className="w-20 h-20 bg-nothing-white/5 rounded-xl border border-nothing-gray overflow-hidden flex items-center justify-center shrink-0">
                                    {item.product.images && item.product.images.length > 0 ? (
                                        <img src={item.product.images[0].url} alt={item.product.title} className="w-full h-full object-cover" />
                                    ) : (
                                        item.product.type === 'BIKE' ? <Bike size={24} className="text-nothing-muted" /> : <Wrench size={24} className="text-nothing-muted" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium text-nothing-white truncate pr-2">{item.product.title}</h4>
                                            <span className="font-mono text-sm text-nothing-white">₹{item.priceAtPurchase.toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-nothing-muted font-mono mt-1 uppercase">
                                            {item.product.type === 'BIKE'
                                                ? `${item.product.year ?? '2024'} • ${item.product.kmDriven ?? '15,000'} KM`
                                                : `Qty: ${item.quantity ?? '1'}`}
                                        </p>
                                    </div>

                                    {item.product.type === 'BIKE' && (
                                        <div className="flex gap-2 mt-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-nothing-gray text-nothing-muted uppercase">
                                                {item.product.condition || 'Used'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-nothing-white uppercase tracking-widest font-mono border-b border-nothing-gray pb-2">
                                Payment Info
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-nothing-muted">
                                    <span>Payment ID</span>
                                    <span className="font-mono text-nothing-white">{selectedOrder.paymentId}</span>
                                </div>
                                <div className="flex justify-between text-nothing-muted">
                                    <span>Method</span>
                                    <span className="font-mono text-nothing-white">Online Payment</span>
                                </div>
                                <div className="flex justify-between text-nothing-muted">
                                    <span>Date</span>
                                    <span className="font-mono text-nothing-white">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-nothing-white uppercase tracking-widest font-mono border-b border-nothing-gray pb-2">
                                Summary
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-nothing-muted">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-nothing-white">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-nothing-muted">
                                    <span>Shipping</span>
                                    <span className="font-mono text-green-500">Free</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-nothing-gray mt-2">
                                    <span className="font-medium text-nothing-white">Total</span>
                                    <span className="text-xl font-medium text-nothing-white">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                {isCancellable && (
                    <div className="p-6 border-t border-nothing-gray bg-nothing-dark flex justify-end">
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                            className="text-nothing-red border-nothing-red/30 hover:bg-nothing-red/10 text-sm"
                        >
                            Cancel Order
                        </Button>
                    </div>
                )}

            </motion.div>
        </div>
    );
};

export default BuyerOrderModal;