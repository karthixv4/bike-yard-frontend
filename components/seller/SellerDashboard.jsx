import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { startTour, openAddModal, fetchSellerProducts, fetchSellerOrders, openEditModal, setSelectedOrder, deleteSellerProduct } from '../../store/slices/sellerSlice';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import DashboardTour from './DashboardTour';
import EditProductModal from './EditProductModal';
import AddProductModal from './AddProductModal';
import {
  TrendingUp,
  Package,
  DollarSign,
  Plus,
  ShoppingBag,
  ArrowUpRight,
  Bike,
  Wrench,
  Image as ImageIcon,
  Edit2,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import ProductInspectionsModal from './ProductInspectionsModal';
import OrderDetailModal from './OrderDetailModal';
import Footer from '../common/Footer';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-nothing-dark border border-nothing-gray rounded-3xl p-6 flex flex-col justify-between h-40 relative overflow-hidden group"
  >
    <div className="flex justify-between items-start z-10">
      <div className="p-2 bg-nothing-black rounded-lg border border-nothing-gray/50 text-nothing-muted group-hover:text-nothing-red transition-colors">
        <Icon size={20} />
      </div>
      {trend && (
        <span className="text-xs font-mono text-green-500 flex items-center gap-1 bg-green-900/20 px-2 py-1 rounded">
          {trend} <ArrowUpRight size={12} />
        </span>
      )}
    </div>
    <div className="z-10">
      <h3 className="text-3xl font-medium tracking-tighter text-nothing-white">{value}</h3>
      <p className="text-xs font-mono text-nothing-muted uppercase tracking-widest mt-1">{title}</p>
    </div>

    {/* Background decoration */}
    <Icon size={100} className="absolute -bottom-4 -right-4 text-nothing-white/5 rotate-12" />
  </motion.div>
);

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products, sales, stats, isTourOpen, isAddModalOpen, isEditModalOpen, selectedSale } = useSelector((state) => state.seller);
  // Tab State
  const [activeTab, setActiveTab] = useState('inventory');
  const [inspectionModalProduct, setInspectionModalProduct] = useState(null);

  // Delete State
  const [productToDelete, setProductToDelete] = useState(null);



  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchSellerProducts());
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  // Fetch listings on mount
  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  // Use name from auth or fallback
  const userName = user?.name || 'Seller';

  const handleEditProduct = (product) => {
    dispatch(openEditModal(product));
  };

  const handleDeleteClick = (e, product) => {
    e.stopPropagation();
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteSellerProduct(productToDelete.id));
      setProductToDelete(null);
    }
  };

  const getStatusIcon = (status) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'delivered': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'shipped': return <Truck size={16} className="text-purple-500" />;
      case 'cancelled': return <XCircle size={16} className="text-nothing-red" />;
      default: return <Clock size={16} className="text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-nothing-black text-nothing-white selection:bg-nothing-red selection:text-white transition-colors duration-300 flex flex-col">
      <Navbar userName={userName} role="Seller" />

      {/* Tour Overlay */}
      <AnimatePresence>
        {isTourOpen && <DashboardTour />}
      </AnimatePresence>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && <AddProductModal />}
      </AnimatePresence>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedSale && <OrderDetailModal />}
      </AnimatePresence>
      {/* Edit Product Modal */}
      <AnimatePresence>
        {isEditModalOpen && <EditProductModal />}
      </AnimatePresence>


      {/* Inspections Modal */}
      <AnimatePresence>
        {inspectionModalProduct && (
          <ProductInspectionsModal
            productId={inspectionModalProduct.id}
            productName={inspectionModalProduct.title}
            onClose={() => setInspectionModalProduct(null)}
          />
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setProductToDelete(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="relative bg-nothing-dark border border-nothing-red/50 w-full max-w-sm rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-nothing-red/10 border border-nothing-red/20 flex items-center justify-center mb-6 text-nothing-red">
                <Trash2 size={24} />
              </div>

              <h3 className="text-xl font-medium text-nothing-white tracking-tight mb-2">
                Delete Product?
              </h3>
              <p className="text-nothing-muted text-sm leading-relaxed mb-6">
                Are you sure you want to delete <span className="text-nothing-white font-medium">"{productToDelete.title}"</span>? This action cannot be undone.
              </p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-3 px-4 rounded-full border border-nothing-gray text-nothing-white hover:bg-white/5 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-4 rounded-full bg-nothing-red text-white hover:bg-[#b0141b] transition-colors font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-medium tracking-tight text-nothing-white">Overview.</h1>
            <p className="text-nothing-muted font-light">Here's what's happening with your store today.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="secondary" onClick={() => { }} className="text-sm py-3 px-6">
              Download Report
            </Button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total Revenue"
            value={`₹${stats.revenue.toLocaleString()}`}
            icon={DollarSign}
            trend="+12%"
          />
          <StatCard
            title="Items Sold"
            value={stats.totalOrders}
            icon={ShoppingBag}
          />
        </div>

        {/* Content Tabs */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-8 border-b border-nothing-gray">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`pb-4 text-sm font-mono uppercase tracking-widest transition-colors relative ${activeTab === 'inventory' ? 'text-nothing-white' : 'text-nothing-muted hover:text-nothing-white'
                  }`}
              >
                Inventory
                {activeTab === 'inventory' && <motion.div layoutId="dash_underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-nothing-red" />}
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-4 text-sm font-mono uppercase tracking-widest transition-colors relative ${activeTab === 'orders' ? 'text-nothing-white' : 'text-nothing-muted hover:text-nothing-white'
                  }`}
              >
                Sales
                {activeTab === 'orders' && <motion.div layoutId="dash_underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-nothing-red" />}
              </button>
            </div>

            {activeTab === 'inventory' && (
              <button
                onClick={() => dispatch(openAddModal())}
                className="flex items-center gap-2 text-sm font-mono text-nothing-red hover:text-white transition-colors uppercase tracking-wide"
              >
                <Plus size={16} /> Add Item
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main List Area (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">

              <AnimatePresence mode="wait">
                {activeTab === 'inventory' ? (
                  <motion.div
                    key="inventory"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {products.length === 0 ? (
                      <div className="bg-nothing-dark border border-dashed border-nothing-gray rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6">
                        <div className="w-20 h-20 bg-nothing-black rounded-full flex items-center justify-center border border-nothing-gray mb-2">
                          <Package size={32} className="text-nothing-muted" />
                        </div>
                        <div className="space-y-2 max-w-md">
                          <h3 className="text-xl font-medium text-nothing-white">Your inventory is empty.</h3>
                          <p className="text-nothing-muted font-light text-sm">
                            Start by listing a spare part or a refurbished bike.
                          </p>
                        </div>
                        <Button onClick={() => dispatch(openAddModal())} withArrow>Add Item</Button>
                      </div>
                    ) : (
                      <div className="bg-nothing-dark border border-nothing-gray rounded-3xl overflow-hidden">
                        <div className="grid grid-cols-4 p-4 border-b border-nothing-gray bg-nothing-black/50 text-xs font-mono text-nothing-muted uppercase tracking-wider">
                          <div className="col-span-2 pl-2">Item</div>
                          <div className="col-span-2 text-right pr-4">Actions & Price</div>
                        </div>
                        <div className="divide-y divide-nothing-gray">
                          {products.map((product) => (
                            <motion.div
                              key={product.id}
                              className="grid grid-cols-4 p-4 items-center hover:bg-nothing-white/5 transition-colors group relative"
                            >
                              <div className="col-span-2 flex items-center gap-4 cursor-pointer" onClick={() => handleEditProduct(product)}>
                                <div className="w-10 h-10 rounded bg-nothing-black border border-nothing-gray flex items-center justify-center shrink-0 overflow-hidden">
                                  {product.images && product.images.length > 0 ? (
                                    <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                                  ) : (
                                    product.type === 'BIKE' ? <Bike size={18} /> : <Wrench size={18} />
                                  )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-medium text-sm truncate text-nothing-white group-hover:text-nothing-red transition-colors">{product.title}</span>
                                  <span className="text-xs font-mono text-nothing-muted uppercase tracking-wider">
                                    {product.type === 'BIKE' ? `${product.year} • ${product.condition}` : product.category || 'Part'}
                                  </span>
                                </div>
                              </div>
                              <div className="col-span-2 text-right font-mono text-sm text-nothing-white pr-4 flex items-center justify-end gap-3">
                                <span className="mr-2">₹{product.price.toLocaleString()}</span>
                                <div className="flex gap-2">
                                  {product.type === 'bike' && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setInspectionModalProduct({ id: product.id, name: product.name }); }}
                                      className="p-1.5 rounded-full hover:bg-nothing-white/10 text-nothing-muted hover:text-blue-400 transition-colors"
                                      title="View Inspections"
                                    >
                                      <ShieldCheck size={16} />
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleEditProduct(product); }}
                                    className="p-1.5 rounded-full hover:bg-nothing-white/10 text-nothing-muted hover:text-white transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteClick(e, product)}
                                    className="p-1.5 rounded-full hover:bg-nothing-red/20 text-nothing-muted hover:text-nothing-red transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {sales.length === 0 ? (
                      <div className="bg-nothing-dark border border-dashed border-nothing-gray rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6">
                        <div className="w-20 h-20 bg-nothing-black rounded-full flex items-center justify-center border border-nothing-gray mb-2">
                          <ShoppingBag size={32} className="text-nothing-muted" />
                        </div>
                        <h3 className="text-xl font-medium text-nothing-white">No sales yet.</h3>
                        <p className="text-nothing-muted font-light text-sm">Sold items will appear here once customers start buying.</p>
                      </div>
                    ) : (
                      <div className="bg-nothing-dark border border-nothing-gray rounded-3xl overflow-hidden">
                        <div className="grid grid-cols-5 p-4 border-b border-nothing-gray bg-nothing-black/50 text-xs font-mono text-nothing-muted uppercase tracking-wider">
                          <div className="col-span-2 pl-2">Item & Buyer</div>
                          <div className="text-center">Date</div>
                          <div className="text-center">Order Status</div>
                          <div className="text-right pr-4">Total</div>
                        </div>
                        <div className="divide-y divide-nothing-gray">
                          {sales.map((sale) => (
                            <motion.div
                              key={sale.id}
                              onClick={() => dispatch(setSelectedOrder(sale))}
                              className="grid grid-cols-5 p-4 items-center hover:bg-nothing-white/5 transition-colors cursor-pointer group"
                            >
                              <div className="col-span-2 flex flex-col min-w-0 pl-2">
                                <span className="font-medium text-sm truncate text-nothing-white group-hover:text-nothing-red transition-colors">{sale.product.title}</span>
                                <span className="text-xs font-mono text-nothing-muted truncate">By {sale.order.buyer.name}</span>
                              </div>
                              <div className="text-center text-xs text-nothing-muted font-mono">
                                {sale.order.createdAt}
                              </div>
                              <div className="flex justify-center">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono uppercase border ${sale.order.status === 'DELIVERED' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                                  sale.order.status === 'SHIPPED' ? 'border-purple-500/30 text-purple-500 bg-purple-500/10' :
                                    sale.order.status === 'CANCELLED' ? 'border-nothing-red/30 text-nothing-red bg-nothing-red/10' :
                                      'border-yellow-500/30 text-yellow-500 bg-yellow-500/10'
                                  }`}>
                                  {getStatusIcon(sale.order.status)}
                                  {sale.order.status}
                                </span>
                              </div>
                              <div className="text-right font-mono text-sm text-nothing-white pr-4">
                                ₹{(sale.priceAtPurchase * sale.quantity).toLocaleString()}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Recent Activity (Side Col) */}
            <div className="space-y-6">
              <h2 className="text-2xl font-medium text-nothing-white">Activity.</h2>
              <div className="bg-nothing-dark border border-nothing-gray rounded-3xl p-6 min-h-[300px]">
                <div className="flex gap-4 items-start relative pb-8">
                  <div className="absolute left-[11px] top-3 bottom-0 w-px bg-nothing-gray" />
                  <div className="w-2.5 h-2.5 mt-1.5 bg-green-500 rounded-full shrink-0 z-10 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <div>
                    <p className="text-sm text-nothing-white font-medium">Store setup completed</p>
                    <p className="text-xs text-nothing-muted font-mono mt-1">Today</p>
                  </div>
                </div>

                {/* Recent sales */}
                {sales.slice(0, 3).map((s, i) => (
                  <div key={s.id} className="flex gap-4 items-start relative pb-8">
                    <div className="absolute left-[11px] top-3 bottom-0 w-px bg-nothing-gray" />
                    <div className="w-2.5 h-2.5 mt-1.5 bg-blue-500 rounded-full shrink-0 z-10" />
                    <div>
                      <p className="text-sm text-nothing-white">Sold <span className="font-medium">{s.product.title}</span></p>
                      <div className="mt-2 p-2 bg-nothing-black border border-nothing-gray rounded-xl">
                        <p className="text-xs font-mono text-nothing-white">Buyer: {s.order.buyer.name}</p>
                        <p className="text-xs text-nothing-muted mt-1">Amt: ₹{s.priceAtPurchase.toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-nothing-muted font-mono mt-2">{s.order.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerDashboard;