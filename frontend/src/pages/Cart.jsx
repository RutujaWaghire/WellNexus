import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import PaymentSuccess from '../components/PaymentSuccess';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [cart, setCart] = useState({ products: [], sessions: [] });
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ amount: 0, orderId: '' });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '{"products": [], "sessions": []}');
    setCart(savedCart);
  };

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const removeProduct = (index) => {
    const newCart = {
      ...cart,
      products: cart.products.filter((_, i) => i !== index)
    };
    updateCart(newCart);
    addToast('Product removed from cart', 'info');
  };

  const removeSession = (index) => {
    const newCart = {
      ...cart,
      sessions: cart.sessions.filter((_, i) => i !== index)
    };
    updateCart(newCart);
    addToast('Session removed from cart', 'info');
  };

  const updateQuantity = (index, delta) => {
    const newProducts = [...cart.products];
    newProducts[index].quantity = Math.max(1, (newProducts[index].quantity || 1) + delta);
    updateCart({ ...cart, products: newProducts });
  };

  const calculateTotal = () => {
    const productTotal = cart.products.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const sessionTotal = cart.sessions.reduce((sum, item) => sum + item.fee, 0);
    return productTotal + sessionTotal;
  };

  const handleCheckout = () => {
    if (!user) {
      addToast('Please login to checkout', 'warning');
      navigate('/login');
      return;
    }

    if (cart.products.length === 0 && cart.sessions.length === 0) {
      addToast('Your cart is empty', 'warning');
      return;
    }

    const total = calculateTotal();
    const orderId = `ORD${Date.now()}`;
    
    addToast('Processing payment...', 'info');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentDetails({ amount: total, orderId });
      setShowPaymentSuccess(true);
      updateCart({ products: [], sessions: [] });
    }, 1500);
  };

  const handlePaymentClose = () => {
    setShowPaymentSuccess(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 fade-in">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 slide-down">
          🛒 Your Cart
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-wellness-green text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Products ({cart.products.length})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'sessions'
                ? 'bg-wellness-green text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Therapy Sessions ({cart.sessions.length})
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {activeTab === 'products' && (
              <>
                {cart.products.length === 0 ? (
                  <div className="wellness-card text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">No products in cart</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="btn-primary btn-animated"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  cart.products.map((item, index) => (
                    <div key={index} className="wellness-card-hover">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                          {item.emoji || '📦'}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                              <button
                                onClick={() => updateQuantity(index, -1)}
                                className="px-3 py-1 hover:bg-gray-200 rounded-l-lg transition"
                              >
                                −
                              </button>
                              <span className="px-4 font-semibold">{item.quantity || 1}</span>
                              <button
                                onClick={() => updateQuantity(index, 1)}
                                className="px-3 py-1 hover:bg-gray-200 rounded-r-lg transition"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xl font-bold text-wellness-green">
                              ₹{item.price * (item.quantity || 1)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeProduct(index)}
                          className="text-red-500 hover:text-red-700 transition self-start"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'sessions' && (
              <>
                {cart.sessions.length === 0 ? (
                  <div className="wellness-card text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">No therapy sessions in cart</p>
                    <button
                      onClick={() => navigate('/practitioners')}
                      className="btn-primary btn-animated"
                    >
                      Book a Session
                    </button>
                  </div>
                ) : (
                  cart.sessions.map((item, index) => (
                    <div key={index} className="wellness-card-hover">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                          👨‍⚕️
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800">{item.practitioner}</h3>
                          <p className="text-sm text-gray-600">{item.specialization}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            📅 {item.date} at {item.time}
                          </p>
                          <span className="text-xl font-bold text-wellness-green mt-2 inline-block">
                            ₹{item.fee}
                          </span>
                        </div>
                        <button
                          onClick={() => removeSession(index)}
                          className="text-red-500 hover:text-red-700 transition self-start"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="wellness-card sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Products</span>
                  <span>{cart.products.length} items</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Sessions</span>
                  <span>{cart.sessions.length} bookings</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-wellness-green">₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.products.length === 0 && cart.sessions.length === 0}
                className="w-full btn-primary btn-animated disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💳 Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secure checkout with encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      <PaymentSuccess
        show={showPaymentSuccess}
        onClose={handlePaymentClose}
        amount={paymentDetails.amount}
        orderId={paymentDetails.orderId}
      />
    </div>
  );
};

export default Cart;
