import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Copy, ChevronDown, User, Wrench, ShoppingBag, Bike } from 'lucide-react';

const credentials = [
    {
        role: 'Rider (With Garage)',
        email: 'vignesh@gmail.com',
        pass: '123456',
        icon: User,
        color: 'text-purple-600 dark:text-purple-400'
    },
    {
        role: 'Rider (No Bike)',
        email: 'newuser@gmail.com',
        pass: '123456',
        icon: Bike,
        color: 'text-nothing-red'
    },
    {
        role: 'Seller',
        email: 'seller@gmail.com',
        pass: '123456',
        icon: ShoppingBag,
        color: 'text-blue-600 dark:text-blue-400'
    },
    {
        role: 'Mechanic',
        email: 'mechanic@gmail.com',
        pass: '123456',
        icon: Wrench,
        color: 'text-yellow-600 dark:text-yellow-400'
    },
];

const DemoCredentials = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [copied, setCopied] = useState(null);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="fixed bottom-6 left-6 z-[100] font-sans">
            <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-nothing-dark/95 backdrop-blur-xl border border-nothing-gray rounded-2xl shadow-2xl w-80 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-nothing-gray flex justify-between items-start bg-nothing-black/50">
                            <div>
                                <h3 className="text-sm font-medium text-nothing-white flex items-center gap-2">
                                    <Key size={16} className="text-nothing-red" />
                                    Explorer Access
                                </h3>
                                <p className="text-[10px] text-nothing-muted mt-1 leading-relaxed">
                                    Use these pre-filled accounts to explore the ecosystem features instantly.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-nothing-muted hover:text-nothing-white transition-colors"
                            >
                                <ChevronDown size={18} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="p-2">
                            {credentials.map((cred) => (
                                <div key={cred.role} className="group flex items-center justify-between p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-nothing-black border border-nothing-gray ${cred.color}`}>
                                            <cred.icon size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-nothing-white">{cred.role}</p>
                                            <p className="text-[10px] font-mono text-nothing-muted">{cred.email}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleCopy(cred.email)}
                                        className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-nothing-muted hover:text-nothing-white transition-colors relative"
                                        title="Copy Email"
                                    >
                                        {copied === cred.email ? (
                                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 font-bold text-[10px]">
                                                COPIED
                                            </motion.span>
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 bg-nothing-black/30 text-center border-t border-nothing-gray">
                            <p className="text-[10px] text-nothing-muted italic">
                                Password for all: <span className="font-mono text-nothing-white">123456</span>
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 px-4 py-3 bg-nothing-red text-white rounded-full shadow-lg shadow-nothing-red/20 font-medium text-sm"
                    >
                        <Key size={16} /> Demo Accounts
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DemoCredentials;