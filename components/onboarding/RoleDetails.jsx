import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setDetails } from '../../store/slices/authSlice';
import Button from '../common/Button';
import Input from '../common/Input';
import Checkbox from '../common/Checkbox';
import { Info, Search, Bike, AlertCircle, Check, ArrowRight, X, ScanLine, Box, Plus } from 'lucide-react';

// --- MOCK BIKE DATABASE ---
const MOCK_BIKES = [
  "Royal Enfield Classic 350",
  "Royal Enfield Interceptor 650",
  "Royal Enfield Himalayan",
  "KTM Duke 390",
  "KTM RC 200",
  "Yamaha R15 V4",
  "Yamaha MT-15",
  "Honda CB350 H'ness",
  "Triumph Speed 400",
  "Triumph Bonneville T100",
  "Kawasaki Ninja 300",
  "Hero XPulse 200",
  "Bajaj Dominar 400",
  "Jawa 42 Bobber",
  "Harley-Davidson X440"
];

const RoleDetails = ({ role, onBack, onContinue }) => {
  const dispatch = useDispatch();

  // --- GENERAL STATE ---
  const [formData, setFormData] = useState({
    businessName: '',
    gstNumber: '',
    shopName: '',
    experienceYears: '',
    shopAddress: '',
    hourlyRate: '',
    isMobileService: false,
    bikeModel: ''
  });
  const [errors, setErrors] = useState({});

  // --- USER WIZARD STATE ---
  const [userStep, setUserStep] = useState('ownership');
  const [hasBike, setHasBike] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBike, setSelectedBike] = useState('');

  // User Bike Details
  const [bikeYear, setBikeYear] = useState('2022');
  const [registration, setRegistration] = useState('');

  // --- MANUAL ADD STATE ---
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualFormData, setManualFormData] = useState({
    brand: '',
    model: '',
    year: '',
    registration: ''
  });
  const [manualErrors, setManualErrors] = useState({});

  // Animation State
  const [loadingStage, setLoadingStage] = useState(0); // 0: Scanning, 1: Specs, 2: 3D, 3: Done

  // --- HANDLERS ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({ ...prev, isMobileService: checked }));
  };

  const handleManualChange = (e) => {
    setManualFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (manualErrors[e.target.name]) setManualErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleManualSubmit = () => {
    const newErrors = {};
    if (!manualFormData.brand) newErrors.brand = "Required";
    if (!manualFormData.model) newErrors.model = "Required";
    if (!manualFormData.year) newErrors.year = "Required";

    if (Object.keys(newErrors).length > 0) {
      setManualErrors(newErrors);
      return;
    }

    const fullModelName = `${manualFormData.brand} ${manualFormData.model}`;

    // Set Data
    setSelectedBike(fullModelName);
    setBikeYear(manualFormData.year);
    setRegistration(manualFormData.registration);

    // Close Modal & Trigger Loading Sequence (Skip 'details' step as we have data)
    setIsManualModalOpen(false);
    setUserStep('loading');
  };

  // --- SEARCH LOGIC ---
  useEffect(() => {
    if (searchTerm.length > 1) {
      const results = MOCK_BIKES.filter(bike =>
        bike.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleBikeSelect = (bike) => {
    setSelectedBike(bike);
    setSearchTerm(bike);
    setSearchResults([]);
    // Slight delay before moving to next step for better UX
    setTimeout(() => setUserStep('details'), 300);
  };

  // --- ANIMATION SEQUENCE ---
  useEffect(() => {
    if (userStep === 'loading') {
      const timers = [
        setTimeout(() => setLoadingStage(1), 1500),
        setTimeout(() => setLoadingStage(2), 3000),
        setTimeout(() => setLoadingStage(3), 4500),
        setTimeout(() => {
          // Finalize
          dispatch(setDetails({
            hasBike: true,
            bikeModel: selectedBike,
            bikeYear: bikeYear,
            registration: registration
          }));
          onContinue();
        }, 5500)
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [userStep, dispatch, selectedBike, bikeYear, registration, onContinue]);

  // --- VALIDATION ---
  const validateGeneralForm = () => {
    const newErrors = {};
    let isValid = true;

    if (role === 'seller') {
      if (!formData.businessName.trim()) { newErrors.businessName = 'Required'; isValid = false; }
    } else if (role === 'mechanic') {
      if (!formData.shopName.trim()) { newErrors.shopName = 'Required'; isValid = false; }
      if (!formData.experienceYears.trim()) { newErrors.experienceYears = 'Required'; isValid = false; }
      if (!formData.hourlyRate.trim()) { newErrors.hourlyRate = 'Required'; isValid = false; }
      if (!formData.shopAddress.trim()) { newErrors.shopAddress = 'Required'; isValid = false; }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleGeneralSubmit = () => {
    if (validateGeneralForm()) {
      let relevantData = {};

      if (role === 'seller') {
        relevantData = {
          businessName: formData.businessName,
          gstNumber: formData.gstNumber
        };
      } else if (role === 'mechanic') {
        relevantData = {
          shopName: formData.shopName,
          experienceYears: formData.experienceYears,
          hourlyRate: formData.hourlyRate,
          shopAddress: formData.shopAddress,
          isMobileService: formData.isMobileService
        };
      }

      dispatch(setDetails(relevantData));
      onContinue();
    }
  };

  const handleNoBikeSubmit = () => {
    dispatch(setDetails({ hasBike: false }));
    onContinue();
  };

  // --- RENDERERS ---

  // 1. Garage Animation Component (Force dark mode for this specific UI element)
  const renderGarageLoader = () => (
    <div className="flex flex-col items-center justify-center space-y-8 w-full">
      <div className="relative w-64 h-64 border border-neutral-800 rounded-3xl bg-neutral-900 overflow-hidden flex items-center justify-center">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />

        {/* Central Icon Animations */}
        <AnimatePresence mode="wait">
          {loadingStage === 0 && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center text-nothing-red"
            >
              <Bike size={80} strokeWidth={1} className="opacity-50" />
              <motion.div
                className="absolute w-full h-1 bg-nothing-red shadow-[0_0_10px_#D71921]"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <span className="mt-4 font-mono text-xs uppercase tracking-widest animate-pulse">Scanning Model...</span>
            </motion.div>
          )}
          {loadingStage === 1 && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-2 w-full px-8"
            >
              <div className="w-full space-y-2">
                <div className="h-2 bg-neutral-800 rounded overflow-hidden">
                  <motion.div className="h-full bg-white" initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ duration: 1 }} />
                </div>
                <div className="h-2 bg-neutral-800 rounded overflow-hidden">
                  <motion.div className="h-full bg-white" initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1, delay: 0.2 }} />
                </div>
                <div className="h-2 bg-neutral-800 rounded overflow-hidden">
                  <motion.div className="h-full bg-white" initial={{ width: 0 }} animate={{ width: '90%' }} transition={{ duration: 1, delay: 0.4 }} />
                </div>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest mt-4 text-white">Calibrating Specs</span>
            </motion.div>
          )}
          {loadingStage >= 2 && (
            <motion.div
              key="3d"
              initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }}
              className="relative flex flex-col items-center"
            >
              <div className="relative">
                <Bike size={100} strokeWidth={1.5} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                {loadingStage === 3 && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-green-500 text-black p-1 rounded-full"
                  >
                    <Check size={16} strokeWidth={3} />
                  </motion.div>
                )}
              </div>
              <span className="font-mono text-xs uppercase tracking-widest mt-4 text-green-500">
                {loadingStage === 3 ? "Garage Updated" : "Generating Asset"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-xl font-medium text-nothing-white">
          {loadingStage === 0 && "Identifying Model"}
          {loadingStage === 1 && "Fetching Factory Specs"}
          {loadingStage === 2 && "Building Digital Twin"}
          {loadingStage === 3 && "Parked in Garage"}
        </h2>
        <p className="text-sm text-nothing-muted font-mono uppercase">
          {selectedBike} • {bikeYear}
        </p>
      </div>
    </div>
  );

  // 2. User Wizard Renderer
  const renderUserWizard = () => {
    switch (userStep) {
      case 'ownership':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-medium tracking-tight text-nothing-white">Do you own a bike?</h2>
              <p className="text-nothing-muted">Onboarding your bike helps us recommend the exact parts you need.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => { setHasBike(true); setUserStep('search'); }}
                className="h-40 border border-nothing-gray rounded-3xl p-6 flex flex-col justify-between items-start hover:bg-nothing-dark hover:border-nothing-white transition-all group bg-nothing-dark/50"
              >
                <div className="p-3 bg-nothing-dark group-hover:bg-nothing-black rounded-full border border-nothing-gray transition-colors">
                  <Bike size={24} className="text-nothing-white" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-lg block text-nothing-white">Yes, I ride.</span>
                  <span className="text-xs font-mono text-nothing-muted group-hover:text-nothing-white uppercase tracking-wide">Add to Garage</span>
                </div>
              </button>

              <button
                onClick={handleNoBikeSubmit}
                className="h-40 border border-nothing-gray rounded-3xl p-6 flex flex-col justify-between items-start hover:bg-nothing-dark hover:border-nothing-white transition-all group bg-nothing-dark/50"
              >
                <div className="p-3 bg-nothing-dark group-hover:bg-nothing-black rounded-full border border-nothing-gray transition-colors">
                  <Box size={24} className="text-nothing-white" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-lg block text-nothing-white">Not yet.</span>
                  <span className="text-xs font-mono text-nothing-muted group-hover:text-nothing-white uppercase tracking-wide">I'm just browsing</span>
                </div>
              </button>
            </div>

            <div className="pt-8 flex justify-center">
              <button
                onClick={onBack}
                className="text-sm font-mono text-nothing-muted hover:text-nothing-white uppercase tracking-widest transition-colors"
              >
                ← Back to Roles
              </button>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-medium tracking-tight text-nothing-white">What do you ride?</h2>
              <p className="text-nothing-muted">Search for your model to get started.</p>
            </div>

            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nothing-muted" size={20} />
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Royal Enfield Interceptor"
                  className="w-full bg-nothing-dark border border-nothing-gray rounded-xl py-4 pl-12 pr-4 text-lg text-nothing-white outline-none focus:border-nothing-red transition-colors placeholder-nothing-muted"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => { setSearchTerm(''); setSearchResults([]); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-nothing-muted hover:text-nothing-white"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-nothing-dark border border-nothing-gray rounded-xl overflow-hidden shadow-2xl z-20 max-h-60 overflow-y-auto custom-scrollbar"
                >
                  {searchResults.map((bike, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleBikeSelect(bike)}
                      className="w-full text-left px-6 py-4 hover:bg-nothing-black/5 border-b border-nothing-gray last:border-0 flex items-center justify-between group"
                    >
                      <span className="text-nothing-muted group-hover:text-nothing-white">{bike}</span>
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-nothing-red" />
                    </button>
                  ))}
                </motion.div>
              )}

              {searchTerm.length > 2 && searchResults.length === 0 && (
                <div className="mt-4 p-4 border border-dashed border-nothing-gray rounded-xl text-center text-nothing-muted">
                  <AlertCircle className="mx-auto mb-2" size={20} />
                  <p className="text-sm">We couldn't find that model.</p>
                  <button
                    onClick={() => setIsManualModalOpen(true)}
                    className="text-xs font-mono text-nothing-red mt-2 hover:underline uppercase"
                  >
                    Add manually
                  </button>
                </div>
              )}
            </div>

            <div className="pt-20">
              <button onClick={() => setUserStep('ownership')} className="text-sm font-mono text-nothing-muted hover:text-nothing-white uppercase tracking-widest">
                Back
              </button>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 bg-nothing-white/10 rounded-full text-xs font-mono mb-2 text-nothing-white">{selectedBike}</div>
              <h2 className="text-3xl font-medium tracking-tight text-nothing-white">Tell us a bit more.</h2>
              <p className="text-nothing-muted">This helps with accurate maintenance schedules.</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-mono uppercase text-nothing-muted tracking-widest">Purchase Year: <span className="text-nothing-white">{bikeYear}</span></label>
                <input
                  type="range"
                  min="2010"
                  max="2024"
                  step="1"
                  value={bikeYear}
                  onChange={(e) => setBikeYear(e.target.value)}
                  className="w-full h-2 bg-nothing-gray rounded-lg appearance-none cursor-pointer accent-nothing-red"
                />
                <div className="flex justify-between text-xs text-nothing-muted font-mono">
                  <span>2010</span>
                  <span>2024</span>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  label="Registration Number (Optional)"
                  name="registration"
                  placeholder="MH 12 AB 1234"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  helperText="Used to fetch insurance and service history automatically."
                />
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between">
              <button onClick={() => setUserStep('search')} className="text-sm font-mono text-nothing-muted hover:text-nothing-white uppercase tracking-widest">
                Back
              </button>
              <Button onClick={() => setUserStep('loading')} withArrow>
                Build Garage
              </Button>
            </div>
          </div>
        );

      case 'loading':
        return renderGarageLoader();

      default:
        return null;
    }
  };


  // --- MAIN RENDER ---

  // If user role, separate flow entirely
  if (role === 'user') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 w-full max-w-xl mx-auto relative z-10">
        {renderUserWizard()}

        {/* MANUAL ADD MODAL */}
        <AnimatePresence>
          {isManualModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                onClick={() => setIsManualModalOpen(false)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                className="relative bg-nothing-dark border border-nothing-gray w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-nothing-gray flex justify-between items-center bg-nothing-black/50">
                  <h2 className="text-xl font-medium tracking-tight text-nothing-white flex items-center gap-2">
                    <Plus size={20} className="text-nothing-red" /> Add Manual Details
                  </h2>
                  <button
                    onClick={() => setIsManualModalOpen(false)}
                    className="p-2 rounded-full hover:bg-nothing-white/10 transition-colors"
                  >
                    <X size={20} className="text-nothing-muted hover:text-nothing-white" />
                  </button>
                </div>

                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Brand"
                      name="brand"
                      placeholder="e.g. KTM"
                      value={manualFormData.brand}
                      onChange={handleManualChange}
                      error={manualErrors.brand}
                    />
                    <Input
                      label="Model"
                      name="model"
                      placeholder="e.g. Duke 390"
                      value={manualFormData.model}
                      onChange={handleManualChange}
                      error={manualErrors.model}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Year"
                      name="year"
                      type="number"
                      placeholder="2022"
                      value={manualFormData.year}
                      onChange={handleManualChange}
                      error={manualErrors.year}
                    />
                    <Input
                      label="Registration No."
                      name="registration"
                      placeholder="MH 02 XX 1234"
                      value={manualFormData.registration}
                      onChange={handleManualChange}
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-nothing-gray bg-nothing-dark flex justify-end gap-4">
                  <button
                    onClick={() => setIsManualModalOpen(false)}
                    className="px-6 py-3 rounded-full text-sm font-mono text-nothing-muted hover:text-nothing-white transition-colors uppercase tracking-wide"
                  >
                    Cancel
                  </button>
                  <Button onClick={handleManualSubmit} withArrow className="py-3 px-6 text-sm">
                    Add Bike
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- SELLER / MECHANIC FORM (Legacy) ---
  const getTitle = () => {
    switch (role) {
      case 'seller': return 'Business Details';
      case 'mechanic': return 'Shop Profile';
      default: return 'Details';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 w-full max-w-2xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-8"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-nothing-white">
              {getTitle()}.
            </h1>
            <div className="px-3 py-1 rounded-full border border-nothing-gray text-xs font-mono text-nothing-muted uppercase tracking-widest">
              {role}
            </div>
          </div>
          <p className="text-nothing-muted font-light text-lg">
            Please provide a few more details to set up your profile.
          </p>
        </div>

        {/* Dynamic Form Content */}
        <div className="space-y-6">

          {/* SELLER FORM */}
          {role === 'seller' && (
            <>
              <Input
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="BikeBazaar Motors"
                error={errors.businessName}
              />
              <div className="space-y-2">
                <Input
                  label="GST Number (Optional)"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="27AABCU9603R1ZM"
                  error={errors.gstNumber}
                />
                <div className="flex gap-2 items-start text-nothing-muted text-sm mt-2 bg-nothing-dark/50 p-3 rounded-lg border border-nothing-gray/30">
                  <Info size={16} className="mt-0.5 text-nothing-red shrink-0" />
                  <p className="leading-tight text-xs font-mono">
                    If your GST is verified by us, you will receive a <span className="text-nothing-white">Verified Seller Badge</span> on your profile.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* MECHANIC FORM */}
          {role === 'mechanic' && (
            <>
              <Input
                label="Shop Name"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="FixIt Hub"
                error={errors.shopName}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Experience (Years)"
                  name="experienceYears"
                  type="number"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  placeholder="5"
                  error={errors.experienceYears}
                />
                <Input
                  label="Hourly Rate (₹)"
                  name="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="500"
                  error={errors.hourlyRate}
                />
              </div>
              <Input
                label="Shop Address"
                name="shopAddress"
                value={formData.shopAddress}
                onChange={handleChange}
                placeholder="123 Service Road, Mumbai"
                error={errors.shopAddress}
              />
              <div className="pt-2">
                <Checkbox
                  label="I provide mobile service (Home visits)"
                  checked={formData.isMobileService}
                  onChange={handleCheckboxChange}
                />
              </div>
            </>
          )}

        </div>

        <div className="pt-8 space-y-4">
          <Button fullWidth withArrow onClick={handleGeneralSubmit}>
            Continue
          </Button>

          <div className="flex justify-center items-center pt-2">
            <button
              onClick={onBack}
              className="text-sm font-mono text-nothing-muted hover:text-nothing-white transition-colors uppercase tracking-widest"
            >
              ← Back to Roles
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleDetails;