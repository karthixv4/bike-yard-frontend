import React from 'react';
import { motion } from 'framer-motion';
import { Bike, Wrench, ShieldCheck, ShoppingBag, ArrowRight, Activity, Search, Zap, Layers, BarChart3 } from 'lucide-react';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';
import DemoCredentials from '../common/DemoCredentials';

const MarqueeItem = ({ text }) => (
    <div className="flex items-center gap-4 mx-4">
        <div className="w-2 h-2 bg-nothing-red rounded-full" />
        <span className="text-xs font-mono uppercase tracking-widest text-nothing-white whitespace-nowrap">
            {text}
        </span>
    </div>
);

const FeatureCard = ({ title, desc, icon: Icon, className, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className={`bg-nothing-dark border border-nothing-gray rounded-3xl overflow-hidden relative group hover:border-nothing-white/30 transition-colors p-8 flex flex-col ${className}`}
        >
            <div className="absolute inset-0 opacity-10 bg-grid-pattern pointer-events-none" />
            <div className="relative z-10 flex-1 flex flex-col items-start justify-between h-full">
                <div className="w-14 h-14 bg-nothing-black border border-nothing-gray rounded-2xl flex items-center justify-center mb-6 text-nothing-muted group-hover:text-nothing-red group-hover:border-nothing-red transition-all duration-300 shadow-lg">
                    <Icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                    <h3 className="text-2xl font-medium tracking-tight text-nothing-white mb-3">{title}</h3>
                    <p className="text-nothing-muted text-sm leading-relaxed">{desc}</p>
                </div>
            </div>
        </motion.div>
    );
};

