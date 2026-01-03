import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile, fetchUserProfile } from '../../store/slices/authSlice';
import { User, Camera, MapPin } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    console.log("USer: ", user)
    // Local state for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Address State
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India'
    });


    const [previewImage, setPreviewImage] = useState(user?.profileImage || null);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(undefined);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setAddress({
                street: user.address?.street || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                zip: user.address?.zip || '',
                country: user.address?.country || 'India'
            });
            setPreviewImage(user.profileImage || null);
        }
    }, [user]);


    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        dispatch(updateUserProfile({
            name,
            phone,
            email,
            address,
            profileImage: selectedFile
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-nothing-dark border border-nothing-gray flex items-center justify-center overflow-hidden">
                        {previewImage ? (
                            <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={40} className="text-neutral-400" />
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-nothing-red text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                        <Camera size={14} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-medium tracking-tight">Your Profile.</h2>
                    <p className="text-neutral-500 font-mono text-sm uppercase">Manage your personal details</p>
                </div>
            </div>

            <div className="bg-nothing-dark border border-nothing-gray rounded-3xl p-8 space-y-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-nothing-white border-b border-nothing-gray pb-2">Basic Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Display Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled
                            className="opacity-60 cursor-not-allowed bg-nothing-black/50"
                            helperText="Email cannot be changed."
                        />
                        <Input
                            label="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                        />                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-nothing-white border-b border-nothing-gray pb-2 flex items-center gap-2">
                        <MapPin size={18} /> Delivery Address
                    </h3>
                    <div className="space-y-4">
                        <Input
                            label="Street Address"
                            name="street"
                            value={address.street}
                            onChange={handleAddressChange}
                            placeholder="123 Main St, Apt 4B"
                        />
                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                label="City"
                                name="city"
                                value={address.city}
                                onChange={handleAddressChange}
                            />
                            <Input
                                label="State"
                                name="state"
                                value={address.state}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                label="ZIP Code"
                                name="zip"
                                value={address.zip}
                                onChange={handleAddressChange}
                            />
                            <Input
                                label="Country"
                                name="country"
                                value={address.country}
                                onChange={handleAddressChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-nothing-gray flex justify-end">
                    <Button onClick={handleSubmit} withArrow className="px-8 py-3 text-sm">
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;