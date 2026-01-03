import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { markWelcomeTourSeen, closeWelcomeModal } from '../../store/slices/uiSlice';
import { startDetailedTour } from '../../store/slices/buyerSlice';

import Button from './Button';
import {
    Bike,
    Wrench,
    ShoppingBag,
    ShieldCheck,
    Zap,
    ClipboardCheck,
    TrendingUp,
    Package,
    FileText,
    ArrowRight,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    X,
    Map
} from 'lucide-react';


const WelcomeFeatureModal = () => {
    const dispatch = useDispatch();
    const { welcomeTourSeen, isWelcomeModalOpen } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth);
    const { garage } = useSelector((state) => state.buyer);

    const [isVisible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right

    useEffect(() => {
        if (!isVisible || isPaused) return;

        const timer = setInterval(() => {
            handleNext();
        }, 6000);

        return () => clearInterval(timer);
    }, [isVisible, isPaused, currentIndex]);

    useEffect(() => {
        if (isWelcomeModalOpen) {
            setIsVisible(true);
            setCurrentIndex(0);
            return;
        }

        if (user && !welcomeTourSeen) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isWelcomeModalOpen, welcomeTourSeen, user]);

    // --- Content Definition ---
    const getSlides = () => {
        const role = user?.role;

        // 1. Mechanic
        if (role === 'mechanic') {
            return [
                {
                    id: 'mech-1', icon: ClipboardCheck, color: 'text-yellow-500',
                    title: "Gig Marketplace", subtitle: "FIND WORK",
                    description: "Browse live inspection and service requests from riders in your area. Review the bike model, issue, and offer price before accepting."
                },
                {
                    id: 'mech-2', icon: FileText, color: 'text-blue-500',
                    title: "Digital Reporting", subtitle: "GO PAPERLESS",
                    description: "Fill out standardized 50-point inspection reports directly on your dashboard. Generate professional certificates instantly."
                },
                {
                    id: 'mech-3', icon: ShoppingBag, color: 'text-nothing-red',
                    title: "Mechanic Pricing", subtitle: "B2B STORE",
                    description: "Access the Parts Market with exclusive B2B pricing to source components for your repair jobs."
                },
                {
                    id: 'mech-4', icon: TrendingUp, color: 'text-green-500',
                    title: "Grow Your Shop", subtitle: "ANALYTICS",
                    description: "Track your completed jobs, earnings, and customer ratings to build a verified profile."
                }
            ];
        }

        // 2. Seller
        if (role === 'seller') {
            return [
                {
                    id: 'sell-1', icon: Package, color: 'text-nothing-red',
                    title: "Inventory Command", subtitle: "MANAGE STOCK",
                    description: "List refurbished bikes and spare parts effortlessly. Manage pricing, specs, and photos in one centralized hub."
                },
                {
                    id: 'sell-2', icon: ShieldCheck, color: 'text-blue-500',
                    title: "Verified Listings", subtitle: "BUILD TRUST",
                    description: "Link mechanic inspection reports to your bike listings to sell faster and at better prices."
                },
                {
                    id: 'sell-3', icon: TrendingUp, color: 'text-green-500',
                    title: "Sales Analytics", subtitle: "TRACK GROWTH",
                    description: "Monitor your revenue, order volume, and top-performing items with real-time charts."
                },
                {
                    id: 'sell-4', icon: Zap, color: 'text-yellow-500',
                    title: "Fast Fulfillment", subtitle: "ORDER MANAGEMENT",
                    description: "Process orders, print labels, and update shipping statuses to keep your customers happy."
                }
            ];
        }

        // 3. Rider (With Bike)
        if (garage && garage.length > 0) {
            const bikeName = `${garage[0].brand} ${garage[0].model}`;
            return [
                {
                    id: 'rider-bike-1', icon: Wrench, color: 'text-nothing-red',
                    title: "Instant Service", subtitle: `FOR YOUR ${bikeName.toUpperCase()}`,
                    description: "Request a wash, general service, or repair specifically for your bike. Local mechanics come to you."
                },
                {
                    id: 'rider-bike-2', icon: Zap, color: 'text-yellow-500',
                    title: "Curated Parts", subtitle: "GUARANTEED FIT",
                    description: "Stop guessing. See only the parts and accessories that are compatible with your garage."
                },
                {
                    id: 'rider-bike-3', icon: ShieldCheck, color: 'text-blue-500',
                    title: "Expert Inspections", subtitle: "BUYING & SELLING",
                    description: "Buying a used bike? Order a 50-point inspection from a verified mechanic before you pay."
                },
                {
                    id: 'rider-bike-4', icon: Package, color: 'text-green-500',
                    title: "Track Everything", subtitle: "REAL-TIME UPDATES",
                    description: "Monitor the status of your service requests, parts orders, and inspections in real-time."
                }
            ];
        }

        // 4. Rider (No Bike / New)
        return [
            {
                id: 'rider-new-1', icon: Bike, color: 'text-nothing-red',
                title: "Digital Garage", subtitle: "ONBOARDING",
                description: "Add your bike details to the 'My Garage' section to unlock personalized service recommendations."
            },
            {
                id: 'rider-new-2', icon: ShieldCheck, color: 'text-blue-500',
                title: "Buy Refurbished", subtitle: "VERIFIED MARKETPLACE",
                description: "Browse our marketplace of refurbished bikes. Every listing comes with a mechanic's health report."
            },
            {
                id: 'rider-new-3', icon: Wrench, color: 'text-yellow-500',
                title: "Book Mechanics", subtitle: "ON-DEMAND",
                description: "Need a checkup? Post a request and get offers from top-rated mechanics in your city."
            },
            {
                id: 'rider-new-4', icon: ShoppingBag, color: 'text-green-500',
                title: "Premium Gear", subtitle: "SHOPPING",
                description: "Explore high-quality riding gear, helmets, and universal accessories delivered to your door."
            }
        ];
    };

    const slides = getSlides();
    const currentSlide = slides[currentIndex];
    const isUser = user?.role === 'user';

    const handleNext = () => {
        setDirection(1);
        if (currentIndex === slides.length - 1) {
            if (!isUser) {
                handleClose();
            }
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        setDirection(-1);
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };
    const handleStartDetailedTour = () => {
        handleClose();
        dispatch(startDetailedTour());
    };
    const handleClose = () => {
        setIsVisible(false);
        dispatch(markWelcomeTourSeen());
        dispatch(closeWelcomeModal());
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className="relative w-full max-w-4xl bg-nothing-dark border border-nothing-gray rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px] md:h-[550px]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Background Noise Texture */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />

                {/* --- LEFT SIDE: Visuals --- */}
                <div className="w-full md:w-1/2 relative bg-black/40 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-nothing-gray h-[250px] md:h-auto">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: direction > 0 ? -100 : 100, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="relative z-10 flex flex-col items-center justify-center"
                        >
                            <div className={`p-8 rounded-3xl bg-nothing-dark border border-nothing-gray shadow-2xl mb-6 ${currentSlide.color}`}>
                                <currentSlide.icon size={80} strokeWidth={1} />
                            </div>
                            {/* Decorative Elements */}
                            <motion.div
                                className={`absolute inset-0 blur-[80px] opacity-20 z-[-1] ${currentSlide.color.replace('text-', 'bg-')}`}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Role Label */}
                    <div className="absolute top-6 left-6 px-3 py-1 bg-black/50 backdrop-blur border border-nothing-gray rounded-full">
                        <span className="text-[10px] font-mono uppercase text-nothing-muted tracking-widest">
                            {user?.role === 'user' && garage.length > 0 ? 'Rider + Garage' : (user?.role || 'Guest').toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* --- RIGHT SIDE: Content --- */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative z-10">

                    {/* Top: Progress Bars */}
                    <div className="flex gap-2 mb-8">
                        {slides.map((_, idx) => (
                            <div key={idx} className="h-1 flex-1 bg-nothing-gray rounded-full overflow-hidden relative">
                                <motion.div
                                    className={`absolute inset-0 bg-nothing-red`}
                                    initial={{ width: idx < currentIndex ? "100%" : "0%" }}
                                    animate={{
                                        width: idx < currentIndex ? "100%" :
                                            idx === currentIndex ? (isPaused ? "100%" : "100%") : "0%"
                                    }}
                                    transition={idx === currentIndex && !isPaused ? { duration: 6, ease: "linear" } : { duration: 0 }}
                                />
                                {idx === currentIndex && !isPaused && (
                                    <motion.div
                                        className="absolute top-0 left-0 bottom-0 bg-nothing-white"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 6, ease: "linear" }}
                                    />
                                )}
                                {/* Static filled state for passed slides */}
                                {idx < currentIndex && <div className="absolute inset-0 bg-nothing-white" />}
                            </div>
                        ))}
                    </div>

                    {/* Middle: Text Content */}
                    <div className="flex-1 flex flex-col justify-center space-y-6">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-8 h-px bg-nothing-red"></span>
                                    <span className={`text-xs font-mono uppercase tracking-[0.2em] ${currentSlide.color}`}>
                                        {currentSlide.subtitle}
                                    </span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-nothing-white mb-6 leading-[1.1]">
                                    {currentSlide.title}
                                </h2>
                                <p className="text-lg text-nothing-muted font-light leading-relaxed">
                                    {currentSlide.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom: Controls */}
                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-nothing-gray/30">
                        <button
                            onClick={handleClose}
                            className="text-xs font-mono text-nothing-muted hover:text-nothing-white transition-colors uppercase tracking-widest"
                        >
                            Close
                        </button>

                        <div className="flex gap-4">
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className="w-12 h-12 rounded-full border border-nothing-gray flex items-center justify-center text-nothing-white hover:bg-nothing-white hover:text-black transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-nothing-white"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            {/* Dynamic Next Button */}
                            {currentIndex === slides.length - 1 && isUser ? (
                                <Button onClick={handleStartDetailedTour} className="h-12 px-6 bg-nothing-white text-nothing-black hover:bg-neutral-200 shadow-none border border-transparent">
                                    <span className="flex items-center gap-2">
                                        <Map size={18} />
                                        Dashboard Tour
                                    </span>
                                </Button>
                            ) : (
                                <Button onClick={handleNext} className="h-12 px-6">
                                    {currentIndex === slides.length - 1 ? "Finish" : "Next"}
                                    {currentIndex === slides.length - 1 ? <CheckCircle2 className="ml-2" size={18} /> : <ArrowRight className="ml-2" size={18} />}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Close Button Top Right */}
                    <button
                        onClick={handleClose}
                        className="absolute top-6 right-6 p-2 text-nothing-muted hover:text-white transition-colors md:hidden"
                    >
                        <X size={24} />
                    </button>

                </div>
            </motion.div>
        </div>
    );
};

export default WelcomeFeatureModal;