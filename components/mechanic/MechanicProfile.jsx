
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMechanicProfile, updateMechanicProfile } from '../../store/slices/mechanicSlice';
import { User, Wrench, MapPin, Phone, Briefcase, DollarSign, ShieldCheck, AlertCircle } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Checkbox from '../common/Checkbox';

const MechanicProfile = () => {
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.mechanic);
    const { user } = useSelector((state) => state.auth);
    // Local state for form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        experienceYears: '',
        shopAddress: '',
        hourlyRate: '',
        isMobileService: false
    });

    // Fetch profile on mount
    useEffect(() => {
        dispatch(fetchMechanicProfile());
    }, [dispatch]);

    // Sync state when profile is loaded or auth user changes (as fallback)
    useEffect(() => {
        if (profile) {
            // Helper to safely convert numbers (including 0) to string, or empty string if null/undefined
            const safeString = (val) => (val !== null && val !== undefined) ? String(val) : '';

            setFormData({
                name: profile.user?.name || '',
                email: profile.user?.email || '',
                phone: profile.user?.phone || '',
                experienceYears: safeString(profile.experienceYears),
                shopAddress: profile.shopAddress || '',
                hourlyRate: safeString(profile.hourlyRate),
                isMobileService: profile.isMobileService || false
            });
        } else if (user) {
            // Fallback to auth user data if profile fetch fails or hasn't loaded yet
            const safeString = (val) => (val !== null && val !== undefined) ? String(val) : '';

            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                experienceYears: safeString(user.details?.experienceYears),
                shopAddress: user.details?.shopAddress || '',
                hourlyRate: safeString(user.details?.hourlyRate),
                isMobileService: user.details?.isMobileService || false
            });
        }
    }, [profile, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (checked) => {
        setFormData(prev => ({ ...prev, isMobileService: checked }));
    };

    const handleSubmit = () => {
        dispatch(updateMechanicProfile({
            name: formData.name,
            phone: formData.phone,
            experienceYears: Number(formData.experienceYears),
            hourlyRate: Number(formData.hourlyRate),
            shopAddress: formData.shopAddress,
            isMobileService: formData.isMobileService
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-nothing-dark border border-nothing-gray flex items-center justify-center overflow-hidden">
                    <Wrench size={40} className="text-nothing-red" />
                </div>
                <div>
                    <h2 className="text-2xl font-medium tracking-tight text-nothing-white">Mechanic Profile.</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-nothing-muted font-mono text-sm uppercase">Manage your service details</p>
                        {profile?.isVerified && (
                            <span className="flex items-center gap-1 text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full uppercase font-mono tracking-wider">
                                <ShieldCheck size={10} /> Verified Pro
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Main Form */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-nothing-dark border border-nothing-gray rounded-3xl p-8 space-y-6">
                        <h3 className="text-lg font-medium text-nothing-white border-b border-nothing-gray pb-4 flex items-center gap-2">
                            <User size={18} /> Personal Info
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            <Input
                                label="Email Address"
                                value={formData.email}
                                onChange={() => { }}
                                disabled
                                className="opacity-60 cursor-not-allowed bg-nothing-black/50"
                                helperText="Email ID cannot be changed. Contact support for assistance."
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Display Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                />
                                <Input
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-nothing-dark border border-nothing-gray rounded-3xl p-8 space-y-6">
                        <h3 className="text-lg font-medium text-nothing-white border-b border-nothing-gray pb-4 flex items-center gap-2">
                            <Briefcase size={18} /> Professional Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Experience (Years)"
                                name="experienceYears"
                                type="number"
                                value={formData.experienceYears}
                                onChange={handleChange}
                                placeholder="5"
                            />
                            <Input
                                label="Hourly Rate (₹)"
                                name="hourlyRate"
                                type="number"
                                value={formData.hourlyRate}
                                onChange={handleChange}
                                placeholder="500"
                            />
                        </div>

                        <Input
                            label="Shop Address"
                            name="shopAddress"
                            value={formData.shopAddress}
                            onChange={handleChange}
                            placeholder="123, Auto Market, City"
                        />

                        <div className="pt-2">
                            <Checkbox
                                label="I provide mobile service (Home Visits)"
                                checked={formData.isMobileService}
                                onChange={handleCheckboxChange}
                            />
                            <p className="text-xs text-nothing-muted mt-2 ml-9">
                                Checking this makes you visible for "at-home" inspection requests.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSubmit} withArrow className="px-8 py-3">
                            Save Profile
                        </Button>
                    </div>
                </div>

                {/* Side Stats/Info */}
                <div className="space-y-6">
                    <div className="bg-nothing-black border border-nothing-gray rounded-3xl p-6 space-y-4">
                        <h4 className="text-sm font-mono uppercase text-nothing-muted">Account Status</h4>

                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${profile?.isVerified ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                            <span className="text-nothing-white font-medium">{profile?.isVerified ? 'Verified' : 'Pending Verification'}</span>
                        </div>

                        {!profile?.isVerified && (
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-500 leading-relaxed">
                                <AlertCircle size={14} className="mb-1 inline-block mr-1" />
                                Complete more jobs to get verified. Verified mechanics get 2x more visibility.
                            </div>
                        )}
                    </div>

                    <div className="bg-nothing-black border border-nothing-gray rounded-3xl p-6 space-y-4">
                        <h4 className="text-sm font-mono uppercase text-nothing-muted">Quick Stats</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-nothing-muted">Rating</span>
                                <span className="text-nothing-white font-mono">4.8/5.0</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-nothing-muted">Jobs Done</span>
                                <span className="text-nothing-white font-mono">{user?.details?.jobsCompleted || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t border-nothing-gray pt-3 mt-3">
                                <span className="text-nothing-muted">Member Since</span>
                                <span className="text-nothing-white font-mono">2026</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MechanicProfile;
