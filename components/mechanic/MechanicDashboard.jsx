import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
    openInspectionModal,
    openHistoryModal,
    openReportModal,
    addMechanicCartItem,
    fetchAvailableInspections,
    fetchActiveInspections,
    fetchMechanicMarketplace,
    fetchMechanicCart
} from '../../store/slices/mechanicSlice'; import Navbar from '../common/Navbar';
import Button from '../common/Button';
import InspectionModal from './InspectionModal';
import ReportModal from './ReportModal';
import Footer from '../common/Footer';
import MechanicCartDrawer from './MechanicCartDrawer';
import HistoryModal from './HistoryModal';
import MechanicPartDetailModal from './MechanicPartDetailModal';

import {
    Wrench,
    ClipboardCheck,
    ShoppingBag,
    Clock,
    CheckCircle2,
    AlertCircle,
    MapPin,
    Calendar,
    Search,
    RefreshCw,
    Plus,
    ChevronLeft,
    ChevronRight,
    History,
    XCircle,
    ArrowUpRight
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-nothing-dark border border-nothing-gray rounded-3xl p-6 flex flex-col justify-between h-32 md:h-40 group"
    >
        <div className="flex justify-between items-start">
            <div className="p-2 bg-nothing-black rounded-lg border border-nothing-gray/50 text-nothing-muted group-hover:text-nothing-red transition-colors">
                <Icon size={20} />
            </div>
        </div>
        <div>
            <h3 className="text-2xl md:text-3xl font-medium tracking-tighter text-nothing-white">{value}</h3>
            <p className="text-xs font-mono text-nothing-muted uppercase tracking-widest mt-1">{title}</p>
        </div>
    </motion.div>
);

const RequestCard = ({ request, onClick }) => (
    <motion.div
        layout
        onClick={onClick}
        className="bg-nothing-dark border border-nothing-gray rounded-2xl p-6 cursor-pointer hover:border-nothing-white transition-colors group relative overflow-hidden"
    >
        {/* Dot pattern */}
        <div
            className="absolute inset-0 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"
            style={{ backgroundImage: 'radial-gradient(var(--text-main) 1px, transparent 1px)', backgroundSize: '12px 12px' }}
        />

        <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest">Inspection Request</span>
                </div>
                <h3 className="text-lg font-medium text-nothing-white truncate pr-2">{request.bikeModel}</h3>
                <div className="flex items-center gap-4 text-sm text-nothing-muted mt-2">
                    <span className="flex items-center gap-1 max-w-[120px] truncate"><MapPin size={14} className="shrink-0" /> {request.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} className="shrink-0" /> {request.date}</span>
                </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
                <span className="text-xl font-medium text-nothing-white">₹{request.offerAmount}</span>
                <span className="text-xs text-nothing-muted font-mono">OFFER</span>
            </div>
        </div>
        <div className="mt-6 pt-4 border-t border-nothing-gray flex justify-between items-center relative z-10">
            <p className="text-sm text-nothing-muted truncate max-w-[70%]">{request.customerName}</p>
            <span className="text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform text-nothing-white">
                View Details <AlertCircle size={16} />
            </span>
        </div>
    </motion.div>
);

