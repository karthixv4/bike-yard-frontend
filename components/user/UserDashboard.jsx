import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart, fetchDashboardData, fetchBuyerInspections, fetchInspectionDetail, fetchBuyerOrders, fetchCart, cancelBuyerOrder, setSelectedBuyerOrder, fetchGarage } from '../../store/slices/buyerSlice';
import Navbar from '../common/Navbar';
import BikeDetailModal from './BikeDetailModal';
import PartDetailModal from './PartDetailModal';
import CartDrawer from './CartDrawer';
import UserProfile from './UserProfile';
import AddBikeModal from './AddBikeModal';
import ServiceRequestModal from './ServiceRequestModal';
import WelcomeFeatureModal from '../common/WelcomeFeatureModal';
import BuyerInspectionModal from './BuyerInspectionModal';
import BuyerOrderModal from './BuyerOrderModal';

import { openStatusModal } from '../../store/slices/uiSlice';

import {
    ShoppingBag,
    Bike,
    Search,
    ArrowRight,
    Package,
    Clock,
    CheckCircle2,
    Wrench,
    Plus,
    Check,
    Filter,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Hourglass,
    XCircle,
    AlertTriangle,
    Zap
} from 'lucide-react';
import Footer from '../common/Footer';


const BIKE_FILTERS = ["All", "Cruiser", "Sports", "Retro", "Under 2L"];

