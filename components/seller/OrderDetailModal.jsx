import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderStatus, setSelectedOrder } from '../../store/slices/sellerSlice';
import { X, User, MapPin, Package, CreditCard, Truck, CheckCircle2, ShoppingBag } from 'lucide-react';
import Button from '../common/Button';

const OrderDetailModal = () => {
    const dispatch = useDispatch();
    const { selectedSale } = useSelector((state) => state.seller);

    if (!selectedSale) return null;

    const handleStatusUpdate = (status) => {
        dispatch(updateOrderStatus({ orderId: selectedSale.order.id, status }));
    };

    const getStatusColor = (status) => {
        const s = status.toLowerCase();
        switch (s) {
            case 'delivered': return 'text-green-500 border-green-500/30 bg-green-500/10';
            case 'shipped': return 'text-purple-500 border-purple-500/30 bg-purple-500/10';
            case 'cancelled': return 'text-nothing-red border-nothing-red/30 bg-nothing-red/10';
            default: return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
        }
    };

    const status = selectedSale.order.status;
    const statusNormalized = status.toLowerCase();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => dispatch(setSelectedOrder(null))}
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-nothing-dark border border-nothing-gray w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
                <button
                    onClick={() => dispatch(setSelectedOrder(null))}
                    className="absolute top-4 right-4 z-20 p-2 bg-nothing-black rounded-full hover:bg-nothing-white/20 transition-colors"
                >
                    <X size={20} className="text-nothing-muted hover:text-white" />
                </button>

                {/* Left: Item Detail */}
                <div className="w-full md:w-1/2 p-8 flex flex-col border-r border-nothing-gray bg-nothing-black/40">
                    <div className="flex items-center gap-3 mb-6">
                        <ShoppingBag size={20} className="text-nothing-red" />
                        <h2 className="text-xl font-medium tracking-tight text-nothing-white">Sold Item</h2>
                    </div>

                    <div className="flex-1 flex flex-col gap-6">
                        <div className="aspect-video bg-nothing-black rounded-2xl border border-nothing-gray flex items-center justify-center relative overflow-hidden">
                            {/* Placeholder for Product Image since API structure doesn't deeply nest it yet in the mock type, assuming it might be fetched or added later */}
                            <Package size={48} className="text-nothing-muted" strokeWidth={1} />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-medium text-nothing-white">{selectedSale.product.title}</h3>
                            <p className="text-nothing-muted font-mono text-sm uppercase">Item ID: {selectedSale.productId}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-auto">
                            <div className="p-4 bg-nothing-dark rounded-xl border border-nothing-gray">
                                <span className="text-xs font-mono text-nothing-muted uppercase block mb-1">Quantity</span>
                                <span className="text-xl font-medium text-nothing-white">{selectedSale.quantity}</span>
                            </div>
                            <div className="p-4 bg-nothing-dark rounded-xl border border-nothing-gray">
                                <span className="text-xs font-mono text-nothing-muted uppercase block mb-1">Unit Price</span>
                                <span className="text-xl font-medium text-nothing-white">₹{selectedSale.priceAtPurchase.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-nothing-gray flex justify-between items-center">
                            <span className="text-sm font-mono text-nothing-muted uppercase">Total Sale</span>
                            <span className="text-3xl font-medium text-nothing-white">₹{(selectedSale.priceAtPurchase * selectedSale.quantity).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Order Context & Buyer */}
                <div className="w-full md:w-1/2 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar">

                    {/* Header Status */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-mono text-nothing-muted uppercase">Order Reference</span>
                            <span className="text-xs font-mono text-nothing-muted">{selectedSale.order.createdAt}</span>
                        </div>
                        <h3 className="text-xl font-mono text-nothing-white mb-4 truncate" title={selectedSale.order.id}>{selectedSale.order.id}</h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono uppercase ${getStatusColor(status)}`}>
                            <span className={`w-2 h-2 rounded-full ${statusNormalized === 'delivered' ? 'bg-green-500' : 'bg-current animate-pulse'}`} />
                            {status}
                        </div>
                    </div>

                    {/* Buyer Details */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-nothing-white flex items-center gap-2">
                            <User size={16} className="text-nothing-muted" /> Buyer Details
                        </h4>
                        <div className="bg-nothing-dark border border-nothing-gray rounded-xl p-4 space-y-2">
                            <p className="text-nothing-white font-medium">{selectedSale.order.buyer.name}</p>
                            <p className="text-sm text-nothing-muted">{selectedSale.order.buyer.email}</p>
                        </div>
                    </div>

                    <div className="bg-nothing-red/5 border border-nothing-red/10 rounded-xl p-4">
                        <p className="text-xs text-nothing-muted leading-relaxed">
                            Note: Updating the status here affects the parent order. Ensure all items in the package are ready before marking as Shipped.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-8 border-t border-nothing-gray space-y-3">
                        {(statusNormalized === 'paid' || statusNormalized === 'processing') && (
                            <Button fullWidth onClick={() => handleStatusUpdate('SHIPPED')} className="bg-purple-600 hover:bg-purple-700 border-none">
                                <Truck className="mr-2" size={18} /> Mark as Shipped
                            </Button>
                        )}
                        {statusNormalized === 'shipped' && (
                            <Button fullWidth onClick={() => handleStatusUpdate('DELIVERED')} className="bg-green-600 hover:bg-green-700 border-none">
                                <CheckCircle2 className="mr-2" size={18} /> Mark as Delivered
                            </Button>
                        )}
                        {(statusNormalized === 'processing' || statusNormalized === 'paid') && (
                            <Button fullWidth variant="secondary" onClick={() => handleStatusUpdate('CANCELLED')} className="text-nothing-red border-nothing-red/30 hover:bg-nothing-red/10">
                                Cancel Order
                            </Button>
                        )}

                        {statusNormalized === 'delivered' && (
                            <div className="text-center text-xs font-mono text-green-500 uppercase tracking-widest py-3 border border-green-500/20 bg-green-500/5 rounded-full">
                                Order Completed
                            </div>
                        )}
                        {statusNormalized === 'cancelled' && (
                            <div className="text-center text-xs font-mono text-nothing-red uppercase tracking-widest py-3 border border-nothing-red/20 bg-nothing-red/5 rounded-full">
                                Order Cancelled
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderDetailModal;