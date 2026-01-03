import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { requestInspection, fetchInspectionDetail, addItemToCart, removeItemFromCart } from '../../store/slices/buyerSlice';
import { setLoader, openStatusModal } from '../../store/slices/uiSlice';
import { X, Calendar, MapPin, Gauge, ShieldCheck, ChevronLeft, ChevronRight, ZoomIn, AlertTriangle, Sparkles, ThumbsUp, Check, Clock, Wrench, ShoppingBag, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
// Mock Images for Carousel
const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&q=80',
  'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=1200&q=80',
  'https://images.unsplash.com/photo-1558980394-a3099ed53abb?w=1200&q=80'
];
const BikeDetailModal = ({ bike, onClose }) => {

  const dispatch = useDispatch();
  const { inspections, cart } = useSelector((state) => state.buyer);
  const [mode, setMode] = useState('details');
  const [offerAmount, setOfferAmount] = useState('');
  // New Fields for Inspection
  const [message, setMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  // Check if an inspection already exists for this bike, ignoring cancelled ones
  const existingInspection = inspections.find(i => i.bikeId === bike.id && i.status !== 'CANCELLED');
  // Check cart using productId
  const inCart = cart.find(item => item.productId === bike.id);

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Calculate minimum date (Tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  // Resolve Images
  const bikeImages = bike.images && bike.images.length > 0
    ? bike.images.map((img) => img.url)
    : [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&q=80',
      'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=1200&q=80'
    ];

  // Auto Scroll
  useEffect(() => {
    if (isZoomed) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % bikeImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isZoomed, bikeImages.length]);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev + 1) % bikeImages.length);
  };


  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev - 1 + bikeImages.length) % bikeImages.length);
  };

  const handleAddToCart = () => {
    dispatch(addItemToCart({ productId: bike.id, quantity: 1 })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(openStatusModal({
          type: 'success',
          title: 'Added to Cart',
          message: 'Bike has been added to your cart.',
          actionLabel: 'Keep Browsing'
        }));
      }
    });
  };

  const handleRemoveFromCart = () => {
    if (inCart) {
      dispatch(removeItemFromCart(inCart.id));
    }
  };
  const handleViewInspection = () => {
    if (existingInspection) {
      dispatch(fetchInspectionDetail(existingInspection.id));
    }
  };
  const handleRequestInspection = () => {
    if (!offerAmount) {
      dispatch(openStatusModal({ type: 'error', title: 'Missing Offer', message: 'Please enter an offer amount.' }));
      return;
    }
    if (Number(offerAmount) < 500) {
      dispatch(openStatusModal({ type: 'error', title: 'Offer Too Low', message: 'Minimum offer amount is ₹500.' }));
      return;
    }
    if (!scheduledDate) {
      dispatch(openStatusModal({ type: 'error', title: 'Select Date', message: 'Please select a preferred inspection date.' }));
      return;
    }

    dispatch(requestInspection({
      productId: bike.id,
      offerAmount: Number(offerAmount),
      scheduledDate,
      message
    })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        onClose();
      }
    });
  };


  // Helper for Condition Styling
  const getConditionStyles = (condition) => {
    // Normalize input from backend
    const normalized = condition.toUpperCase().replace(' ', '_');

    switch (normalized) {
      case 'MINT':
        return {
          label: 'Mint Condition',
          style: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
          icon: Sparkles
        };
      case 'NEEDS_WORK':
        return {
          label: 'Needs Work',
          style: 'text-nothing-red border-nothing-red/30 bg-nothing-red/10',
          icon: AlertTriangle
        };
      case 'GOOD':
      default:
        return {
          label: 'Good Condition',
          style: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
          icon: ThumbsUp
        };
    }
  };

  const conditionData = getConditionStyles(bike.condition);
  const ConditionIcon = conditionData.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-nothing-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Zoom Lightbox */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <button className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full">
              <X size={24} />
            </button>
            <img
              src={bikeImages[currentImageIndex]}
              alt="Zoomed"
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layoutId={`bike-${bike.id}`}
        className="relative bg-nothing-dark border border-nothing-gray w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[650px]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md"
        >
          <X size={20} className="text-white" />
        </button>

        {/* Left: Image Carousel */}
        <div className="w-full md:w-1/2 bg-neutral-900 relative h-48 md:h-full group shrink-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={bikeImages[currentImageIndex]}
              alt="Bike"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none md:hidden" />

          {/* Overlay Info */}
          <div className="absolute bottom-6 left-6 z-10 text-white">
            <h2 className="text-xl md:text-2xl font-medium tracking-tighter truncate max-w-[80%]">{bike.title}</h2>
            <p className="text-lg md:text-xl font-mono opacity-80">₹{bike.price.toLocaleString()}</p>
          </div>

          {/* Controls - Always visible on mobile, hover on desktop */}
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
            <button onClick={handlePrevImage} className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 pointer-events-auto shadow-lg"><ChevronLeft /></button>
            <button onClick={handleNextImage} className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 pointer-events-auto shadow-lg"><ChevronRight /></button>
          </div>

          {/* Zoom Trigger */}
          <button
            onClick={() => setIsZoomed(true)}
            className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20"
          >
            <ZoomIn size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            {bikeImages.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Content & Actions */}
        <div className="w-full md:w-1/2 flex flex-col bg-nothing-dark flex-1 min-h-0">

          {/* Tab/Header */}
          <div className="flex border-b border-nothing-gray shrink-0">
            <button
              onClick={() => setMode('details')}
              className={`flex-1 py-4 text-xs font-mono uppercase tracking-widest transition-colors ${mode === 'details'
                ? 'bg-nothing-white/10 text-nothing-white border-b-2 border-nothing-red'
                : 'text-nothing-muted hover:text-nothing-white'
                }`}
            >
              Specs
            </button>
            <button
              onClick={() => setMode('inspect')}
              className={`flex-1 py-4 text-xs font-mono uppercase tracking-widest transition-colors ${mode === 'inspect'
                ? 'bg-nothing-white/10 text-nothing-white border-b-2 border-nothing-red'
                : 'text-nothing-muted hover:text-nothing-white'
                }`}
            >
              Inspect
            </button>
          </div>

          {/* Scrollable Content Area - Fixed height with flex-1 to fill remaining space */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 relative">
            <AnimatePresence mode="wait">
              {mode === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-xs text-nothing-muted font-mono uppercase">Year Model</span>
                      <div className="text-lg font-medium flex items-center gap-2 text-nothing-white"><Calendar size={16} /> {bike.year || '2021'}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-nothing-muted font-mono uppercase">KM Driven</span>
                      <div className="text-lg font-medium flex items-center gap-2 text-nothing-white"><Gauge size={16} /> {bike.mileage || '12,500'}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-nothing-muted font-mono uppercase">Location</span>
                      <div className="text-lg font-medium flex items-center gap-2 text-nothing-white truncate"><MapPin size={16} /> {bike.address || 'Mumbai'}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-nothing-muted font-mono uppercase">Condition</span>
                      <div className={`text-sm font-medium px-3 py-1.5 rounded-lg border flex items-center gap-2 w-fit ${conditionData.style}`}>
                        <ConditionIcon size={14} />
                        {conditionData.label}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-nothing-muted font-mono uppercase">Seller Notes</span>
                    <p className="text-nothing-white text-sm leading-relaxed">
                      {bike.description || "Well maintained, single owner bike. Recently serviced. New tires installed last month. Valid insurance till next year."}
                    </p>
                  </div>
                </motion.div>
              )}

              {mode === 'inspect' && (
                <motion.div
                  key="inspect"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {existingInspection ? (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-2xl border ${existingInspection.status === 'COMPLETED' ? 'bg-green-500/10 border-green-500/30' :
                        existingInspection.status === 'ACCEPTED' ? 'bg-blue-500/10 border-blue-500/30' :
                          'bg-yellow-500/10 border-yellow-500/30'
                        }`}>
                        <div className="flex items-center gap-3 mb-4">
                          {existingInspection.status === 'COMPLETED' ? (
                            <div className="p-2 bg-green-500 rounded-full text-black"><Check size={20} /></div>
                          ) : existingInspection.status === 'ACCEPTED' ? (
                            <div className="p-2 bg-blue-500 rounded-full text-white"><Wrench size={20} /></div>
                          ) : (
                            <div className="p-2 bg-yellow-500 rounded-full text-black"><Clock size={20} /></div>
                          )}
                          <div>
                            <h3 className="font-medium text-lg text-nothing-white">
                              {existingInspection.status === 'COMPLETED' ? 'Inspection Completed' :
                                existingInspection.status === 'ACCEPTED' ? 'Mechanic Assigned' :
                                  'Request Pending'}
                            </h3>
                            <p className="text-xs text-nothing-muted font-mono uppercase mt-1">
                              ID: {existingInspection.id.slice(-8)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between py-2 border-b border-white/10">
                            <span className="text-nothing-muted">Offer Amount</span>
                            <span className="text-nothing-white font-mono">₹{existingInspection.offerAmount}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/10">
                            <span className="text-nothing-muted">Date</span>
                            <span className="text-nothing-white font-mono">{existingInspection.date}</span>
                          </div>
                          {existingInspection.mechanicName && (
                            <div className="flex justify-between py-2">
                              <span className="text-nothing-muted">Mechanic</span>
                              <span className="text-nothing-white">{existingInspection.mechanicName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-center">
                        <Button fullWidth variant="secondary" onClick={handleViewInspection}>
                          View Full Details
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-nothing-black/5 p-4 rounded-xl border border-nothing-gray space-y-2">
                        <h4 className="font-medium flex items-center gap-2 text-nothing-white"><ShieldCheck className="text-nothing-red" size={20} /> Expert Inspection</h4>
                        <p className="text-sm text-nothing-muted">
                          Place a request for a professional mechanic to inspect this bike. Available mechanics will see your gig and accept it.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Preferred Date"
                          type="date"
                          min={minDate}
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="text-sm"
                          helperText="Mechanics will see this as your target date."
                        />
                        <Input
                          label="Offer Amount (₹)"
                          placeholder="e.g. 800"
                          type="number"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                          className="text-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-mono uppercase tracking-widest text-nothing-muted">Message (Optional)</label>
                        <textarea
                          rows={2}
                          maxLength={100}
                          className="w-full bg-nothing-dark border border-nothing-gray rounded-xl p-3 text-sm text-nothing-white focus:border-nothing-white transition-colors outline-none resize-none placeholder-nothing-muted"
                          placeholder="Short note for mechanic (e.g. Check engine noise...)"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        <div className="flex justify-between text-[10px] text-nothing-muted font-mono">
                          <span>Max 2 lines</span>
                          <span>{message.length}/100</span>
                        </div>
                      </div>

                      <p className="text-xs text-nothing-muted border-t border-nothing-gray pt-4 mt-2">
                        Minimum offer amount is ₹500. A mechanic will visit the location upon accepting.
                      </p>
                    </>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer Actions (Sticky) */}
          <div className="p-4 md:p-6 border-t border-nothing-gray bg-nothing-dark shrink-0">
            {mode === 'details' && (
              inCart ? (
                <Button
                  fullWidth
                  onClick={handleRemoveFromCart}
                  variant="secondary"
                  className="text-nothing-red border-nothing-red/30 hover:bg-nothing-red/10"
                >
                  <span className="flex items-center gap-2">Remove from Cart <Trash2 size={18} /></span>
                </Button>
              ) : (
                <Button
                  fullWidth
                  onClick={handleAddToCart}
                  variant='primary'
                >
                  <span className="flex items-center gap-2">Add to Cart <ShoppingBag size={18} /></span>
                </Button>
              )
            )}
            {mode === 'inspect' && !existingInspection && (
              <Button fullWidth withArrow onClick={handleRequestInspection}>
                Place Request
              </Button>
            )}
          </div>

        </div>

      </motion.div>
    </div>
  );
};

export default BikeDetailModal;