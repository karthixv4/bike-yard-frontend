import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { closeDetailedTour, nextDetailedTourStep, prevDetailedTourStep } from '../../store/slices/buyerSlice';
import { ArrowRight, ArrowLeft, X, Map } from 'lucide-react';
import Button from '../common/Button';

// Step Definition
const STEPS = [
    {
        targetId: 'tab-home',
        title: "Home Base",
        description: "Your personalized feed. Discover new bike arrivals and essential parts curated just for you."
    },
    {
        targetId: 'tab-market',
        title: "Marketplace",
        description: "Browse the full catalog. From vintage cruisers to high-performance spares, find exactly what you need."
    },
    {
        targetId: 'tab-garage',
        title: "My Garage",
        description: "The heart of your experience. Add your bike to get tailored service recommendations and easy maintenance booking."
    },
    {
        targetId: 'tab-activity',
        title: "Activity Hub",
        description: "Track your orders and service requests in real-time. Stay updated on mechanic inspections."
    },
    {
        targetId: 'tab-profile',
        title: "Your Profile",
        description: "Manage your account details, shipping addresses, and preferences."
    }
];

const UserDashboardTour = () => {
    const dispatch = useDispatch();
    const { tour } = useSelector((state) => state.buyer);
    const [targetRect, setTargetRect] = useState(null);
    const [tooltipStyle, setTooltipStyle] = useState({});

    useEffect(() => {
        if (!tour.isOpen) return;

        const updatePosition = () => {
            const step = STEPS[tour.step];
            const element = document.getElementById(step.targetId);

            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);

                // Calculate Tooltip Position (Centered below the target)
                const left = rect.left + (rect.width / 2) - 150; // Center 300px tooltip
                // Ensure it stays within viewport bounds horizontally
                const safeLeft = Math.max(20, Math.min(window.innerWidth - 320, left));

                setTooltipStyle({
                    top: rect.bottom + 20,
                    left: safeLeft,
                });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [tour.isOpen, tour.step]);

    if (!tour.isOpen) return null;

    const currentStepData = STEPS[tour.step];
    const isLastStep = tour.step === STEPS.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            dispatch(closeDetailedTour());
        } else {
            dispatch(nextDetailedTourStep());
        }
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-auto">
            {/* Dark Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
            />

            {/* Target Highlight (Spotlight Box) */}
            {targetRect && (
                <motion.div
                    layoutId="tour-spotlight"
                    initial={{
                        top: targetRect.top,
                        left: targetRect.left,
                        width: targetRect.width,
                        height: targetRect.height,
                        opacity: 0
                    }}
                    animate={{
                        top: targetRect.top - 8, // Padding
                        left: targetRect.left - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16,
                        opacity: 1
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute border-2 border-nothing-red rounded-lg bg-white/5 shadow-[0_0_30px_rgba(215,25,33,0.3)] pointer-events-none z-10"
                />
            )}

            {/* Tooltip Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={tour.step}
                    style={tooltipStyle}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute w-[300px] md:w-[350px] bg-nothing-dark border border-nothing-gray rounded-2xl p-6 shadow-2xl z-20"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-nothing-red">
                            <Map size={18} />
                            <span className="text-[10px] font-mono uppercase tracking-widest">
                                Step {tour.step + 1}/{STEPS.length}
                            </span>
                        </div>
                        <button
                            onClick={() => dispatch(closeDetailedTour())}
                            className="text-nothing-muted hover:text-white transition-colors"
                            title="End Tour"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <h3 className="text-xl font-medium text-nothing-white mb-2">{currentStepData.title}</h3>
                    <p className="text-sm text-nothing-muted leading-relaxed mb-6">
                        {currentStepData.description}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-nothing-gray">
                        <button
                            onClick={() => dispatch(prevDetailedTourStep())}
                            disabled={tour.step === 0}
                            className="p-2 rounded-full hover:bg-nothing-white/10 text-nothing-muted hover:text-white disabled:opacity-0 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div className="flex gap-2">
                            {STEPS.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === tour.step ? 'bg-nothing-red' : 'bg-nothing-gray'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-4 py-2 bg-nothing-white text-nothing-black rounded-full text-xs font-bold hover:bg-neutral-200 transition-colors"
                        >
                            {isLastStep ? "Finish" : "Next"}
                            {isLastStep ? null : <ArrowRight size={14} />}
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default UserDashboardTour;