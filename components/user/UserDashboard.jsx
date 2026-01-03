import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, fetchDashboardData, fetchBuyerInspections, fetchInspectionDetail, fetchBuyerOrders, fetchCart, cancelBuyerOrder, setSelectedBuyerOrder, fetchGarage, fetchBikeHistory } from '../../store/slices/buyerSlice';
import Navbar from '../common/Navbar';
import BikeDetailModal from './BikeDetailModal';
import PartDetailModal from './PartDetailModal';
import CartDrawer from './CartDrawer';
import UserProfile from './UserProfile';
import AddBikeModal from './AddBikeModal';
import EditBikeModal from './EditBikeModal';
import ServiceRequestModal from './ServiceRequestModal';
import BuyerInspectionModal from './BuyerInspectionModal';
import BuyerOrderModal from './BuyerOrderModal';
import BikeHistoryModal from './BikeHistoryModal';
import WelcomeFeatureModal from '../common/WelcomeFeatureModal';
import Footer from '../common/Footer';
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
    Zap,
    Edit2,
    Grid
} from 'lucide-react';

const PartCard = ({ part, inCartQty, onAdd, onClick }) => {
    const isOutOfStock = part.stock === 0;
    const isLowStock = part.stock !== undefined && part.stock > 0 && part.stock <= 5;

    return (
        <motion.div
            onClick={onClick}
            className="bg-nothing-dark border border-nothing-gray rounded-2xl p-5 flex flex-col gap-3 group hover:border-nothing-white transition-colors cursor-pointer h-full min-w-[200px] relative overflow-hidden"
        >
            <div className="flex justify-between items-start relative z-10">
                <span className="text-[10px] font-mono border border-nothing-gray px-2 py-1 rounded text-nothing-muted uppercase group-hover:border-nothing-white transition-colors">
                    {part.category || 'Part'}
                </span>
                {isLowStock && (
                    <span className="flex items-center gap-1 text-[10px] text-nothing-red font-mono bg-nothing-red/10 px-2 py-1 rounded border border-nothing-red/20">
                        <AlertTriangle size={10} /> {part.stock} left
                    </span>
                )}
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center py-2">
                {part.images && part.images.length > 0 ? (
                    <div className="aspect-video w-full rounded-lg overflow-hidden mb-3 bg-black/20">
                        <img src={part.images[0].url} alt={part.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                ) : (
                    <div className="w-12 h-12 bg-nothing-black rounded-full flex items-center justify-center border border-nothing-gray mb-3 text-nothing-muted group-hover:text-nothing-white group-hover:border-nothing-white transition-colors">
                        <ShoppingBag size={20} />
                    </div>
                )}
                <h3 className="font-medium text-nothing-white leading-tight line-clamp-2 mb-1 group-hover:text-nothing-red transition-colors">{part.title}</h3>
                <p className="text-xs text-nothing-muted">By {part.seller?.businessName || 'Verified Seller'}</p>
            </div>

            {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="text-xs font-mono uppercase bg-nothing-red text-white px-3 py-1 rounded rotate-[-10deg]">Out of Stock</span>
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-nothing-gray relative z-10">
                <span className="font-mono text-nothing-white">₹{part.price.toLocaleString()}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); onAdd(); }}
                    disabled={isOutOfStock}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 ${inCartQty ? 'bg-nothing-white text-nothing-black' : 'bg-nothing-black border border-nothing-gray text-nothing-white hover:bg-nothing-white hover:text-nothing-black'}`}
                >
                    {inCartQty ? <span className="text-xs font-bold">{inCartQty}</span> : <Plus size={16} />}
                </button>
            </div>
        </motion.div>
    );
};

const BikeCard = ({ bike, onClick }) => (
    <motion.div
        onClick={onClick}
        className="bg-nothing-dark border border-nothing-gray rounded-3xl overflow-hidden cursor-pointer group hover:border-nothing-white transition-all h-full flex flex-col"
    >
        <div className="aspect-[4/3] bg-neutral-900 relative overflow-hidden">
            {bike.images && bike.images.length > 0 ? (
                <img
                    src={bike.images[0].url}
                    alt={bike.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <Bike size={48} className="text-neutral-700" />
                </div>
            )}
            <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs font-mono text-white border border-white/10 uppercase tracking-wide">
                    {bike.year}
                </span>
            </div>
            {bike.condition === 'MINT' && (
                <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-green-500/90 backdrop-blur rounded-full text-xs font-bold text-black uppercase tracking-wide shadow-lg shadow-green-900/20">
                        Mint
                    </span>
                </div>
            )}
        </div>
        <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-medium tracking-tight text-nothing-white group-hover:text-nothing-red transition-colors line-clamp-1">{bike.title}</h3>
            </div>
            <div className="flex gap-4 text-sm text-nothing-muted font-mono mb-6">
                <span className="flex items-center gap-1.5"><Wrench size={14} /> {bike.kmdriven?.toLocaleString()} km</span>
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Certified</span>
            </div>
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-nothing-gray">
                <div>
                    <p className="text-[10px] text-nothing-muted uppercase tracking-widest mb-0.5">Price</p>
                    <p className="text-lg font-medium text-nothing-white">₹{bike.price.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-nothing-gray flex items-center justify-center group-hover:bg-nothing-white group-hover:text-nothing-black transition-colors">
                    <ArrowRight size={20} />
                </div>
            </div>
        </div>
    </motion.div>
);

const UserDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cart, garage, inspections, dashboard, orders, selectedInspection, selectedOrder } = useSelector((state) => state.buyer);
    const { loading: dashboardLoading } = dashboard;

    // --- Local State ---
    const [activeTab, setActiveTab] = useState('home');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [marketFilter, setMarketFilter] = useState('all');

    // Modals
    const [selectedBike, setSelectedBike] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);
    const [isAddBikeOpen, setIsAddBikeOpen] = useState(false);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [serviceBike, setServiceBike] = useState(null);
    const [editingBike, setEditingBike] = useState(null);
    const [historyBike, setHistoryBike] = useState(null);

    // Order Cancellation State
    const [orderToCancel, setOrderToCancel] = useState(null);

    // --- Effects ---
    useEffect(() => {
        // Initial Data Load
        dispatch(fetchDashboardData({ bikePage: 1, bikeLimit: 10, accPage: 1, accLimit: 10 }));
        dispatch(fetchCart());
        dispatch(fetchGarage());
        dispatch(fetchBuyerInspections());
        dispatch(fetchBuyerOrders());
    }, [dispatch]);

    // --- Handlers ---

    const getCartQty = (productId) => {
        const item = cart.find(i => i.productId === productId);
        return item ? item.quantity : undefined;
    };

    const handleAddToCart = (part) => {
        dispatch(addItemToCart({ productId: part.id, quantity: 1 }));
        dispatch(openStatusModal({
            type: 'success',
            title: 'Added to Cart',
            message: `${part.title} added to cart.`,
            actionLabel: 'Continue'
        }));
    };

    const handleRequestService = (bike) => {
        setServiceBike({ id: bike.id, name: `${bike.brand} ${bike.model}` });
        setIsServiceModalOpen(true);
    };

    const handleEditBike = (bike) => {
        setEditingBike(bike);
    };

    const handleViewHistory = (bike) => {
        setHistoryBike({ id: bike.id, name: `${bike.brand} ${bike.model}` });
        dispatch(fetchBikeHistory(bike.id));
    };

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
            // If modal was open, it updates via redux state automatically
        }
    };

    // Navigation Handlers for "View All"
    const handleViewAllBikes = () => {
        setMarketFilter('bikes');
        setActiveTab('market');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBrowseStore = () => {
        setMarketFilter('parts');
        setActiveTab('market');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Filter Logic ---
    const filteredBikes = dashboard.bikes.data.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredParts = dashboard.parts.data.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

    // --- Render Content ---

    return (
        <div className="min-h-screen bg-nothing-black text-nothing-white selection:bg-nothing-red selection:text-white transition-colors duration-300 flex flex-col">
            <Navbar
                userName={user?.name || 'Rider'}
                role="Rider"
                onProfileClick={() => setActiveTab('profile')}
            />

            {/* Global Modals */}
            <AnimatePresence>
                {selectedBike && <BikeDetailModal bike={selectedBike} onClose={() => setSelectedBike(null)} />}
                {selectedPart && <PartDetailModal part={selectedPart} onClose={() => setSelectedPart(null)} />}
                {isCartOpen && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onItemClick={(p) => { setIsCartOpen(false); setSelectedPart(p); }} />}
                {isAddBikeOpen && <AddBikeModal onClose={() => setIsAddBikeOpen(false)} />}
                {editingBike && <EditBikeModal bike={editingBike} onClose={() => setEditingBike(null)} />}
                {isServiceModalOpen && serviceBike && <ServiceRequestModal bikeId={serviceBike.id} bikeName={serviceBike.name} onClose={() => setIsServiceModalOpen(false)} />}
                {historyBike && <BikeHistoryModal bikeName={historyBike.name} onClose={() => setHistoryBike(null)} />}
                {selectedInspection && <BuyerInspectionModal />}
                {selectedOrder && <BuyerOrderModal onCancelClick={(id) => setOrderToCancel(id)} />}
                <WelcomeFeatureModal />

                {/* Cancel Confirmation */}
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
                                Are you sure you want to cancel this order? This action cannot be undone.
                            </p>

                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => setOrderToCancel(null)}
                                    className="flex-1 py-3 px-4 rounded-full border border-nothing-gray text-nothing-white hover:bg-white/5 transition-colors font-medium text-sm"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={confirmCancelOrder}
                                    className="flex-1 py-3 px-4 rounded-full bg-nothing-red text-white hover:bg-[#b0141b] transition-colors font-medium text-sm"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full pb-24">

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-4 border-b border-nothing-gray pb-1">
                    {['home', 'market', 'garage', 'activity', 'profile'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-2 text-sm font-mono uppercase tracking-widest transition-colors relative ${activeTab === tab ? 'text-nothing-white' : 'text-nothing-muted hover:text-nothing-white'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="user_tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-nothing-red" />
                            )}
                        </button>
                    ))}
                </div>

                {/* --- HOME TAB --- */}
                {activeTab === 'home' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Search Header */}
                        <div className="relative max-w-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nothing-muted" size={20} />
                            <input
                                type="text"
                                placeholder="Search bikes, parts, or accessories..."
                                className="w-full bg-nothing-dark border border-nothing-gray rounded-2xl py-4 pl-12 pr-4 text-nothing-white outline-none focus:border-nothing-white transition-colors placeholder-nothing-muted shadow-lg"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (e.target.value.length > 0) setActiveTab('market'); // Auto switch to market on search
                                }}
                            />
                        </div>

                        {/* Bikes Section */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-end">
                                <h2 className="text-2xl font-medium tracking-tight text-nothing-white">Fresh Arrivals.</h2>
                                <button
                                    onClick={handleViewAllBikes}
                                    className="text-xs font-mono text-nothing-red hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
                                >
                                    View All <ArrowRight size={14} />
                                </button>
                            </div>

                            {dashboardLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => <div key={i} className="aspect-[4/3] bg-nothing-dark rounded-3xl animate-pulse" />)}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredBikes.slice(0, 3).map(bike => (
                                        <BikeCard key={bike.id} bike={bike} onClick={() => setSelectedBike(bike)} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Parts Section */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-end">
                                <h2 className="text-2xl font-medium tracking-tight text-nothing-white">Genuine Parts.</h2>
                                <button
                                    onClick={handleBrowseStore}
                                    className="text-xs font-mono text-nothing-red hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
                                >
                                    Browse Store <ArrowRight size={14} />
                                </button>
                            </div>

                            {dashboardLoading ? (
                                <div className="flex gap-4 overflow-hidden">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="w-64 h-64 bg-nothing-dark rounded-2xl animate-pulse shrink-0" />)}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filteredParts.slice(0, 4).map(part => (
                                        <PartCard
                                            key={part.id}
                                            part={part}
                                            inCartQty={getCartQty(part.id)}
                                            onAdd={() => handleAddToCart(part)}
                                            onClick={() => setSelectedPart(part)}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {/* --- MARKET TAB --- */}
                {activeTab === 'market' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Market Search & Filter Bar */}
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative w-full md:flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nothing-muted" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search marketplace..."
                                    className="w-full bg-nothing-dark border border-nothing-gray rounded-xl py-3 pl-12 pr-4 text-nothing-white outline-none focus:border-nothing-white transition-colors placeholder-nothing-muted"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-2 p-1 bg-nothing-dark border border-nothing-gray rounded-xl overflow-hidden shrink-0">
                                {['all', 'bikes', 'parts'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setMarketFilter(f)}
                                        className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all ${marketFilter === f
                                            ? 'bg-nothing-white text-nothing-black'
                                            : 'text-nothing-muted hover:text-nothing-white'
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="space-y-10">

                            {/* Bikes Grid */}
                            {(marketFilter === 'all' || marketFilter === 'bikes') && filteredBikes.length > 0 && (
                                <div className="space-y-4">
                                    {marketFilter === 'all' && (
                                        <h3 className="text-lg font-medium text-nothing-muted flex items-center gap-2">
                                            <Bike size={18} /> Bikes
                                        </h3>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredBikes.map(bike => (
                                            <BikeCard key={bike.id} bike={bike} onClick={() => setSelectedBike(bike)} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Parts Grid */}
                            {(marketFilter === 'all' || marketFilter === 'parts') && filteredParts.length > 0 && (
                                <div className="space-y-4">
                                    {marketFilter === 'all' && (
                                        <h3 className="text-lg font-medium text-nothing-muted flex items-center gap-2">
                                            <Grid size={18} /> Parts & Accessories
                                        </h3>
                                    )}
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {filteredParts.map(part => (
                                            <PartCard
                                                key={part.id}
                                                part={part}
                                                inCartQty={getCartQty(part.id)}
                                                onAdd={() => handleAddToCart(part)}
                                                onClick={() => setSelectedPart(part)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {filteredBikes.length === 0 && filteredParts.length === 0 && (
                                <div className="py-20 text-center text-nothing-muted">
                                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-mono uppercase tracking-widest">No results found.</p>
                                    <p className="text-sm mt-2 opacity-60">Try adjusting your search or filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- GARAGE TAB --- */}
                {activeTab === 'garage' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-medium tracking-tight text-nothing-white">My Garage.</h2>
                                <p className="text-nothing-muted text-sm mt-1">Manage your machines and service history.</p>
                            </div>
                            <button
                                onClick={() => setIsAddBikeOpen(true)}
                                className="flex items-center gap-2 bg-nothing-white text-nothing-black px-5 py-3 rounded-full font-medium hover:bg-neutral-200 transition-colors"
                            >
                                <Plus size={18} /> Add Bike
                            </button>
                        </div>

                        {garage.length === 0 ? (
                            <div className="border border-dashed border-nothing-gray rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 bg-nothing-dark/30">
                                <div className="w-16 h-16 bg-nothing-black rounded-full flex items-center justify-center border border-nothing-gray">
                                    <Bike size={24} className="text-nothing-muted" />
                                </div>
                                <h3 className="text-xl font-medium text-nothing-white">Your garage is empty.</h3>
                                <p className="text-nothing-muted max-w-sm">Add your bike to get personalized part recommendations and quick service booking.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {garage.map((bike) => (
                                    <div key={bike.id} className="bg-nothing-dark border border-nothing-gray rounded-3xl p-6 relative overflow-hidden group hover:border-nothing-white transition-colors">
                                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Bike size={120} />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-12 h-12 bg-nothing-black rounded-xl flex items-center justify-center border border-nothing-gray">
                                                    <Bike size={24} className="text-nothing-white" />
                                                </div>
                                                {/* Edit Button Logic */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleEditBike(bike); }}
                                                        className="p-2 rounded-full bg-nothing-black border border-nothing-gray text-nothing-muted hover:text-white hover:border-white transition-colors"
                                                        title="Edit Details"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    {bike.registration && (
                                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono uppercase tracking-widest text-nothing-muted h-fit">
                                                            {bike.registration}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-medium text-nothing-white mb-1">{bike.model}</h3>
                                            <p className="text-nothing-muted text-sm">{bike.brand} • {bike.year}</p>

                                            <div className="mt-8 pt-6 border-t border-nothing-gray flex gap-4">
                                                <button
                                                    onClick={() => handleRequestService(bike)}
                                                    className="flex-1 py-3 rounded-xl bg-nothing-white text-nothing-black font-medium text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Wrench size={16} /> Request Service
                                                </button>
                                                <button
                                                    onClick={() => handleViewHistory(bike)}
                                                    className="flex-1 py-3 rounded-xl border border-nothing-gray text-nothing-white font-medium text-sm hover:bg-white/5 transition-colors"
                                                >
                                                    Service History
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- ACTIVITY TAB (Orders & Inspections) --- */}
                {activeTab === 'activity' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Inspections / Service Requests */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-medium tracking-tight text-nothing-white flex items-center gap-3">
                                <Hourglass size={24} className="text-nothing-red" />
                                Active Requests
                            </h2>
                            {inspections.length === 0 ? (
                                <p className="text-nothing-muted text-sm font-mono pl-1">No active inspection or service requests.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {inspections.map((ins) => (
                                        <div
                                            key={ins.id}
                                            onClick={() => handleInspectionClick(ins.id)}
                                            className="bg-nothing-dark border border-nothing-gray rounded-2xl p-5 hover:border-nothing-white transition-colors cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    {ins.status === 'COMPLETED' ? <CheckCircle2 className="text-green-500" size={18} /> :
                                                        ins.status === 'CANCELLED' ? <XCircle className="text-neutral-500" size={18} /> :
                                                            <Clock className="text-yellow-500" size={18} />}
                                                    <span className={`text-xs font-mono uppercase tracking-widest ${ins.status === 'COMPLETED' ? 'text-green-500' : 'text-nothing-white'}`}>
                                                        {ins.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-nothing-muted font-mono">{ins.date}</span>
                                            </div>
                                            <h3 className="font-medium text-lg text-nothing-white mb-1 group-hover:text-nothing-red transition-colors">
                                                {ins.type === 'SERVICE' ? (ins.serviceType || 'Service Request') : 'Inspection Request'}
                                            </h3>
                                            <p className="text-sm text-nothing-muted mb-4">{ins.bikeName}</p>
                                            <div className="flex items-center justify-between pt-3 border-t border-nothing-gray/50">
                                                <div className="flex items-center gap-2 text-xs text-nothing-muted">
                                                    {ins.mechanicName ? (
                                                        <><Wrench size={12} /> {ins.mechanicName}</>
                                                    ) : (
                                                        <><Search size={12} /> Finding Mechanic...</>
                                                    )}
                                                </div>
                                                <span className="text-sm font-mono text-nothing-white">₹{ins.offerAmount}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Orders */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-medium tracking-tight text-nothing-white flex items-center gap-3">
                                <Package size={24} className="text-blue-500" />
                                Order History
                            </h2>
                            {orders.length === 0 ? (
                                <div className="p-8 border border-dashed border-nothing-gray rounded-2xl text-center text-nothing-muted text-sm font-mono">
                                    You haven't ordered anything yet.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            onClick={() => handleOrderClick(order)}
                                            className="bg-nothing-dark border border-nothing-gray rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-nothing-white transition-colors cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <div className="w-12 h-12 bg-nothing-black rounded-xl flex items-center justify-center border border-nothing-gray shrink-0">
                                                    <Package size={20} className="text-nothing-muted group-hover:text-nothing-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-nothing-white">Order #{order.id.slice(-6)}</h4>
                                                    <p className="text-xs text-nothing-muted font-mono mt-1">
                                                        {order.items.length} Items • {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                                <span className={`text-xs font-mono uppercase px-3 py-1 rounded-full border ${order.status === 'DELIVERED' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                                                    order.status === 'CANCELLED' ? 'border-nothing-red/30 text-nothing-red bg-nothing-red/10' :
                                                        'border-white/20 text-nothing-muted'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-nothing-white">₹{order.totalAmount.toLocaleString()}</p>
                                                </div>
                                                <ChevronRight size={16} className="text-nothing-muted" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {/* --- PROFILE TAB --- */}
                {activeTab === 'profile' && (
                    <UserProfile />
                )}

            </main>

            <Footer />

            {/* Floating Action Button for Cart */}
            <AnimatePresence>
                {cart.length > 0 && activeTab !== 'profile' && (
                    <motion.button
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: -180 }}
                        onClick={() => setIsCartOpen(true)}
                        className="fixed bottom-8 right-8 z-40 bg-nothing-red text-white p-4 rounded-full shadow-2xl shadow-nothing-red/40 hover:scale-110 active:scale-95 transition-transform group"
                    >
                        <ShoppingBag size={24} />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-nothing-black rounded-full flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform">
                            {cart.length}
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

        </div>
    );
};

export default UserDashboard;