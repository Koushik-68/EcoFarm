import { useState } from 'react';
import { Product, ShippingOption } from '../types';
import { Search, Plus, Calendar, Package, Truck, ShoppingCart, X, CreditCard, ChevronRight, MapPin } from 'lucide-react';

const categories = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Dairy',
  'Herbs',
  'Seeds',
  'Organic Fertilizers',
  'Farm Equipment',
  'Other'
] as const;

type Category = typeof categories[number];

const subcategories: Record<Category, string[]> = {
  Vegetables: ['Leafy Greens', 'Root Vegetables', 'Tomatoes', 'Peppers', 'Others'],
  Fruits: ['Citrus', 'Berries', 'Tree Fruits', 'Tropical', 'Others'],
  Grains: ['Rice', 'Wheat', 'Corn', 'Millets', 'Others'],
  Dairy: ['Milk', 'Cheese', 'Butter', 'Yogurt', 'Others'],
  Herbs: ['Culinary', 'Medicinal', 'Fresh', 'Dried', 'Others'],
  Seeds: ['Vegetable Seeds', 'Fruit Seeds', 'Grain Seeds', 'Flower Seeds', 'Others'],
  'Organic Fertilizers': ['Compost', 'Manure', 'Bone Meal', 'Others'],
  'Farm Equipment': ['Tools', 'Machinery', 'Irrigation', 'Others'],
  'Other': ['Miscellaneous']
};

const defaultShippingOptions: ShippingOption[] = [
  { id: '1', name: 'Local Pickup', price: 0, estimatedDays: '0-1' },
  { id: '2', name: 'Standard Delivery', price: 10, estimatedDays: '2-3' },
  { id: '3', name: 'Express Delivery', price: 25, estimatedDays: '1' }
];

// Mock data - Replace with actual API calls
const mockProducts: Product[] = [
  {
    id: '1',
    farmerId: 'f1',
    farmerName: 'Green Valley Farm',
    title: 'Organic Tomatoes',
    description: 'Fresh, locally grown organic tomatoes. Perfect for salads and cooking. Grown without pesticides.',
    price: 299,
    quantity: 100,
    unit: 'kg',
    category: 'Vegetables',
    subcategory: 'Tomatoes',
    images: ['/images/tomatoes.jpg'],
    location: 'Bangalore, KA',
    createdAt: new Date(),
    organic: true,
    certification: ['USDA Organic'],
    harvestDate: new Date(),
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    minimumOrder: 2,
    availableForBulk: true,
    bulkDiscount: 10,
    shippingOptions: defaultShippingOptions,
    paymentMethods: ['Credit Card', 'UPI', 'Net Banking'],
    status: 'available'
  },
  {
    id: '2',
    farmerId: 'f2',
    farmerName: 'Sunrise Orchards',
    title: 'Fresh Apples - Mixed Varieties',
    description: 'A delightful mix of Kashmiri and Himachali apples. Perfect blend of sweet and crisp.',
    price: 199,
    quantity: 500,
    unit: 'kg',
    category: 'Fruits',
    subcategory: 'Tree Fruits',
    images: ['/images/apples.jpg'],
    location: 'Shimla, HP',
    createdAt: new Date(),
    organic: false,
    harvestDate: new Date(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    minimumOrder: 5,
    availableForBulk: true,
    bulkDiscount: 15,
    shippingOptions: defaultShippingOptions,
    paymentMethods: ['Credit Card', 'UPI', 'Net Banking'],
    status: 'available'
  },
  {
    id: '3',
    farmerId: 'f3',
    farmerName: 'Heritage Grains Co.',
    title: 'Organic Quinoa',
    description: 'Premium organic quinoa. High in protein and perfect for healthy meals. Direct from our sustainable farm.',
    price: 5.99,
    quantity: 200,
    unit: 'lb',
    category: 'Grains',
    subcategory: 'Others',
    images: ['/images/quinoa.jpg'],
    location: 'Boulder, CO',
    createdAt: new Date(),
    organic: true,
    certification: ['USDA Organic', 'Non-GMO'],
    harvestDate: new Date(),
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    minimumOrder: 5,
    availableForBulk: true,
    bulkDiscount: 20,
    shippingOptions: defaultShippingOptions,
    paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cryptocurrency'],
    status: 'available'
  },
  {
    id: '4',
    farmerId: 'f4',
    farmerName: 'Fresh Dairy Farm',
    title: 'Organic Raw Milk',
    description: 'Fresh, unpasteurized milk from grass-fed cows. Rich in nutrients and natural probiotics.',
    price: 4.99,
    quantity: 50,
    unit: 'gallon',
    category: 'Dairy',
    subcategory: 'Milk',
    images: ['/images/milk.jpg'],
    location: 'Madison, WI',
    createdAt: new Date(),
    organic: true,
    certification: ['USDA Organic', 'Animal Welfare Approved'],
    harvestDate: new Date(),
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    minimumOrder: 1,
    availableForBulk: false,
    shippingOptions: [
      { id: '1', name: 'Local Pickup Only', price: 0, estimatedDays: '0-1' }
    ],
    paymentMethods: ['Credit Card', 'Cash'],
    status: 'low-stock'
  },
  {
    id: '5',
    farmerId: 'f5',
    farmerName: 'Herbal Haven',
    title: 'Fresh Basil Bundle',
    description: 'Large bundles of fresh, aromatic basil. Perfect for pesto, Italian cuisine, and garnishing.',
    price: 2.99,
    quantity: 75,
    unit: 'bundle',
    category: 'Herbs',
    subcategory: 'Fresh',
    images: ['/images/basil.jpg'],
    location: 'Portland, OR',
    createdAt: new Date(),
    organic: true,
    certification: ['USDA Organic'],
    harvestDate: new Date(),
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    minimumOrder: 3,
    availableForBulk: true,
    bulkDiscount: 10,
    shippingOptions: defaultShippingOptions,
    paymentMethods: ['Credit Card', 'PayPal'],
    status: 'available'
  },
  {
    id: '6',
    farmerId: 'f6',
    farmerName: 'Future Seeds',
    title: 'Heirloom Tomato Seeds',
    description: 'Mixed variety of heirloom tomato seeds. Non-GMO and naturally preserved. High germination rate.',
    price: 4.50,
    quantity: 1000,
    unit: 'packet',
    category: 'Seeds',
    subcategory: 'Vegetable Seeds',
    images: ['/images/tomato-seeds.jpg'],
    location: 'Santa Cruz, CA',
    createdAt: new Date(),
    organic: true,
    certification: ['Non-GMO', 'Heirloom Verified'],
    harvestDate: new Date(),
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    minimumOrder: 2,
    availableForBulk: true,
    bulkDiscount: 25,
    shippingOptions: defaultShippingOptions,
    paymentMethods: ['Credit Card', 'PayPal', 'Cryptocurrency'],
    status: 'available'
  }
];

export default function Marketplace() {
  const [view, setView] = useState<'buy' | 'sell'>('buy');
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [showBulkOnly, setShowBulkOnly] = useState(false);
  const [cart, setCart] = useState<{id: string, quantity: number}[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showNewListingForm, setShowNewListingForm] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'payment'>('cart');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | ''>('');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSubcategory = selectedSubcategory ? product.subcategory === selectedSubcategory : true;
    const matchesOrganic = organicOnly ? product.organic : true;
    const matchesBulk = showBulkOnly ? product.availableForBulk : true;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesSubcategory && matchesOrganic && matchesBulk && matchesPrice;
  });

  const featuredProducts = products
    .filter(p => p.organic && Array.isArray(p.certification) && p.certification.length > 0)
    .slice(0, 3);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Farmers Marketplace</h1>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-lg overflow-hidden">
            <button
              onClick={() => setView('buy')}
              className={`px-4 py-2 ${view === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
            >
              Buy Products
            </button>
            <button
              onClick={() => setView('sell')}
              className={`px-4 py-2 ${view === 'sell' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
            >
              Sell Products
            </button>
          </div>
          {view === 'sell' && (
            <button
              onClick={() => setShowNewListingForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus className="mr-2" size={20} />
              New Listing
            </button>
          )}
        </div>
      </div>

      {/* Featured Products Section */}
      {view === 'buy' && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <div key={product.id} className="relative border rounded-lg overflow-hidden shadow-lg bg-white">
                <div className="absolute top-2 right-2 z-10">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                    Featured
                  </span>
                </div>
                <div className="h-48 bg-gray-200">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{product.title}</h3>
                    <div className="text-right">
                      <span className="text-green-600 font-bold">₹{product.price}/{product.unit}</span>
                      {product.bulkDiscount && product.bulkDiscount > 0 && (
                        <div className="text-sm text-green-500">
                          {product.bulkDiscount}% bulk discount
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {product.certification?.map(cert => (
                      <span key={cert} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {cert}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Stats */}
      {view === 'buy' && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-lg font-semibold">Active Sellers</div>
            <div className="text-2xl text-green-600">24</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-lg font-semibold">Available Products</div>
            <div className="text-2xl text-green-600">{products.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-lg font-semibold">Organic Products</div>
            <div className="text-2xl text-green-600">
              {products.filter(p => p.organic).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-lg font-semibold">Categories</div>
            <div className="text-2xl text-green-600">{categories.length}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="col-span-1 space-y-6 bg-white p-4 rounded-lg shadow">
          <div>
            <h3 className="font-semibold mb-2">Search</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <select
              className="w-full border rounded-lg px-4 py-2"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value as Category | '');
                setSelectedSubcategory('');
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {selectedCategory && subcategories[selectedCategory] && (
            <div>
              <h3 className="font-semibold mb-2">Subcategory</h3>
              <select
                className="w-full border rounded-lg px-4 py-2"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
              >
                <option value="">All Subcategories</option>
                {subcategories[selectedCategory].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Price Range</h3>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                className="w-24 border rounded-lg px-2 py-1"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              />
              <span>to</span>
              <input
                type="number"
                className="w-24 border rounded-lg px-2 py-1"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="form-checkbox"
              />
              <span>Organic Only</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showBulkOnly}
                onChange={(e) => setShowBulkOnly(e.target.checked)}
                className="form-checkbox"
              />
              <span>Bulk Deals Only</span>
            </label>
          </div>
        </div>

        {/* Product Grid */}
        <div className="col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg bg-white">
                <div className="relative h-48 bg-gray-200">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {product.status !== 'available' && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                      {product.status}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{product.title}</h3>
                    <div className="text-right">
                      <span className="text-green-600 font-bold">₹{product.price}/{product.unit}</span>
                      {product.bulkDiscount && product.bulkDiscount > 0 && (
                        <div className="text-sm text-green-500">
                          {product.bulkDiscount}% bulk discount
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {product.organic && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Organic
                      </span>
                    )}
                    {product.certification?.map(cert => (
                      <span key={cert} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {cert}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm text-gray-500">
                    {product.harvestDate && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Harvest Date: {product.harvestDate.toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Min. Order: {product.minimumOrder} {product.unit}
                    </div>
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 mr-2" />
                      {product.shippingOptions.length} shipping options
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">By {product.farmerName}</span>
                    {view === 'buy' && product.status === 'available' && (
                      <button
                        onClick={() => addToCart(product.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Button */}
      {view === 'buy' && (
        <button
          onClick={() => setShowCartModal(true)}
          className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 flex items-center justify-center"
        >
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-2xl font-semibold">
                {checkoutStep === 'cart' && 'Shopping Cart'}
                {checkoutStep === 'address' && 'Shipping Address'}
                {checkoutStep === 'payment' && 'Payment Method'}
              </h2>
              <button onClick={() => setShowCartModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 150px)' }}>
              {checkoutStep === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      {cart.map(item => {
                        const product = products.find(p => p.id === item.id);
                        if (!product) return null;
                        return (
                          <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                            <div className="w-20 h-20 bg-gray-100 rounded">
                              {product.images[0] && (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-full h-full object-cover rounded"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{product.title}</h3>
                              <p className="text-sm text-gray-500">₹{product.price} per {product.unit}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="w-12 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{(product.price * item.quantity).toFixed(2)}</p>
                              {product.bulkDiscount && item.quantity >= (product.minimumOrder || 0) && (
                                <p className="text-sm text-green-600">
                                  {product.bulkDiscount}% off
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div className="mt-6 space-y-4">
                        <div className="flex justify-between text-lg font-medium">
                          <span>Subtotal</span>
                          <span>₹{calculateTotal().toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => setCheckoutStep('address')}
                          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center"
                        >
                          Continue to Shipping <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}

              {checkoutStep === 'address' && (
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  setCheckoutStep('payment');
                }}>
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full border rounded-lg px-4 py-2"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      className="w-full border rounded-lg px-4 py-2"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea
                      required
                      className="w-full border rounded-lg px-4 py-2"
                      rows={3}
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        required
                        className="w-full border rounded-lg px-4 py-2"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        required
                        className="w-full border rounded-lg px-4 py-2"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{6}"
                      className="w-full border rounded-lg px-4 py-2"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, pincode: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="block p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={selectedPaymentMethod === 'upi'}
                        onChange={(e) => setSelectedPaymentMethod('upi')}
                        className="mr-2"
                      />
                      UPI Payment
                    </label>
                    <label className="block p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={selectedPaymentMethod === 'card'}
                        onChange={(e) => setSelectedPaymentMethod('card')}
                        className="mr-2"
                      />
                      Credit/Debit Card
                    </label>
                    <label className="block p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="netbanking"
                        checked={selectedPaymentMethod === 'netbanking'}
                        onChange={(e) => setSelectedPaymentMethod('netbanking')}
                        className="mr-2"
                      />
                      Net Banking
                    </label>
                  </div>

                  <div className="border-t pt-6">
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Shipping</span>
                        <span>₹49.00</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>₹{(calculateTotal() + 49).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setCheckoutStep('address')}
                        className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={proceedToCheckout}
                        disabled={!selectedPaymentMethod}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function addToCart(productId: string) {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
  }

  function updateCartQuantity(productId: string, newQuantity: number) {
    if (newQuantity < 1) {
      setCart(prev => prev.filter(item => item.id !== productId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  }

  function calculateTotal() {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      if (!product) return total;
      const price = product.price * item.quantity;
      // Apply bulk discount if applicable
      if (product.availableForBulk && item.quantity >= (product.minimumOrder || 0)) {
        return total + (price * (1 - (product.bulkDiscount || 0) / 100));
      }
      return total + price;
    }, 0);
  }

  function proceedToCheckout() {
    const orderSummary = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      return {
        productId: item.id,
        productName: product?.title,
        quantity: item.quantity,
        unitPrice: product?.price,
        totalPrice: product ? product.price * item.quantity : 0,
        discount: product?.bulkDiscount && item.quantity >= (product.minimumOrder || 0) 
          ? (product.price * item.quantity * (product.bulkDiscount / 100)) 
          : 0
      };
    });

    const total = calculateTotal();
    
    // You would typically send this to your backend
    const order = {
      orderId: `ORD${Date.now()}`,
      items: orderSummary,
      totalAmount: total + 49, // Including shipping
      shippingAmount: 49,
      orderDate: new Date(),
      paymentStatus: 'pending',
      paymentMethod: selectedPaymentMethod,
      shippingAddress: shippingAddress,
    };

    // Simulate payment processing
    alert(
      `Order Placed Successfully!\n\n` +
      `Order ID: ${order.orderId}\n` +
      `Shipping to: ${order.shippingAddress.fullName}\n` +
      `Address: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}\n` +
      `Payment Method: ${order.paymentMethod.toUpperCase()}\n` +
      `Total Amount: ₹${order.totalAmount.toFixed(2)}\n\n` +
      `Thank you for shopping with us!`
    );

    // Reset cart and checkout state
    setCart([]);
    setShowCartModal(false);
    setCheckoutStep('cart');
    setSelectedPaymentMethod('');
    setShippingAddress({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    });
  }
} 