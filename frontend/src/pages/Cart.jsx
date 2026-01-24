import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { orderService, sessionService } from '../services/api';
import UpiPayment from '../components/UpiPayment';
import PaymentSuccess from '../components/PaymentSuccess';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [cart, setCart] = useState({ products: [], sessions: [] });
  const [showUpiPayment, setShowUpiPayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({ 
    amount: 0, 
    orderId: '', 
    transactionId: '',
    method: '',
    upiId: '',
    deliveryAddress: null
  });

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

    // If there are products, show address modal first
    if (cart.products.length > 0) {
      setShowAddressModal(true);
    } else {
      // For sessions only, proceed directly to payment
      proceedToPayment();
    }
  };

  const handleAddressSubmit = () => {
    if (!deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.email ||
        !deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.pincode) {
      addToast('Please fill all address fields', 'warning');
      return;
    }
    setShowAddressModal(false);
    proceedToPayment();
  };

  const proceedToPayment = () => {
    const total = calculateTotal();
    setPaymentDetails({ 
      amount: total, 
      orderId: `ORD${Date.now()}`,
      transactionId: '',
      method: '',
      upiId: '',
      deliveryAddress: cart.products.length > 0 ? deliveryAddress : null
    });
    setShowUpiPayment(true);
  };

  const handlePaymentSuccess = async (details) => {
    setPaymentDetails(prev => ({ ...prev, ...details }));
    setShowUpiPayment(false);
    
    // Save orders to database
    let orderSaveError = false;
    
    try {
      // Create orders for each product
      if (cart.products.length > 0) {
        for (const item of cart.products) {
          await orderService.create({
            userId: user.userId,
            productId: item.id,
            quantity: item.quantity || 1,
            totalAmount: item.price * (item.quantity || 1),
            status: 'pending',
            deliveryName: deliveryAddress?.name,
            deliveryPhone: deliveryAddress?.phone,
            deliveryEmail: deliveryAddress?.email,
            deliveryAddress: deliveryAddress?.address,
            deliveryCity: deliveryAddress?.city,
            deliveryState: deliveryAddress?.state,
            deliveryPincode: deliveryAddress?.pincode,
            transactionId: details.transactionId,
            paymentMethod: details.method
          });
        }
        addToast('Orders saved successfully!', 'success');
      }
      
      // Create session bookings
      if (cart.sessions.length > 0) {
        for (const session of cart.sessions) {
          await sessionService.book({
            practitionerId: session.practitionerId,
            userId: user.userId,
            date: new Date(`${session.date}T${session.time}`).toISOString(),
            status: 'SCHEDULED',
            notes: `Booked: ${session.specialization}`
          });
        }
        addToast('Sessions booked successfully!', 'success');
      }
    } catch (error) {
      console.error('Error saving orders:', error);
      orderSaveError = true;
      addToast('Payment successful but error saving order', 'warning');
    }
    
    setShowPaymentSuccess(true);
    updateCart({ products: [], sessions: [] });
    
    if (!orderSaveError) {
      addToast('Payment successful!', 'success');
    }
  };

  const handlePaymentClose = () => {
    setShowPaymentSuccess(false);
    navigate('/dashboard');
  };

  const handleUpiPaymentClose = () => {
    setShowUpiPayment(false);
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

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 scale-in max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-t-2xl text-white">
              <h2 className="text-2xl font-bold">📍 Delivery Address</h2>
              <p className="text-sm opacity-90 mt-1">Enter your delivery details</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={deliveryAddress.name}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, name: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={deliveryAddress.phone}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={deliveryAddress.email}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, email: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">📧 Order confirmation will be sent here</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Complete Address *</label>
                <textarea
                  placeholder="House/Flat No., Building, Street"
                  value={deliveryAddress.address}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, address: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                ></textarea>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code *</label>
                  <input
                    type="text"
                    placeholder="400001"
                    maxLength="6"
                    value={deliveryAddress.pincode}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value.replace(/\D/g, '')})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddressSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPI Payment Modal */}
      <UpiPayment
        show={showUpiPayment}
        onClose={handleUpiPaymentClose}
        amount={paymentDetails.amount}
        onPaymentSuccess={handlePaymentSuccess}
        deliveryAddress={paymentDetails.deliveryAddress}
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
        deliveryAddress={paymentDetails.deliveryAddress}
      />
    </div>
  );
};

export default Cart;
