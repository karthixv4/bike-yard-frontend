import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { openInspectionModal, openReportModal, orderPart, fetchAvailableInspections, fetchActiveInspections } from '../../store/slices/mechanicSlice';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import InspectionModal from './InspectionModal';
import ReportModal from './ReportModal';
import Footer from '../common/Footer';
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
    RefreshCw
} from 'lucide-react';

// --- Sub Components ---

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
                    <span className="flex items-center gap-1"><MapPin size={14} /> {request.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {request.date}</span>
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

const PartCard = ({ part, onOrder }) => (
    <div className="bg-nothing-dark border border-nothing-gray rounded-2xl p-5 flex flex-col gap-4 group hover:bg-nothing-black/5 transition-colors">
        <div className="flex justify-between items-start">
            <div className="p-2 bg-nothing-black rounded-lg text-nothing-muted">
                <ShoppingBag size={18} />
            </div>
            <span className="text-[10px] font-mono border border-nothing-gray px-2 py-1 rounded text-nothing-muted uppercase">
                {part.category}
            </span>
        </div>
        <div>
            <h4 className="font-medium text-nothing-white truncate">{part.title}</h4>
            <p className="text-xs text-nothing-muted mt-1">{part.supplier}</p>
        </div>
        <div className="mt-auto flex justify-between items-center pt-2">
            <span className="font-mono text-nothing-white">₹{part.price}</span>
            <button
                onClick={onOrder}
                className="p-2 bg-nothing-white text-nothing-black rounded-full hover:bg-neutral-200 transition-colors active:scale-95"
            >
                <PlusIcon />
            </button>
        </div>
    </div>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);


const MechanicDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const {
        requests,
        activeJobs,
        marketplace,
        stats,
        isInspectionModalOpen,
        isReportModalOpen,
        loading
    } = useSelector((state) => state.mechanic);

    const [activeTab, setActiveTab] = useState('jobs');

    useEffect(() => {
        dispatch(fetchAvailableInspections());
        dispatch(fetchActiveInspections());
    }, [dispatch]);

    const handleOrder = (partName) => {
        alert(`Order placed for ${partName}`);
        // Dispatch order action here
    };
    const refreshData = () => {
        dispatch(fetchAvailableInspections());
        dispatch(fetchActiveInspections());
    };


    return (
        <div className="min-h-screen bg-nothing-black text-nothing-white selection:bg-nothing-red selection:text-white transition-colors duration-300 flex flex-col">
            <Navbar userName={user?.name || 'Mechanic'} role="Mechanic" />

            {/* Modals */}
            <AnimatePresence>
                {isInspectionModalOpen && <InspectionModal />}
                {isReportModalOpen && <ReportModal />}
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
                            title="Refresh Gigs"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
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
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {marketplace.map(part => (
                                    <PartCard
                                        key={part.id}
                                        part={part}
                                        onOrder={() => handleOrder(part.name)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
            <Footer />
        </div>
    );
};

export default MechanicDashboard;