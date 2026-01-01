import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Bell, Check, X, Info, AlertTriangle, Bike } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { markAllNotificationsRead, clearNotifications } from '../../store/slices/uiSlice';
import ThemeToggle from './ThemeToggle';
import Button from './Button';


const Navbar = ({ userName, role, onProfileClick }) => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.ui);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const notificationRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    if (!showNotifications && unreadCount > 0) {
      dispatch(markAllNotificationsRead());
    }
    setShowNotifications(!showNotifications);
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setShowLogoutConfirm(false);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 w-full bg-nothing-black/80 backdrop-blur-md border-b border-nothing-gray"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Profile / Brand Section */}
          <button
            onClick={onProfileClick}
            className="flex items-center gap-4 group hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-nothing-red rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="font-mono font-bold text-white text-xs">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium leading-none tracking-tight text-nothing-white group-hover:text-nothing-red transition-colors">
                {userName}
              </span>
              <span className="text-[10px] font-mono text-nothing-muted uppercase tracking-widest transition-colors">
                Bike Yard
              </span>
            </div>
          </button>

          <div className="flex items-center gap-6">
            <ThemeToggle className="relative" />

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={handleToggleNotifications}
                className="relative group p-2 hover:bg-nothing-white/5 rounded-full transition-colors"
              >
                <Bell size={20} className={`transition-colors ${showNotifications ? 'text-nothing-white' : 'text-nothing-muted group-hover:text-nothing-white'}`} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-nothing-red rounded-full border border-nothing-black animate-pulse" />
                )}
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-nothing-dark border border-nothing-gray rounded-2xl shadow-2xl overflow-hidden origin-top-right"
                  >
                    <div className="p-3 border-b border-nothing-gray bg-nothing-black/50 flex justify-between items-center">
                      <span className="text-xs font-mono uppercase text-nothing-muted tracking-widest">Notifications</span>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => dispatch(clearNotifications())}
                          className="text-[10px] text-nothing-muted hover:text-nothing-red transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-nothing-muted flex flex-col items-center gap-2">
                          <Bell size={24} className="opacity-20" />
                          <span className="text-xs font-mono uppercase tracking-widest">No new updates</span>
                        </div>
                      ) : (
                        <div>
                          {notifications.map((n) => (
                            <div key={n.id} className="p-4 border-b border-nothing-gray last:border-0 hover:bg-nothing-white/5 transition-colors relative">
                              <div className="flex gap-3">
                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.type === 'success' ? 'bg-green-500' : 'bg-nothing-red'}`} />
                                <div>
                                  <h4 className="text-sm font-medium text-nothing-white leading-tight">{n.title}</h4>
                                  <p className="text-xs text-nothing-muted mt-1 leading-relaxed">{n.message}</p>
                                  <p className="text-[10px] font-mono text-nothing-muted/50 mt-2">{formatTime(n.timestamp)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 w-px bg-nothing-gray" />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 rounded-full hover:bg-nothing-gray transition-colors text-nothing-muted hover:text-nothing-white"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-nothing-black/90 backdrop-blur-sm"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="relative bg-nothing-dark border border-nothing-gray w-full max-w-sm rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-nothing-black border border-nothing-gray flex items-center justify-center mb-6 text-nothing-red">
                <LogOut size={24} />
              </div>

              <h3 className="text-2xl font-medium text-nothing-white tracking-tight mb-2">
                Sign Out?
              </h3>
              <p className="text-nothing-muted text-sm leading-relaxed mb-8">
                Are you sure you want to end your session?
              </p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-6 rounded-full border border-nothing-gray text-nothing-white hover:bg-white/5 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 py-3 px-6 rounded-full bg-nothing-red text-white hover:bg-[#b0141b] transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;