const PartCard = ({ part, inCartQty, onAdd, onClick }) => {
    const isOutOfStock = part.stock === 0;
    const isLowStock = part.stock !== undefined && part.stock > 0 && part.stock <= 5;

    return (
        <motion.div
            layoutId={`part-${part.id}`}
            onClick={onClick}
            className="bg-nothing-dark border border-nothing-gray rounded-2xl p-5 flex flex-col gap-3 group hover:border-nothing-white transition-colors cursor-pointer h-full min-w-[200px] relative overflow-hidden"
        >
            <div className="flex justify-between items-start relative z-10">
                <span className="text-[10px] font-mono border border-nothing-gray px-2 py-1 rounded text-nothing-muted uppercase truncate max-w-[100px]">{part.category || "Category"}</span>
                {isLowStock && (
                    <span className="text-[8px] font-mono text-nothing-red uppercase tracking-widest bg-nothing-red/10 px-1.5 py-0.5 rounded border border-nothing-red/20">
                        Low Stock
                    </span>
                )}
            </div>

            <div className="h-24 flex items-center justify-center overflow-hidden rounded-lg bg-nothing-black/20 mt-2 relative">
                {part.images && part.images.length > 0 ? (
                    <img src={part.images[0].url} alt={part.title} className={`w-full h-full object-cover transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-50' : 'group-hover:scale-105'}`} />
                ) : (
                    <Wrench size={32} className="text-nothing-muted" />
                )}
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-black/80 text-white text-[10px] font-mono px-2 py-1 rounded uppercase tracking-wider">Sold Out</span>
                    </div>
                )}
            </div>

            <div>
                <h4 className="font-medium text-sm truncate text-nothing-white">{part.title}</h4>
                <div className="flex justify-between items-center mt-2">
                    <span className="font-mono text-sm text-nothing-white">₹{part.price.toLocaleString()}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isOutOfStock) onAdd();
                        }}
                        disabled={isOutOfStock}
                        className={`
                            p-1.5 rounded-full transition-all duration-300 flex items-center gap-1 overflow-hidden
                            ${isOutOfStock
                                ? 'bg-nothing-gray text-nothing-muted cursor-not-allowed'
                                : inCartQty
                                    ? 'bg-nothing-red text-white pr-2'
                                    : 'bg-nothing-white text-nothing-black hover:scale-110'
                            }
                        `}
                    >
                        <AnimatePresence mode="wait">
                            {inCartQty ? (
                                <motion.span
                                    key="added"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-1 text-[10px] font-bold"
                                >
                                    <Check size={12} /> +{inCartQty}
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="add"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <ShoppingBag size={14} />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const InspectionCard = ({ item, onClick }) => (
    <div
        onClick={onClick}
        className="bg-nothing-dark border border-nothing-gray rounded-2xl p-6 flex flex-col gap-4 cursor-pointer hover:bg-nothing-white/5 transition-colors group h-full min-w-[300px]"
    >
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-medium text-lg text-nothing-white group-hover:text-nothing-red transition-colors">{item.bikeName}</h4>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs font-mono text-nothing-muted uppercase">
                        {item.type === 'SERVICE' ? `Service: ${item.serviceType}` : 'Inspection Order'}
                    </p>
                </div>            </div>
            <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-widest border ${item.status === 'COMPLETED' ? 'border-green-500 text-green-500' :
                item.status === 'ACCEPTED' ? 'border-blue-500 text-blue-500' :
                    item.status === 'CANCELLED' ? 'border-nothing-gray text-nothing-muted' :
                        'border-yellow-500 text-yellow-500'
                }`}>
                {item.status.replace('_', ' ')}
            </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-nothing-gray/30 rounded-full overflow-hidden">
            <div
                className={`h-full ${item.status === 'COMPLETED' ? 'bg-green-500' :
                    item.status === 'ACCEPTED' ? 'bg-blue-500' :
                        item.status === 'CANCELLED' ? 'bg-nothing-muted' :
                            'bg-yellow-500'
                    }`}
                style={{
                    width: item.status === 'COMPLETED' ? '100%' :
                        item.status === 'ACCEPTED' ? '60%' :
                            item.status === 'CANCELLED' ? '100%' :
                                '20%'
                }}
            />
        </div>

        <div className="flex justify-between items-center text-sm text-nothing-muted mt-auto">
            <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase">Offer</span>
                <span>₹{item.offerAmount}</span>
            </div>
            <div className="flex flex-col text-right">
                <span className="text-[10px] font-mono uppercase">Date</span>
                <span>{item.date}</span>
            </div>
        </div>
    </div>
);


// --- New Order Timeline Component ---
const OrderTimeline = ({ status, date }) => {
    const steps = ['processing', 'shipped', 'out_for_delivery', 'delivered'];
    const normalizedStatus = status.toLowerCase();
    const currentStepIndex = steps.indexOf(normalizedStatus);

    // If cancelled or PAID (initial), handle separately
    if (normalizedStatus.toLowerCase() === 'paid') return (
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-green-500">
            <CheckCircle2 size={14} /> Order Paid & Confirmed
        </div>
    );
    if (normalizedStatus.toLowerCase() === 'cancelled') return (
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-nothing-red">
            <XCircle size={14} /> Order Cancelled
        </div>
    );

    return (
        <div className="mt-6">
            <div className="flex justify-between relative px-2">
                {/* Background Line */}
                <div className="absolute top-2.5 left-2 right-2 h-0.5 bg-nothing-gray -z-0" />

                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center gap-2 group">
                            <div className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-300
                                ${isCompleted
                                    ? 'bg-green-500 border-green-500'
                                    : 'bg-nothing-dark border-nothing-gray group-hover:border-nothing-white'
                                }
                             `}>
                                {isCompleted && <Check size={10} className="text-black" strokeWidth={3} />}
                            </div>
                            {/* Only show label for active/completed or on hover to save space */}
                            <span className={`
                                text-[10px] font-mono uppercase tracking-wider absolute top-6 whitespace-nowrap transition-opacity duration-300
                                ${isCurrent ? 'text-nothing-white opacity-100' : 'text-nothing-muted opacity-0 group-hover:opacity-100'}
                             `}>
                                {step.replace(/_/g, ' ')}
                            </span>
                        </div>
                    );
                })}
            </div>
            <p className="text-xs text-nothing-muted text-right mt-8 font-mono">
                Updated: {new Date(date).toLocaleDateString()}
            </p>
        </div>
    );
};

const OrderCard = ({ order, onClick, onCancelClick }) => {
    // Determine if cancellable: status is typically PAID, PROCESSING, PENDING.
    // Assuming backend statuses: PAID, PROCESSING, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    const cancellableStatuses = ['paid', 'processing', 'pending'];
    const isCancellable = cancellableStatuses.includes(order.status.toLowerCase());

    return (
        <div
            onClick={onClick}
            className="bg-nothing-dark border border-nothing-gray rounded-2xl p-6 cursor-pointer hover:border-nothing-white transition-colors group"
        >
            <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Package size={18} className="text-nothing-muted group-hover:text-nothing-white transition-colors" />
                    <span className="font-medium text-nothing-white">Order #{order.id.slice(-6)}</span>
                </div>
                <span className={`text-xs font-mono uppercase border px-2 py-1 rounded ${order.status === 'CANCELLED' ? 'border-nothing-red text-nothing-red' : 'border-nothing-gray text-nothing-muted'
                    }`}>
                    {order.status.replace(/_/g, ' ')}
                </span>
            </div>
            <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm text-nothing-muted bg-nothing-black/20 p-2 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-nothing-gray overflow-hidden shrink-0">
                                {item.product?.images?.[0]?.url && <img src={item.product.images[0].url} className="w-full h-full object-cover" />}
                            </div>
                            <span className="text-nothing-white truncate max-w-[150px]">{item.product.title}</span>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="text-xs">x{item.quantity}</div>
                            <div className="font-mono text-nothing-white">₹{item.priceAtPurchase.toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>

            <OrderTimeline status={order.status} date={order.createdAt} />

            <div className="mt-4 pt-4 border-t border-nothing-gray flex justify-between items-center">
                <div>
                    <span className="text-xs font-mono text-nothing-muted block">TOTAL</span>
                    <span className="font-medium text-nothing-white">₹{order.totalAmount.toLocaleString()}</span>
                </div>
                {isCancellable && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onCancelClick(order.id); }}
                        className="text-xs font-mono text-nothing-red border border-nothing-red/30 px-3 py-2 rounded-lg hover:bg-nothing-red/10 transition-colors uppercase tracking-wider"
                    >
                        Cancel Order
                    </button>
                )}
            </div>
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="space-y-12 animate-pulse">
        <div className="space-y-6">
            <div className="h-8 bg-nothing-gray rounded w-1/4"></div>
            <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3].map(i => (
                    <div key={i} className="min-w-[300px] h-80 bg-nothing-dark rounded-3xl border border-nothing-gray"></div>
                ))}
            </div>
        </div>
        <div className="space-y-6">
            <div className="h-8 bg-nothing-gray rounded w-1/4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-40 bg-nothing-dark rounded-2xl border border-nothing-gray"></div>
                ))}
            </div>
        </div>
    </div>
);

const UserDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cart, inspections, orders, garage, dashboard, selectedInspection, selectedOrder } = useSelector((state) => state.buyer);
    const [selectedBike, setSelectedBike] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAddBikeOpen, setIsAddBikeOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [serviceRequestBike, setServiceRequestBike] = useState(null);
    const [activeTab, setActiveTab] = useState('market');

    const [bikePage, setBikePage] = useState(1);
    const [partPage, setPartPage] = useState(1);

    // Refs for scrolling
    const bikeScrollRef = useRef(null);

    // Fetch Dashboard Data on Mount and Page Change
    useEffect(() => {
        dispatch(fetchDashboardData({
            bikePage: bikePage,
            bikeLimit: 5,
            accPage: partPage,
            accLimit: 8
        }));
        dispatch(fetchBuyerInspections());
        dispatch(fetchCart());
        dispatch(fetchGarage());

    }, [dispatch, bikePage, partPage]);

    useEffect(() => {
        if (activeTab === 'garage') {
            dispatch(fetchGarage());
            dispatch(fetchBuyerOrders());
            dispatch(fetchBuyerInspections());
        }
    }, [activeTab, dispatch]);

    const handleInspectionClick = (id) => {
        dispatch(fetchInspectionDetail(id));
    };
    const handleOrderClick = (order) => {
        dispatch(setSelectedBuyerOrder(order));
    };
    const confirmCancelOrder = () => {
        if (orderToCancel) {
            dispatch(cancelBuyerOrder(orderToCancel));
            setOrderToCancel(null);
        }
    };

    const scrollBikes = (direction) => {
        if (bikeScrollRef.current) {
            const scrollAmount = 350; // Approx card width
            bikeScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Fetch Dashboard Data on Mount
    useEffect(() => {
        dispatch(fetchDashboardData({
            bikePage: 1,
            bikeLimit: 10,
            accPage: 1,
            accLimit: 10
        }));
    }, [dispatch]);

    const getCartQuantity = (productId) => {
        const item = cart.find(i => i.productId === productId);
        return item ? item.quantity : undefined;
    };

    const handleAddToCart = (part) => {
        dispatch(addItemToCart({ productId: part.id, quantity: 1 }));
        dispatch(openStatusModal({
            type: 'success',
            title: 'Added to Cart',
            message: 'Item has been added to your cart.',
            actionLabel: 'Keep Browsing'
        }));
    };
    const handleCartItemClick = (product) => {
        // Close cart and open appropriate modal
        setIsCartOpen(false);
        if (product.type === 'bike') {
            setSelectedBike(product);
        } else {
            setSelectedPart(product);
        }
    };

    // Reusable Pagination Control
    const PaginationControls = ({ page, total, limit, onPageChange }) => {
        const totalPages = Math.ceil(total / limit);
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center gap-3 bg-nothing-dark border border-nothing-gray rounded-full px-3 py-1">
                <button
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    className="p-1 hover:text-white text-nothing-muted disabled:opacity-30 disabled:hover:text-nothing-muted transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-mono text-nothing-white">{page} <span className="text-nothing-muted">/ {totalPages}</span></span>
                <button
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="p-1 hover:text-white text-nothing-muted disabled:opacity-30 disabled:hover:text-nothing-muted transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-nothing-black text-nothing-white selection:bg-nothing-red selection:text-white transition-colors duration-300 flex flex-col">
            <Navbar
                userName={user?.name || 'Rider'}
                role="User"
                onProfileClick={() => setActiveTab('profile')}
            />

            {/* Drawers & Modals */}
            <AnimatePresence>
                {isCartOpen && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onItemClick={handleCartItemClick} />}
                {selectedBike && <BikeDetailModal bike={selectedBike} onClose={() => setSelectedBike(null)} />}
                {selectedPart && <PartDetailModal part={selectedPart} onClose={() => setSelectedPart(null)} />}
                {isAddBikeOpen && <AddBikeModal onClose={() => setIsAddBikeOpen(false)} />}
                {selectedInspection && <BuyerInspectionModal />}
                {serviceRequestBike && <ServiceRequestModal bikeId={serviceRequestBike.id} bikeName={serviceRequestBike.name} onClose={() => setServiceRequestBike(null)} />}

                {selectedOrder && <BuyerOrderModal onCancelClick={(id) => setOrderToCancel(id)} />}
                <WelcomeFeatureModal />
                {orderToCancel && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setOrderToCancel(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 10 }}
                            className="relative bg-nothing-dark border border-nothing-red/50 w-full max-w-sm rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-nothing-red/10 border border-nothing-red/20 flex items-center justify-center mb-6 text-nothing-red">
                                <AlertTriangle size={24} />
                            </div>

                            <h3 className="text-xl font-medium text-nothing-white tracking-tight mb-2">
                                Cancel Order?
                            </h3>
                            <p className="text-nothing-muted text-sm leading-relaxed mb-6">
                                Are you sure you want to cancel this order? Refunds typically take 3-5 business days.
                            </p>

                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => setOrderToCancel(null)}
                                    className="flex-1 py-3 px-4 rounded-full border border-nothing-gray text-nothing-white hover:bg-white/5 transition-colors font-medium text-sm"
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={confirmCancelOrder}
                                    className="flex-1 py-3 px-4 rounded-full bg-nothing-red text-white hover:bg-[#b0141b] transition-colors font-medium text-sm"
                                >
                                    Yes, Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-medium tracking-tight text-nothing-white">
                        {activeTab === 'market' ? 'Discover.' : activeTab === 'garage' ? 'My Garage.' : 'Settings.'}
                    </h1>
                    <p className="text-nothing-muted font-light">
                        {activeTab === 'market' ? 'Refurbished bikes & premium parts.' :
                            activeTab === 'garage' ? 'Track your rides and orders.' : 'Manage your personal details.'}
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-nothing-gray flex gap-8 sticky top-20 bg-nothing-black/90 backdrop-blur z-30 pt-4 transition-colors duration-300">
                    {['market', 'garage', 'profile'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-mono uppercase tracking-widest transition-colors relative ${activeTab === tab ? 'text-nothing-white' : 'text-nothing-muted hover:text-nothing-white'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-nothing-red" />}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === 'market' && (
                        <motion.div
                            key="market"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-12"
                        >
                            {dashboard.loading ? (
                                <LoadingSkeleton />
                            ) : (
                                <>
                                    {/* Bikes Section */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                            <h2 className="text-2xl font-medium text-nothing-white">Refurbished Bikes.</h2>
                                            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-end md:items-center">
                                                {/* Pagination Controls */}
                                                <PaginationControls
                                                    page={bikePage}
                                                    total={dashboard.bikes?.meta?.total}
                                                    limit={dashboard.bikes?.meta?.limit}
                                                    onPageChange={setBikePage}
                                                />                                                {/* Search */}
                                                <div className="flex items-center gap-2 bg-nothing-dark border border-nothing-gray rounded-full px-4 py-2 w-full md:w-64 transition-colors">
                                                    <Search size={16} className="text-nothing-muted" />
                                                    <input
                                                        placeholder="Search models..."
                                                        className="bg-transparent outline-none text-sm w-full placeholder-nothing-muted text-nothing-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Horizontal Scroll Container for Bikes with Navigation Buttons */}
                                        <div className="relative group/list">
                                            {/* Scroll Left Button */}
                                            <button
                                                onClick={() => scrollBikes('left')}
                                                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-10 w-10 h-10 bg-nothing-black border border-nothing-gray rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover/list:opacity-100 transition-opacity hover:bg-nothing-dark hover:border-nothing-white hidden md:flex"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>

                                            <div
                                                ref={bikeScrollRef}
                                                className="relative -mx-6 px-6 overflow-x-auto pb-6 custom-scrollbar snap-x snap-mandatory flex gap-6"
                                            >
                                                {dashboard.bikes.data.map(bike => {
                                                    const activeInspection = inspections.find(i => i.bikeId === bike.id && i.status !== 'CANCELLED');

                                                    return (
                                                        <motion.div
                                                            key={bike.id}
                                                            layoutId={`bike-${bike.id}`}
                                                            onClick={() => setSelectedBike(bike)}
                                                            className="bg-nothing-dark border border-nothing-gray rounded-3xl overflow-hidden cursor-pointer group transition-colors min-w-[300px] md:min-w-[350px] snap-center flex-shrink-0 relative"
                                                        >
                                                            <div className="h-48 bg-neutral-900 relative flex items-center justify-center overflow-hidden">
                                                                {bike.images && bike.images.length > 0 ? (
                                                                    <img src={bike.images[0].url} alt={bike.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                                                ) : (
                                                                    <Bike size={64} className="text-neutral-600 group-hover:text-white transition-colors" strokeWidth={1} />
                                                                )}

                                                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-[10px] font-mono uppercase border border-white/10 text-white">
                                                                    {bike.condition || 'Used'}
                                                                </div>

                                                                {activeInspection && (
                                                                    <div className="absolute top-4 left-4 bg-nothing-black/80 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-mono uppercase border border-nothing-gray text-white flex items-center gap-1.5 shadow-xl">
                                                                        {activeInspection.status === 'COMPLETED' ? (
                                                                            <>
                                                                                <ShieldCheck size={12} className="text-green-500" /> Inspected
                                                                            </>
                                                                        ) : activeInspection.status === 'ACCEPTED' ? (
                                                                            <>
                                                                                <Wrench size={12} className="text-blue-500" /> In Progress
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Hourglass size={12} className="text-yellow-500" /> Pending
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono uppercase border border-white/10 text-white">
                                                                    {bike.category || 'Standard'}
                                                                </div>
                                                            </div>
                                                            <div className="p-6 space-y-4">
                                                                <div>
                                                                    <h3 className="text-xl font-medium text-nothing-white truncate">{bike.title}</h3>
                                                                    <p className="text-nothing-muted text-sm mt-1">{bike.year || 2020} • {bike.kmdriven?.toLocaleString() || 5000} km</p>
                                                                </div>
                                                                <div className="flex justify-between items-center pt-2">
                                                                    <span className="font-mono text-lg text-nothing-white">₹{bike.price.toLocaleString()}</span>
                                                                    <span className="w-8 h-8 rounded-full border border-nothing-gray flex items-center justify-center group-hover:bg-nothing-white group-hover:text-nothing-black transition-colors text-nothing-muted">
                                                                        <ArrowRight size={16} />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                                {dashboard.bikes.data.length === 0 && (
                                                    <div className="w-full text-center py-12 text-nothing-muted font-mono">
                                                        No bikes available.
                                                    </div>
                                                )}
                                            </div>

                                            {/* Scroll Right Button */}
                                            <button
                                                onClick={() => scrollBikes('right')}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-10 w-10 h-10 bg-nothing-black border border-nothing-gray rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover/list:opacity-100 transition-opacity hover:bg-nothing-dark hover:border-nothing-white hidden md:flex"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Parts Section - Now Horizontally Scrollable */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <h2 className="text-2xl font-medium text-nothing-white">Premium Parts.</h2>
                                            <PaginationControls
                                                page={partPage}
                                                total={dashboard.parts?.meta?.total}
                                                limit={dashboard.parts?.meta?.limit}
                                                onPageChange={setPartPage}
                                            />
                                        </div>
                                        <div className="relative -mx-6 px-6 overflow-x-auto pb-6 custom-scrollbar snap-x snap-mandatory flex gap-4">
                                            {dashboard.parts.data.map(part => (
                                                <div key={part.id} className="min-w-[220px] snap-center">
                                                    <PartCard
                                                        part={part}
                                                        inCartQty={getCartQuantity(part.id)}
                                                        onClick={() => setSelectedPart(part)}
                                                        onAdd={() => handleAddToCart(part)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'garage' && (
                        <motion.div
                            key="garage"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {/* My Bike Section */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-medium flex items-center gap-2 text-nothing-white">
                                        <Bike size={20} className="text-nothing-white" /> My Garage
                                    </h2>
                                    <button onClick={() => setIsAddBikeOpen(true)} className="text-xs font-mono text-nothing-red hover:underline uppercase flex items-center gap-1">
                                        <Plus size={14} /> Add Bike
                                    </button>
                                </div>

                                {garage.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {garage.map((bike) => (
                                            <div key={bike.id} className="bg-nothing-dark border border-nothing-gray rounded-3xl p-8 flex flex-col justify-between items-start gap-6 relative overflow-hidden transition-colors hover:border-nothing-white group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-nothing-red/5 to-transparent pointer-events-none" />

                                                <div className="flex items-start gap-4 z-10 w-full">
                                                    <div className="w-16 h-16 rounded-full bg-nothing-black border border-nothing-gray flex items-center justify-center shrink-0 transition-colors group-hover:border-nothing-white">
                                                        <Bike size={32} className="text-nothing-red" strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-medium tracking-tight text-nothing-white leading-tight">{bike.brand} {bike.model}</h3>
                                                        <p className="text-nothing-muted text-sm mt-1">{bike.year} • {bike.registration || 'No Reg'}</p>
                                                    </div>
                                                </div>

                                                <div className="w-full pt-4 border-t border-nothing-gray/50 flex gap-4 z-10">
                                                    <button
                                                        onClick={() => setServiceRequestBike({ id: bike.id, name: `${bike.brand} ${bike.model}` })}
                                                        className="flex-1 py-2 rounded-lg bg-nothing-white text-nothing-black text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Wrench size={16} /> Request Service
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-nothing-dark border border-dashed border-nothing-gray rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-center transition-colors">
                                        <div className="w-16 h-16 rounded-full bg-nothing-black flex items-center justify-center">
                                            <Plus size={24} className="text-nothing-muted" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-nothing-white">Your garage is empty</h3>
                                            <p className="text-sm text-nothing-muted">Add your bike to get personalized services and parts.</p>
                                        </div>
                                        <button onClick={() => setIsAddBikeOpen(true)} className="text-sm font-mono text-nothing-red uppercase tracking-wider hover:underline">Add Bike Details</button>
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2 space-y-6">
                                <h2 className="text-xl font-medium flex items-center gap-2 text-nothing-white">
                                    <Clock size={20} className="text-nothing-red" /> Active Jobs
                                </h2>
                                {inspections.length === 0 ? (
                                    <p className="text-nothing-muted font-mono text-sm">No active inspections or services.</p>
                                ) : (
                                    <div className="relative -mx-6 px-6 overflow-x-auto pb-6 custom-scrollbar snap-x snap-mandatory flex gap-4">
                                        {inspections.map(ins => (
                                            <div key={ins.id} className="min-w-[300px] snap-center">
                                                <InspectionCard
                                                    item={ins}
                                                    onClick={() => handleInspectionClick(ins.id)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2 space-y-6">
                                <h2 className="text-xl font-medium flex items-center gap-2 text-nothing-white">
                                    <Package size={20} className="text-nothing-white" /> Order History
                                </h2>
                                {orders.length === 0 ? (
                                    <p className="text-nothing-muted font-mono text-sm">No past orders.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map(ord => (
                                            <OrderCard
                                                key={ord.id}
                                                order={ord}
                                                onClick={() => handleOrderClick(ord)}
                                                onCancelClick={(id) => setOrderToCancel(id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}


                    {activeTab === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <UserProfile />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Cart Button (FAB) */}
                <AnimatePresence>
                    {cart.length > 0 && (
                        <motion.button
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -180 }}
                            onClick={() => setIsCartOpen(true)}
                            className="fixed bottom-8 right-8 z-40 bg-nothing-red text-white p-4 rounded-full shadow-2xl shadow-nothing-red/40 hover:scale-110 active:scale-95 transition-transform"
                        >
                            <ShoppingBag size={24} />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-nothing-black rounded-full flex items-center justify-center text-xs font-bold">
                                {cart.length}
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Floating Cart Button (FAB) */}
                <AnimatePresence>
                    {cart.length > 0 && (
                        <motion.button
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -180 }}
                            onClick={() => setIsCartOpen(true)}
                            className="fixed bottom-8 right-8 z-40 bg-nothing-red text-white p-4 rounded-full shadow-2xl shadow-nothing-red/40 hover:scale-110 active:scale-95 transition-transform"
                        >
                            <ShoppingBag size={24} />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-nothing-black rounded-full flex items-center justify-center text-xs font-bold">
                                {cart.length}
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>

            </main>
            <Footer />
        </div>
    );
};

export default UserDashboard;