const LandingPage = ({ onGetStarted, onLogin }) => {
    return (
        <div className="min-h-screen bg-nothing-black text-nothing-white font-sans selection:bg-nothing-red selection:text-white overflow-x-hidden transition-colors duration-300">
            <DemoCredentials />
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-nothing-black/80 backdrop-blur-md border-b border-nothing-gray transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-nothing-red rounded-lg flex items-center justify-center">
                            <Bike size={20} className="text-white" />
                        </div>
                        <span className="font-medium tracking-tight text-lg text-nothing-white">Bike Yard</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <ThemeToggle className="relative" />
                        <button
                            onClick={onLogin}
                            className="text-sm font-mono text-nothing-muted hover:text-nothing-white uppercase tracking-widest transition-colors hidden md:block"
                        >
                            Login
                        </button>
                        <Button onClick={onGetStarted} className="px-6 py-2 h-10 text-sm">
                            Enter Garage
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                    {/* Hero Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="space-y-8 relative z-20"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-nothing-gray bg-nothing-dark/50 backdrop-blur-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-mono text-nothing-muted uppercase tracking-widest">System Online v2.0</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.9] text-nothing-white">
                            RIDE.<br />
                            REPAIR.<br />
                            <span className="text-nothing-red">RESELL.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-nothing-muted max-w-md leading-relaxed font-light">
                            The complete ecosystem for your machine. Buy verified refurbished bikes, source genuine parts, and book expert mechanics.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button onClick={onGetStarted} withArrow className="text-lg px-8 py-4">
                                Get Started
                            </Button>
                            <button
                                onClick={onLogin}
                                className="px-8 py-4 rounded-full border border-nothing-gray text-nothing-white hover:bg-nothing-white/5 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                Seller Login
                            </button>
                        </div>
                    </motion.div>

                    {/* Hero Visual - Static Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative h-[400px] md:h-[600px] flex items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-nothing-red/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&q=80"
                                alt="Motorcycle Frame"
                                className="w-full h-full object-contain drop-shadow-2xl grayscale contrast-125 opacity-90"
                            />

                            {/* Decorative Overlay Points */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute top-1/4 left-10 bg-nothing-dark/90 backdrop-blur border border-nothing-gray p-3 rounded-xl shadow-xl"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Activity size={14} className="text-nothing-red" />
                                    <span className="text-[10px] font-mono uppercase text-nothing-white">Engine Health</span>
                                </div>
                                <div className="w-24 h-1 bg-nothing-gray rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[92%]" />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                                className="absolute bottom-1/3 right-10 bg-nothing-dark/90 backdrop-blur border border-nothing-gray p-3 rounded-xl shadow-xl"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <ShieldCheck size={14} className="text-nothing-red" />
                                    <span className="text-[10px] font-mono uppercase text-nothing-white">Verified</span>
                                </div>
                                <span className="text-xs text-nothing-muted">50-Point Check Passed</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Live Ticker */}
            <div className="w-full bg-nothing-dark border-y border-nothing-gray py-3 overflow-hidden flex">
                <div className="animate-marquee flex items-center">
                    <MarqueeItem text="Royal Enfield Classic 350 - JUST SOLD" />
                    <MarqueeItem text="New Mechanic Request: Mumbai - ACCEPTED" />
                    <MarqueeItem text="Brembo Brake Pads - LOW STOCK" />
                    <MarqueeItem text="KTM Duke 390 - INSPECTION COMPLETED" />
                    <MarqueeItem text="Triumph Speed 400 - LISTED NOW" />
                    <MarqueeItem text="Motul 7100 10W50 - RESTOCKED" />
                    <MarqueeItem text="Harley-Davidson X440 - INSPECTION PENDING" />
                    <MarqueeItem text="Royal Enfield Classic 350 - JUST SOLD" />
                    <MarqueeItem text="New Mechanic Request: Mumbai - ACCEPTED" />
                    <MarqueeItem text="Brembo Brake Pads - LOW STOCK" />
                </div>
            </div>

            {/* Bento Grid Features */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-4xl font-medium tracking-tighter mb-4 text-nothing-white">The Garage Ecosystem.</h2>
                    <p className="text-nothing-muted max-w-xl text-lg font-light">Everything you need to keep moving. Connected in one platform.</p>
                </div>

                {/* 
           Grid Layout: All standard cards now
        */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">

                    {/* Card 1: Marketplace (Spans 2 cols) */}
                    <FeatureCard
                        className="md:col-span-2"
                        title="Marketplace"
                        desc="Buy and sell verified refurbished bikes. No spam, just serious machines. Browse listings with complete transparency."
                        icon={ShoppingBag}
                        delay={0.1}
                    />

                    {/* Card 2: Mechanics */}
                    <FeatureCard
                        title="Expert Mechanics"
                        desc="Book inspections or repairs. Mobile service available at your doorstep."
                        icon={Wrench}
                        delay={0.2}
                    />

                    {/* Card 3: Parts */}
                    <FeatureCard
                        title="Genuine Parts"
                        desc="Source hard-to-find spares directly from verified suppliers."
                        icon={Zap}
                        delay={0.3}
                    />

                    {/* Card 4: Certified (Spans 2 cols) */}
                    <FeatureCard
                        className="md:col-span-2"
                        title="Certified Inspections"
                        desc="Get a comprehensive 50-point health report before you buy. Transparency is key to a good ride."
                        icon={ShieldCheck}
                        delay={0.4}
                    />
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-nothing-dark border-t border-nothing-gray transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {[
                        { label: 'Active Riders', value: '12k+' },
                        { label: 'Bikes Sold', value: '850+' },
                        { label: 'Mechanics', value: '400+' },
                        { label: 'Cities', value: '12' },
                    ].map((stat, idx) => (
                        <div key={idx} className="space-y-2">
                            <h3 className="text-4xl md:text-5xl font-medium tracking-tighter text-nothing-white transition-colors">{stat.value}</h3>
                            <p className="text-sm font-mono text-nothing-muted uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-32 px-6 text-center">
                <h2 className="text-5xl md:text-7xl font-medium tracking-tighter mb-8 text-nothing-white">
                    Ready to <span className="text-nothing-red">Ride?</span>
                </h2>
                <Button onClick={onGetStarted} className="mx-auto text-lg px-10 py-5 h-auto">
                    Enter Garage
                </Button>
            </section>

            {/* Footer */}
            <footer className="border-t border-nothing-gray py-12 bg-nothing-black transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Bike size={20} className="text-nothing-red" />
                        <span className="font-medium tracking-tight text-nothing-white">Bike Yard</span>
                    </div>
                    <p className="text-xs text-nothing-muted font-mono">© 2026 Bike Yard. Engineered for Riders.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;