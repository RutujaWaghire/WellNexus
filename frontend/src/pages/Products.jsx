import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoader';
import SearchFilter from '../components/SearchFilter';
import UpiPayment from '../components/UpiPayment';
import PaymentSuccess from '../components/PaymentSuccess';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const { addToast } = useToast();
  
  // Payment states
  const [showUpiPayment, setShowUpiPayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({ 
    amount: 0, 
    orderId: '', 
    transactionId: '',
    method: '',
    upiId: '' 
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAvailable();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      applyFilters();
      return;
    }

    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...products];

    // Filter by category if set from buttons
    if (filter !== 'all') {
      filtered = filtered.filter(p => p.category === filter);
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.includes('+')
        ? [parseInt(filters.priceRange), Infinity]
        : filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => p.price >= min && (max ? p.price <= max : true));
    }

    // Sort
    if (filters.sortBy) {
      switch(filters.sortBy) {
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'newest':
          filtered.sort((a, b) => b.id - a.id);
          break;
      }
    }

    setFilteredProducts(filtered);
  };

  const applyFilters = () => {
    if (filter === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === filter));
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filter, products]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '{"products": [], "sessions": []}');
    
    // Check if product already in cart
    const existingIndex = cart.products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      cart.products[existingIndex].quantity = (cart.products[existingIndex].quantity || 1) + 1;
      addToast('Quantity updated in cart', 'success');
    } else {
      cart.products.push({ ...product, quantity: 1 });
      addToast('Added to cart! 🛒', 'success');
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const buyNow = (product) => {
    if (!user) {
      addToast('Please login to buy products', 'warning');
      navigate('/login');
      return;
    }
    
    if (product.stock === 0) {
      addToast('Product out of stock', 'error');
      return;
    }
    
    // Set selected product and payment details
    setSelectedProduct(product);
    setPaymentDetails({ 
      amount: product.price, 
      orderId: `ORD${Date.now()}`,
      transactionId: '',
      method: '',
      upiId: '' 
    });
    setShowUpiPayment(true);
  };

  const handlePaymentSuccess = async (details) => {
    try {
      // Create order after successful payment
      await orderService.create({
        userId: user.userId,
        productId: selectedProduct.id,
        quantity: 1,
        totalAmount: selectedProduct.price,
        status: 'CONFIRMED'
      });
      
      setPaymentDetails(prev => ({ ...prev, ...details }));
      setShowUpiPayment(false);
      setShowPaymentSuccess(true);
      addToast('Order placed successfully! 🎉', 'success');
      loadProducts();
    } catch (error) {
      console.error('Error creating order:', error);
      addToast('Payment successful but error saving order', 'warning');
      setShowUpiPayment(false);
    }
  };

  const handlePaymentClose = () => {
    setShowPaymentSuccess(false);
    setSelectedProduct(null);
  };

  const handleUpiPaymentClose = () => {
    setShowUpiPayment(false);
    setSelectedProduct(null);
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Product emoji mapping
  const getProductEmoji = (name) => {
    const emojiMap = {
      'yoga': '🧘',
      'mat': '🧘‍♀️',
      'oil': '🫗',
      'essential': '🌸',
      'supplement': '💊',
      'herbal': '🌿',
      'tea': '🍵',
      'meditation': '🧘',
      'cushion': '🪑',
      'ayurvedic': '🌿',
      'diffuser': '💨',
      'acupressure': '⚡'
    };
    
    const lowerName = name.toLowerCase();
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerName.includes(key)) return emoji;
    }
    return '📦';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 fade-in">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 slide-down">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🌿 Wellness Products
          </h1>
          <p className="text-xl text-gray-600">
            Discover natural products for your holistic wellbeing
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 slide-up">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all btn-animated ${
                filter === cat
                  ? 'bg-wellness-green text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Advanced Search & Filters */}
        <SearchFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          filters={{
            priceRange: true,
            sortBy: true
          }}
          placeholder="Search products by name, category, or description..."
        />

        {/* Products Grid */}
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`wellness-card-hover slide-up stagger-${(index % 4) + 1}`}
              >
                {/* Product Image/Icon */}
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  <span className="text-7xl wellness-image">
                    {getProductEmoji(product.name)}
                  </span>
                </div>

                {/* Product Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800 leading-tight">
                      {product.name}
                    </h3>
                    <span className="badge-success">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <p className="text-3xl font-bold text-wellness-green">
                        ₹{product.price}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 bg-white text-wellness-green px-4 py-3 rounded-lg font-semibold border-2 border-wellness-green hover:bg-green-50 transition-all btn-animated disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🛒 Add to Cart
                    </button>
                    <button
                      onClick={() => buyNow(product)}
                      disabled={product.stock === 0}
                      className="flex-1 btn-primary btn-animated disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      💳 Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16 wellness-card max-w-md mx-auto scale-in">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-xl text-gray-600 mb-6">No products found</p>
            <button
              onClick={() => setFilter('all')}
              className="btn-primary btn-animated"
            >
              View All Products
            </button>
          </div>
        )}
      </div>

      {/* UPI Payment Modal */}
      <UpiPayment
        show={showUpiPayment}
        onClose={handleUpiPaymentClose}
        amount={paymentDetails.amount}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Payment Success Modal */}
      <PaymentSuccess
        show={showPaymentSuccess}
        onClose={handlePaymentClose}
        amount={paymentDetails.amount}
        orderId={paymentDetails.orderId}
        transactionId={paymentDetails.transactionId}
        method={paymentDetails.method}
        upiId={paymentDetails.upiId}
      />
    </div>
  );
};

export default Products;
