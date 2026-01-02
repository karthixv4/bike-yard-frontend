import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addMechanicCartItem, updateMechanicCartQty, removeMechanicCartItem } from '../../store/slices/mechanicSlice';
import { X, Wrench, ShoppingBag, Truck, ShieldCheck, Minus, Plus, Trash2, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import { openStatusModal } from '../../store/slices/uiSlice';

const MechanicPartDetailModal = ({ part, onClose }) => {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.mechanic);
    const inCart = cart.find(item => item.productId === part.id);

    const stock = part.stock;
    const isOutOfStock = stock === 0;
    const isLowStock = stock !== undefined && stock > 0 && stock <= 5;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        dispatch(addMechanicCartItem({ productId: part.id, quantity: 1 }));
    };

    const handleUpdateQuantity = (newQty) => {
        if (inCart) {
            if (stock !== undefined && newQty > stock) {
                dispatch(openStatusModal({
                    type: 'error',
                    title: 'Stock Limit',
                    message: `Only ${stock} items available in stock.`
                }));
                return;
            }
            dispatch(updateMechanicCartQty({ id: inCart.id, quantity: newQty }));
        }
    };

    const handleRemove = () => {
        if (inCart) {
            dispatch(removeMechanicCartItem(inCart.id));
        }
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
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-nothing-dark border border-nothing-gray w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md"
                >
                    <X size={20} className="text-white" />
                </button>

                {/* Left: Image Placeholder */}
                <div className="w-full md:w-2/5 bg-neutral-900 relative min-h-[200px] md:min-h-full p-8 flex flex-col items-center justify-center border-r border-nothing-gray overflow-hidden">
                    {part.images && part.images.length > 0 ? (
                        <img src={part.images[0].url} alt={part.name} className="w-full h-full object-cover" />
                    ) : (
                        <Wrench size={80} className="text-neutral-700" strokeWidth={1} />
                    )}

                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="bg-nothing-red text-white px-4 py-2 font-mono text-sm uppercase tracking-widest -rotate-12 border-2 border-white">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-3/5 flex flex-col bg-nothing-dark p-8">
                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-mono border border-nothing-gray px-2 py-1 rounded text-nothing-muted uppercase">{part.category}</span>
                                {isLowStock && (
                                    <span className="text-[10px] font-mono text-nothing-red flex items-center gap-1 bg-nothing-red/10 px-2 py-1 rounded border border-nothing-red/20">
                                        <AlertTriangle size={10} /> Only {stock} Left
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-medium tracking-tight mt-3 text-nothing-white">{part.name}</h2>
                            <p className="text-xl font-mono text-nothing-white mt-1">₹{part.price.toLocaleString()}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="text-green-500 shrink-0" size={20} />
                                <div>
                                    <h4 className="text-sm font-medium text-nothing-white">Genuine Part</h4>
                                    <p className="text-xs text-nothing-muted">Verified Supplier.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Truck className="text-nothing-white shrink-0" size={20} />
                                <div>
                                    <h4 className="text-sm font-medium text-nothing-white">B2B Delivery</h4>
                                    <p className="text-xs text-nothing-muted">Priority shipping for partners.</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-nothing-gray pt-4">
                            <p className="text-sm text-nothing-muted leading-relaxed">
                                Professional grade component. Ensure fitment before ordering.
                                Bulk pricing applied automatically at checkout.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        {inCart ? (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between bg-nothing-black rounded-full border border-nothing-gray p-1">
                                    <button
                                        onClick={() => handleUpdateQuantity(inCart.quantity - 1)}
                                        className="w-10 h-10 flex items-center justify-center text-nothing-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
                                        disabled={inCart.quantity <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-mono text-lg text-nothing-white w-8 text-center">{inCart.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(inCart.quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-nothing-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
                                        disabled={stock !== undefined && inCart.quantity >= stock}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <Button
                                    fullWidth
                                    onClick={handleRemove}
                                    variant="secondary"
                                    className="text-nothing-red border-nothing-red/30 hover:bg-nothing-red/10"
                                >
                                    <span className="flex items-center gap-2">
                                        Remove <Trash2 size={18} />
                                    </span>
                                </Button>
                            </div>
                        ) : (
                            <Button
                                fullWidth
                                onClick={handleAddToCart}
                                variant={isOutOfStock ? 'secondary' : 'primary'}
                                disabled={isOutOfStock}
                                className={isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                                <span className="flex items-center gap-2">
                                    {isOutOfStock ? 'Out of Stock' : (
                                        <>Add to Cart <ShoppingBag size={18} /></>
                                    )}
                                </span>
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MechanicPartDetailModal;