const HistoryCard = ({ item, onClick }) => {
    const isCompleted = item.status === 'completed';
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between p-4 bg-nothing-dark border border-nothing-gray rounded-xl hover:bg-nothing-white/5 transition-colors cursor-pointer group"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-nothing-red/10 text-nothing-red'}`}>
                    {isCompleted ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                </div>
                <div>
                    <h4 className="text-sm font-medium text-nothing-white">{item.bikeModel}</h4>
                    <p className="text-xs text-nothing-muted font-mono">{item.date}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {isCompleted && (
                    <span className="text-sm font-mono text-nothing-white">₹{item.offerAmount}</span>
                )}
                <ArrowUpRight size={16} className="text-nothing-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
};
const ActiveJobCard = ({ job, onReport }) => (
    <div className="bg-nothing-black border border-nothing-gray rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-4 items-center w-full md:w-auto">
            <div className="w-12 h-12 bg-nothing-dark rounded-full flex items-center justify-center border border-nothing-gray shrink-0 overflow-hidden">
                {job.bikeImage ? (
                    <img src={job.bikeImage} alt="" className="w-full h-full object-cover opacity-80" />
                ) : (
                    <Wrench size={20} className="text-nothing-white" />
                )}
            </div>
            <div>
                <h3 className="font-medium text-lg text-nothing-white">{job.bikeModel}</h3>
                <p className="text-sm text-nothing-muted font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    In Progress • Due {job.dueDate}
                </p>
            </div>
        </div>
        <Button onClick={onReport} variant="secondary" className="text-sm whitespace-nowrap w-full md:w-auto">
            Fill Report
        </Button>
    </div>
);

const PartCard = ({ part, inCartQty, onClick, onAddToCart }) => {
    const isOutOfStock = part.stock === 0;

    return (
        <div
            onClick={onClick}
            className="bg-nothing-dark border border-nothing-gray rounded-2xl p-5 flex flex-col gap-4 group hover:bg-nothing-black/5 transition-colors relative overflow-hidden cursor-pointer"
        >            <div className="flex justify-between items-start z-10 relative">
                <div className="p-2 bg-nothing-black rounded-lg text-nothing-muted border border-nothing-gray">
                    {part.images && part.images.length > 0 ? (
                        <div className="w-6 h-6 rounded-sm overflow-hidden">
                            <img src={part.images[0].url} alt="" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <ShoppingBag size={18} />
                    )}
                </div>
                <span className="text-[10px] font-mono border border-nothing-gray px-2 py-1 rounded text-nothing-muted uppercase">
                    {part.category}
                </span>
            </div>
            <div className="z-10 relative">
                <h4 className="font-medium text-nothing-white truncate group-hover:text-nothing-red transition-colors">{part.name}</h4>
                <p className="text-xs text-nothing-muted mt-1">{part.supplier}</p>
            </div>

            {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 backdrop-blur-[1px]">
                    <span className="bg-nothing-red text-white text-[10px] px-2 py-1 font-mono uppercase rounded">Out of Stock</span>
                </div>
            )}

            <div className="mt-auto flex justify-between items-center pt-2 z-10 relative">
                <span className="font-mono text-nothing-white">₹{part.price.toLocaleString()}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
                    disabled={isOutOfStock}
                    className={`
                        p-2 rounded-full transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 z-20
                        ${inCartQty ? 'bg-nothing-red text-white' : 'bg-nothing-white text-nothing-black hover:bg-neutral-200'}
                    `}
                    title="Add to Cart"
                >
                    {inCartQty ? (
                        <span className="text-xs font-bold px-1">{inCartQty}</span>
                    ) : (
                        <Plus size={16} />
                    )}
                </button>
            </div>
        </div>
    );
};


const MechanicDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const {
        requests,
        activeJobs,
        marketplace,
        marketplaceMeta,
        stats,
        history,
        cart,
        isInspectionModalOpen,
        isReportModalOpen,
        isHistoryModalOpen,
        loading,
        marketLoading
    } = useSelector((state) => state.mechanic);

    const [activeTab, setActiveTab] = useState('jobs');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [marketPage, setMarketPage] = useState(1);
    const [selectedPart, setSelectedPart] = useState(null);
    useEffect(() => {
        dispatch(fetchAvailableInspections());
        dispatch(fetchActiveInspections());
        dispatch(fetchMechanicMarketplace());
        dispatch(fetchMechanicCart());


    }, [dispatch]);
    useEffect(() => {
        dispatch(fetchMechanicMarketplace(marketPage));
    }, [dispatch, marketPage]);
    const handleAddToCart = (partId) => {
        dispatch(addMechanicCartItem({ productId: partId, quantity: 1 }));
    };
    const refreshData = () => {
        dispatch(fetchAvailableInspections());
        dispatch(fetchActiveInspections());
        if (activeTab === 'market') {
            dispatch(fetchMechanicMarketplace(marketPage));
            dispatch(fetchMechanicCart());
        }
    };

    const getCartQuantity = (productId) => {
        const item = cart.find(i => i.productId === productId);
        return item ? item.quantity : undefined;
    };

    const totalPages = Math.ceil((marketplaceMeta?.total || 0) / (marketplaceMeta?.limit || 10));

    const filteredMarketplace = marketplace.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="min-h-screen bg-nothing-black text-nothing-white selection:bg-nothing-red selection:text-white transition-colors duration-300 flex flex-col">
            <Navbar userName={user?.name || 'Mechanic'} role="Mechanic" />

            {/* Modals */}
            <AnimatePresence>
                {isInspectionModalOpen && <InspectionModal />}
                {isReportModalOpen && <ReportModal />}
                {isCartOpen && <MechanicCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
                {isHistoryModalOpen && <HistoryModal />}
                {selectedPart && <MechanicPartDetailModal part={selectedPart} onClose={() => setSelectedPart(null)} />}

            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">

                {/* Header & Stats */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-medium tracking-tight text-nothing-white">Workbench.</h1>
                            <p className="text-nothing-muted font-light">Manage inspections and order parts.</p>
                        </div>
                        <button
                            onClick={refreshData}
                            className="p-3 rounded-full bg-nothing-dark border border-nothing-gray text-nothing-muted hover:text-white hover:border-white transition-all"
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} className={loading || marketLoading ? 'animate-spin' : ''} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard title="Total Earnings" value={`₹${stats.earnings.toLocaleString()}`} icon={ShoppingBag} />
                        <StatCard title="Jobs Done" value={stats.jobsCompleted} icon={CheckCircle2} />
                        <StatCard title="Rating" value={stats.rating} icon={AlertCircle} />
                        <StatCard title="Pending Req" value={requests.length} icon={Clock} />
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-nothing-gray flex gap-8">
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`pb-4 text-sm font-mono uppercase tracking-widest transition-colors relative ${activeTab === 'jobs' ? 'text-nothing-white' : 'text-nothing-muted hover:text-nothing-white'
                            }`}
                    >
                        Inspections
                        {activeTab === 'jobs' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-nothing-red" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('market')}
                        className={`pb-4 text-sm font-mono uppercase tracking-widest transition-colors relative ${activeTab === 'market' ? 'text-nothing-white' : 'text-nothing-muted hover:text-nothing-white'
                            }`}
                    >
                        Part Market
                        {activeTab === 'market' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-nothing-red" />}
                    </button>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'jobs' ? (
                        <motion.div
                            key="jobs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Active Jobs Section */}
                            {activeJobs.length > 0 && (
                                <div className="space-y-4">
                                    <h2 className="text-lg font-medium flex items-center gap-2 text-nothing-white">
                                        <Wrench size={18} className="text-nothing-muted" />
                                        Active Jobs
                                    </h2>
                                    <div className="space-y-3">
                                        {activeJobs.map(job => (
                                            <ActiveJobCard
                                                key={job.id}
                                                job={job}
                                                onReport={() => dispatch(openReportModal(job.id))}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pending Requests Section */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-medium flex items-center gap-2 text-nothing-white">
                                    <ClipboardCheck size={18} className="text-nothing-muted" />
                                    New Requests
                                </h2>
                                {loading && requests.length === 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-48 bg-nothing-dark border border-nothing-gray rounded-2xl" />
                                        ))}
                                    </div>
                                ) : requests.length === 0 ? (
                                    <div className="p-8 border border-dashed border-nothing-gray rounded-2xl text-center text-nothing-muted font-mono text-sm">
                                        NO PENDING REQUESTS
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {requests.map(req => (
                                            <RequestCard
                                                key={req.id}
                                                request={req}
                                                onClick={() => dispatch(openInspectionModal(req.id))}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* History Section - Small & Compact */}
                            {history.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-nothing-gray/30">
                                    <h2 className="text-sm font-medium flex items-center gap-2 text-nothing-muted uppercase tracking-widest">
                                        <History size={16} /> Past Inspections
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {history.map(job => (
                                            <HistoryCard
                                                key={job.id}
                                                item={job}
                                                onClick={() => dispatch(openHistoryModal(job.id))}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="market"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Search Bar for Parts */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nothing-muted" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for parts, oil, accessories..."
                                    className="w-full bg-nothing-dark border border-nothing-gray rounded-xl py-4 pl-12 pr-4 text-nothing-white outline-none focus:border-nothing-white transition-colors placeholder-nothing-muted"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {marketLoading ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="h-48 bg-nothing-dark rounded-2xl border border-nothing-gray" />
                                    ))}
                                </div>
                            ) : filteredMarketplace.length === 0 ? (
                                <div className="py-12 text-center text-nothing-muted font-mono">
                                    No parts found matching your search.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filteredMarketplace.map(part => (
                                        <PartCard
                                            key={part.id}
                                            part={part}
                                            inCartQty={getCartQuantity(part.id)}
                                            onAddToCart={() => handleAddToCart(part.id)}
                                            onClick={() => setSelectedPart(part)}

                                        />
                                    ))}
                                </div>
                            )}
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <div className="flex items-center gap-2 md:gap-4 bg-nothing-dark border border-nothing-gray rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-lg">
                                        <button
                                            disabled={marketPage === 1}
                                            onClick={() => setMarketPage(p => Math.max(1, p - 1))}
                                            className="p-2 hover:bg-nothing-white/10 rounded-full text-nothing-muted hover:text-white disabled:opacity-30 transition-colors"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        <div className="flex items-center gap-1 px-2">
                                            <span className="text-xs md:text-sm font-mono text-nothing-muted uppercase">Page</span>
                                            <span className="text-sm md:text-base font-medium text-nothing-white min-w-[1.5rem] text-center">{marketPage}</span>
                                            <span className="text-xs md:text-sm font-mono text-nothing-muted">/ {totalPages}</span>
                                        </div>

                                        <button
                                            disabled={marketPage === totalPages}
                                            onClick={() => setMarketPage(p => Math.min(totalPages, p + 1))}
                                            className="p-2 hover:bg-nothing-white/10 rounded-full text-nothing-muted hover:text-white disabled:opacity-30 transition-colors"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* FAB for Mechanic Cart */}
                <AnimatePresence>
                    {cart.length > 0 && activeTab === 'market' && (
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

export default MechanicDashboard;