import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addNewProduct, closeAddModal, fetchCategories, createCategory } from '../../store/slices/sellerSlice';
import { X, Bike, Wrench, ChevronDown, Plus, Check, Trash2 } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const AddProductModal = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.seller);
  const [type, setType] = useState('part');


  // Category UI State
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const categoryWrapperRef = useRef(null);

  // Image Upload Ref
  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  // Form State
  const [localImages, setLocalImages] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    price: '',
    description: '',
    // Part / Accessory
    stock: '',
    category: '',
    // Bike
    year: '',
    kmdriven: '',
    condition: 'Good',
    ownership: '1',
    address: ''
  });

  // --- Initialization for Edit Mode ---
  useEffect(() => {
    // Fetch categories if empty
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }



    // Cleanup preview URLs
    return () => {
      localImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [categories.length]);

  // Click outside handler for categories
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryWrapperRef.current && !categoryWrapperRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCategory = async () => {
    if (!categorySearch.trim()) return;

    const result = await dispatch(createCategory({ name: categorySearch.trim() }));
    if (createCategory.fulfilled.match(result)) {
      // On success, set the category and close dropdown
      setFormData(prev => ({ ...prev, category: categorySearch.trim() }));
      setIsCategoryOpen(false);
      setCategorySearch('');
    }
  };

  const handleCategorySelect = (cat) => {
    setFormData(prev => ({ ...prev, category: cat.name }));
    setIsCategoryOpen(false);
    setCategorySearch('');
  };

  // --- Image Handling Logic (Local Only) ---
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;


    // Check Limit (Max 4)
    if (localImages.length + files.length > 4) {
      dispatch(openStatusModal({
        type: 'error',
        title: 'Limit Exceeded',
        message: 'You can only upload a maximum of 4 photos.'
      }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const newImages = [];

    Array.from(files).forEach(file => {
      // Validate File Type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) return;

      // Validate File Size (Max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) return;

      newImages.push({
        id: Math.random().toString(36).substr(2, 9),
        file: file,
        preview: URL.createObjectURL(file)
      });
    });

    if (newImages.length > 0) {
      setLocalImages(prev => [...prev, ...newImages]);
    } else {
      // If files existed but none were valid
      dispatch(openStatusModal({
        type: 'error',
        title: 'Invalid Files',
        message: 'Ensure files are JPG/PNG/WebP and under 5MB.'
      }));
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveLocalImage = (idToRemove) => {
    setLocalImages(prev => {
      const target = prev.find(img => img.id === idToRemove);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(img => img.id !== idToRemove);
    });
  };

  // --- FINAL SUBMIT ---
  const handleSubmit = async () => {
    // 1. Validation
    if (!formData.price) {
      dispatch(openStatusModal({ type: 'error', title: 'Missing Price', message: 'Please enter a price.' }));
      return;
    }

    let finalName = formData.name;
    if (type === 'bike') {
      if (!formData.brand || !formData.model) {
        dispatch(openStatusModal({ type: 'error', title: 'Missing Details', message: 'Brand and Model are required.' }));
        return;
      }
      if (!formData.address) {
        dispatch(openStatusModal({ type: 'error', title: 'Missing Address', message: 'Address is required for bike listings.' }));
        return;
      }
      finalName = `${formData.brand} ${formData.model}`;
    } else {
      if (!formData.name) {
        dispatch(openStatusModal({ type: 'error', title: 'Missing Name', message: 'Item name is required.' }));
        return;
      }
    }

    if (localImages.length === 0) {
      dispatch(openStatusModal({ type: 'error', title: 'No Images', message: 'Please add at least one photo.' }));
      return;
    }

    // 2. Construct Payload
    let productPayload = {
      type,
      name: finalName,
      price: Number(formData.price),
      description: formData.description,
    };

    if (type === 'bike') {
      productPayload = {
        ...productPayload,
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        kmdriven: Number(formData.kmdriven),
        condition: formData.condition,
        ownership: Number(formData.ownership),
        category: 'Refurbished Bike',
        address: formData.address,
        stock: 1,
      };
    } else {
      // 'part' or 'accessory'
      productPayload = {
        ...productPayload,
        stock: Number(formData.stock),
        category: formData.category,
      };
    }

    // 3. Dispatch Thunk
    dispatch(addNewProduct({
      productData: productPayload,
      files: localImages.map(img => img.file)
    }));
  };

  const isPartOrAccessory = type === 'part' || type === 'accessory';

  // Filter categories based on search
  const filteredCategories = categories.filter(
    c =>
      c?.name &&
      c.name.toLowerCase().includes(categorySearch.trim().toLowerCase())
  );

  // Check if exact match exists to show/hide Create button
  const normalizedSearch = categorySearch.trim().toLowerCase();

  const exactMatch = categories.some(
    c => c.name.toLowerCase() === normalizedSearch
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => dispatch(closeAddModal())}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="relative bg-nothing-dark border border-nothing-gray w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-nothing-gray flex justify-between items-center bg-nothing-black/50">
          <h2 className="text-xl font-medium tracking-tight text-nothing-white flex items-center gap-2">
            <Plus size={20} className="text-nothing-red" /> Add to Inventory

          </h2>
          <button
            onClick={() => dispatch(closeAddModal())}
            className="p-2 rounded-full hover:bg-nothing-white/10 transition-colors"
          >
            <X size={20} className="text-nothing-muted hover:text-nothing-white" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setType('part')}
              className={`
                h-24 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300
                ${isPartOrAccessory
                  ? 'bg-nothing-white border-nothing-white text-nothing-black'
                  : 'bg-nothing-black border-nothing-gray text-nothing-muted hover:border-nothing-muted'
                }
              `}
            >
              <Wrench size={24} />
              <span className="font-mono text-xs uppercase tracking-widest">Part & Accessory</span>
            </button>
            <button
              onClick={() => setType('bike')}
              className={`
                h-24 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300
                ${type === 'bike'
                  ? 'bg-nothing-white border-nothing-white text-nothing-black'
                  : 'bg-nothing-black border-nothing-gray text-nothing-muted hover:border-nothing-muted'
                }
              `}
            >
              <Bike size={24} />
              <span className="font-mono text-xs uppercase tracking-widest">Refurbished Bike</span>
            </button>
          </div>

          {/* Sub-Type Selector for Parts/Accessories */}
          {isPartOrAccessory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex gap-4 p-4 rounded-xl bg-nothing-black/30 border border-nothing-gray/30"
            >
              <div className="flex items-center gap-4 w-full">
                <span className="text-xs font-mono uppercase text-nothing-muted tracking-widest min-w-fit">Item Type:</span>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => setType('part')}
                    className={`flex-1 py-2 px-4 rounded-full text-xs font-mono uppercase transition-colors ${type === 'part'
                      ? 'bg-nothing-red text-white'
                      : 'bg-nothing-dark border border-nothing-gray text-nothing-muted hover:text-nothing-white'
                      }`}
                  >
                    Spare Part
                  </button>
                  <button
                    onClick={() => setType('accessory')}
                    className={`flex-1 py-2 px-4 rounded-full text-xs font-mono uppercase transition-colors ${type === 'accessory'
                      ? 'bg-nothing-red text-white'
                      : 'bg-nothing-dark border border-nothing-gray text-text-nothing-muted hover:text-nothing-white'
                      }`}
                  >
                    Bike Accessory
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">

            {/* Conditional Name/Brand Fields */}
            {type === 'bike' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Brand"
                    name="brand"
                    placeholder="e.g. Royal Enfield"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                  <Input
                    label="Model"
                    name="model"
                    placeholder="e.g. Himalayan"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </div>
                <Input
                  label="Location / Address"
                  name="address"
                  placeholder="e.g. 123, Bikers Lane, Chennai"
                  value={formData.address}
                  onChange={handleChange}
                />
              </>
            ) : (
              <Input
                label="Item Name"
                name="name"
                placeholder="e.g. LED Headlamp Assembly"
                value={formData.name}
                onChange={handleChange}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (₹)"
                name="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
              />

              {isPartOrAccessory ? (
                <Input
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  placeholder="1"
                  value={formData.stock}
                  onChange={handleChange}
                />
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-xs font-mono uppercase text-nothing-muted tracking-widest ml-1">
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full bg-nothing-dark border border-nothing-gray rounded-xl p-4 text-nothing-white outline-none focus:border-nothing-white appearance-none transition-colors"
                  >
                    <option value="Mint">Mint</option>
                    <option value="Good">Good</option>
                    <option value="Needs Work">Needs Work</option>
                  </select>
                </div>
              )}
            </div>

            {/* Conditional Fields */}
            <div className="grid grid-cols-2 gap-4">
              {isPartOrAccessory ? (
                <div className="col-span-2 relative" ref={categoryWrapperRef}>
                  <label className="text-xs font-mono uppercase text-nothing-muted tracking-widest ml-1 block mb-2">
                    Category
                  </label>

                  {/* Custom Dropdown Trigger */}
                  <div
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className={`
                       w-full bg-nothing-dark border rounded-xl p-4 flex justify-between items-center cursor-pointer transition-colors
                       ${isCategoryOpen ? 'border-nothing-white' : 'border-nothing-gray'}
                     `}
                  >
                    <span className={formData.category ? 'text-nothing-white' : 'text-nothing-muted'}>
                      {formData.category || 'Select Category...'}
                    </span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180 text-nothing-white' : 'text-nothing-muted'}`} />
                  </div>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-nothing-dark border border-nothing-gray rounded-xl shadow-2xl z-20 overflow-hidden"
                      >
                        {/* Search Input */}
                        <div className="p-2 border-b border-nothing-gray/50">
                          <input
                            autoFocus
                            type="text"
                            placeholder="Search or Create..."
                            className="w-full bg-nothing-black border border-nothing-gray rounded-lg px-3 py-2 text-sm text-nothing-white focus:border-nothing-white outline-none placeholder-nothing-muted transition-colors"
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                          />
                        </div>

                        <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                          {filteredCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => handleCategorySelect(cat)}
                              className="w-full text-left px-3 py-2 rounded-lg text-sm text-nothing-white hover:bg-nothing-gray/20 transition-colors flex items-center justify-between"
                            >
                              {cat.name}
                              {formData.category === cat.name && (
                                <Check size={14} className="text-nothing-red" />
                              )}
                            </button>
                          ))}

                          {/* Create Option */}
                          {categorySearch && !exactMatch && (
                            <button
                              onClick={handleCreateCategory}
                              className="w-full text-left px-3 py-2 rounded-lg text-sm text-nothing-red bg-nothing-red/10 hover:bg-nothing-red/20 transition-colors flex items-center gap-2 mt-1"
                            >
                              <Plus size={14} /> Create "{categorySearch}"
                            </button>
                          )}

                          {filteredCategories.length === 0 && !categorySearch && (
                            <div className="p-4 text-center text-xs text-nothing-muted font-mono uppercase">
                              Start typing...
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Input
                    label="Model Year"
                    name="year"
                    type="number"
                    placeholder="2022"
                    value={formData.year}
                    onChange={handleChange}
                  />
                  <Input
                    label="KM Driven"
                    name="kmdriven"
                    type="number"
                    placeholder="12500"
                    value={formData.kmdriven}
                    onChange={handleChange}
                  />

                </>
              )}
            </div>
            {/* Ownership for Bike */}
            {!isPartOrAccessory && (
              <div className="flex flex-col gap-2 w-full">
                <label className="text-xs font-mono uppercase text-nothing-muted tracking-widest ml-1">
                  Ownership
                </label>
                <select
                  name="ownership"
                  value={formData.ownership}
                  onChange={handleChange}
                  className="w-full bg-nothing-dark border border-nothing-gray rounded-xl p-4 text-nothing-white outline-none focus:border-nothing-white appearance-none transition-colors"
                >
                  <option value="1">1st Owner</option>
                  <option value="2">2nd Owner</option>
                  <option value="3">3rd Owner</option>
                  <option value="4">4+ Owners</option>
                </select>
              </div>
            )}
            {/* Description */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-mono uppercase text-nothing-muted tracking-widest ml-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                className="w-full bg-nothing-dark border border-nothing-gray rounded-xl p-4 text-nothing-white placeholder-neutral-600 outline-none focus:border-nothing-white transition-colors resize-none"
                placeholder="Describe the condition, specs, and any defects..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Image Upload Area */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-mono uppercase text-nothing-muted tracking-widest ml-1">
                  Photos ({localImages.length}/4)

                </label>
                <span className="text-[10px] font-mono text-nothing-muted">Max 5MB • JPG/PNG</span>
              </div>

              {/* Hidden Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                multiple // Allow selecting multiple files
                onChange={handleFileSelect}
              />

              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {/* Upload Button - Hidden if limit reached */}
                {localImages.length < 4 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-nothing-gray rounded-xl flex flex-col items-center justify-center text-nothing-muted hover:border-nothing-white hover:text-nothing-white transition-colors gap-2 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-nothing-black flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus size={16} />
                    </div>
                    <span className="text-[10px] font-mono uppercase">Add</span>
                  </button>
                )}

                {/* Previews - New Local Images */}
                <AnimatePresence>

                  {localImages.map((img) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="aspect-square relative rounded-xl overflow-hidden border border-nothing-gray group"
                    >
                      <img src={img.preview} alt="New Preview" className="w-full h-full object-cover" />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleRemoveLocalImage(img.id)}
                          className="p-2 bg-nothing-red rounded-full text-white hover:scale-110 transition-transform"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-nothing-gray bg-nothing-dark flex justify-end gap-4">
          <button
            onClick={() => dispatch(closeAddModal())}
            className="px-6 py-3 rounded-full text-sm font-mono text-nothing-muted hover:text-nothing-white transition-colors uppercase tracking-wide"
          >
            Cancel
          </button>
          <Button onClick={handleSubmit} withArrow className="py-3 px-6 text-sm">
            List Item
          </Button>
        </div>

      </motion.div>
    </div>
  );
};

export default AddProductModal;