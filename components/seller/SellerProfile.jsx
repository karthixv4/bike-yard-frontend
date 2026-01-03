import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerProfile, updateSellerProfile } from '../../store/slices/sellerSlice';
import { User, Store, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const SellerProfile = () => {
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.seller);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        businessName: '',
        gstNumber: '',
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: ''
    });

    useEffect(() => {
        dispatch(fetchSellerProfile());
    }, [dispatch]);

    useEffect(() => {
        if (!profile && !user) return;

        // 🔑 Normalize address (supports GET & PUT response)
        const address =
            profile?.address ||
            profile?.addresses?.[0] ||
            user?.address ||
            {};

        setFormData({
            businessName: profile?.sellerProfile?.businessName || '',
            gstNumber: profile?.sellerProfile?.gstNumber || '',
            name: profile?.name || user?.name || '',
            email: profile?.email || user?.email || '',
            phone: profile?.phone || user?.phone || '',
            street: address.street || '',
            city: address.city || '',
            state: address.state || '',
            zip: address.zip || ''
        });
    }, [profile, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        dispatch(
            updateSellerProfile({
                businessName: formData.businessName,
                gstNumber: formData.gstNumber,
                name: formData.name,
                phone: formData.phone,
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zip: formData.zip
            })
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-nothing-dark border border-nothing-gray flex items-center justify-center">
                    <Store size={40} className="text-nothing-red" />
                </div>
                <div>
                    <h2 className="text-2xl font-medium text-nothing-white">
                        Seller Profile
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-nothing-muted font-mono text-sm uppercase">
                            Manage your business details
                        </p>
                        {profile?.sellerProfile?.isVerified && (
                            <span className="flex items-center gap-1 text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full uppercase font-mono">
                                <ShieldCheck size={10} /> Verified
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="md:col-span-2 space-y-8">
                    {/* Business Info */}
                    <div className="bg-nothing-dark border border-nothing-gray rounded-3xl p-8 space-y-6">
                        <h3 className="text-lg font-medium text-nothing-white border-b border-nothing-gray pb-4 flex items-center gap-2">
                            <Store size={18} /> Business Info
                        </h3>
                        <Input
                            label="Business Name"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                        />
                        <Input
                            label="GST Number"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            helperText="Used for verification"
                        />
                    </div>

                    {/* Contact Info */}
                    <div className="bg-nothing-dark border border-nothing-gray rounded-3xl p-8 space-y-6">
                        <h3 className="text-lg font-medium text-nothing-white border-b border-nothing-gray pb-4 flex items-center gap-2">
                            <User size={18} /> Contact Person
                        </h3>
                        <Input
                            label="Email"
                            value={formData.email}
                            disabled
                            className="opacity-60 cursor-not-allowed"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <Input
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="bg-nothing-dark border border-nothing-gray rounded-3xl p-8 space-y-6">
                        <h3 className="text-lg font-medium text-nothing-white border-b border-nothing-gray pb-4 flex items-center gap-2">
                            <MapPin size={18} /> Business Address
                        </h3>
                        <Input
                            label="Street"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                            <Input
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </div>
                        <Input
                            label="Zip Code"
                            name="zip"
                            value={formData.zip}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSubmit} withArrow className="px-8 py-3">
                            Save Profile
                        </Button>
                    </div>
                </div>

                {/* Side Status */}
                <div className="space-y-6">
                    <div className="bg-nothing-black border border-nothing-gray rounded-3xl p-6 space-y-4">
                        <h4 className="text-sm font-mono uppercase text-nothing-muted">
                            Verification Status
                        </h4>
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-3 h-3 rounded-full ${profile?.sellerProfile?.isVerified
                                        ? 'bg-green-500'
                                        : 'bg-yellow-500 animate-pulse'
                                    }`}
                            />
                            <span className="text-nothing-white font-medium">
                                {profile?.sellerProfile?.isVerified
                                    ? 'Verified'
                                    : 'Pending Verification'}
                            </span>
                        </div>

                        {!profile?.sellerProfile?.isVerified && (
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-500">
                                <AlertCircle size={14} className="inline mr-1" />
                                Add valid GST to get verified
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;
