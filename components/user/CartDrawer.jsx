import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { checkoutCart, removeItemFromCart, updateCartItemQty } from '../../store/slices/buyerSlice';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Button from '../common/Button';

const CartDrawer = ({ isOpen, onClose, onItemClick }) => {
    const dispatch = useDispatch();
    const { cart, isCartLoading } = useSelector((state) => state.buyer);
    console.log("Cart", cart);
    // Calculate total using server cart data (accessing nested product)
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const handleCheckout = () => {
        dispatch(checkoutCart()).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                onClose();
            }
        });
    };

    const handleRemove = (e, id) => {
        e.stopPropagation();
        dispatch(removeItemFromCart(id));
    };

    const handleQuantityUpdate = (e, id, newQty, maxStock) => {
        e.stopPropagation();
        // Optimistic check, backend will also validate
        if (maxStock !== undefined && newQty > maxStock) return;

        if (newQty < 1) return;
        dispatch(updateCartItemQty({ id, quantity: newQty }));
    };

    if (!isOpen) return null;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-nothing-black/80 z-50 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-nothing-dark border-l border-nothing-gray z-50 flex flex-col shadow-2xl"
            >
                <div className="p-6 border-b border-nothing-gray flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={20} className="text-nothing-red" />
                        <h2 className="text-xl font-medium tracking-tight text-nothing-white">Your Cart</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-nothing-white/10 rounded-full transition-colors">
                        <X size={20} className="text-nothing-muted hover:text-nothing-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {isCartLoading && cart.length === 0 ? (
                        <div className="flex justify-center p-8">
                            <div className="w-8 h-8 border-2 border-nothing-gray border-t-nothing-red rounded-full animate-spin" />
                        </div>
                    ) : cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-nothing-muted">
                            <ShoppingBag size={48} strokeWidth={1} />
                            <p className="font-mono text-sm uppercase tracking-widest">Cart is empty</p>
                        </div>
                    ) : (
                        cart.map(item => {
                            const isBike = item.product.type.toLowerCase() === 'bike';
                            const stock = item.product.stock;
                            // Reconstruct a flat product object for the detail modal to consume
                            const flattenedProduct = {
                                ...item.product,
                                name: item.product.title, // Map title back to name for components
                                images: item.product.images
                            };

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => onItemClick && onItemClick(flattenedProduct)}
                                    className="flex gap-4 items-center bg-nothing-black/20 p-4 rounded-xl border border-nothing-gray cursor-pointer hover:border-nothing-white/30 transition-colors group"
                                >
                                    <div className="w-16 h-16 bg-nothing-white/5 rounded-lg flex items-center justify-center shrink-0 border border-nothing-gray overflow-hidden">
                                        {item.product.images && item.product.images.length > 0 ? (
                                            <img src={item.product.images[0].url} alt={item.product.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-nothing-gray" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm truncate text-nothing-white">{item.product.title}</h3>
                                        <p className="text-xs font-mono text-nothing-muted mt-1">₹{item.product.price.toLocaleString()}</p>
                                        {stock !== undefined && stock <= 5 && !isBike && (
                                            <p className="text-[10px] font-mono text-nothing-red mt-1">Only {stock} left</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            onClick={(e) => handleRemove(e, item.id)}
                                            title='Remove item'
                                            className="p-1.5 text-nothing-muted hover:text-nothing-red transition-colors rounded-full hover:bg-nothing-red/10"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        {!isBike ? (
                                            <div className="flex items-center gap-2 bg-nothing-black rounded-lg border border-nothing-gray p-1" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={(e) => handleQuantityUpdate(e, item.id, item.quantity - 1, stock)}
                                                    className="w-6 h-6 flex items-center justify-center text-nothing-white hover:bg-white/10 rounded"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="text-xs font-mono w-4 text-center text-nothing-white">{item.quantity}</span>
                                                <button
                                                    onClick={(e) => handleQuantityUpdate(e, item.id, item.quantity + 1, stock)}
                                                    className="w-6 h-6 flex items-center justify-center text-nothing-white hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                                                    disabled={stock !== undefined && item.quantity >= stock}
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-mono text-nothing-muted px-2">x{item.quantity}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-nothing-gray bg-nothing-black/50 space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-mono text-nothing-muted uppercase tracking-widest">Total</span>
                            <span className="text-2xl font-medium text-nothing-white">₹{total.toLocaleString()}</span>
                        </div>
                        <Button onClick={handleCheckout} fullWidth withArrow>
                            Checkout
                        </Button>
                    </div>
                )}
            </motion.div>
        </>
    );
};

export default CartDrawer;