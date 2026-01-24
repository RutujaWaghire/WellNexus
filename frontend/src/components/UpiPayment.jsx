import React, { useState } from 'react';

/**
 * Simple UPI Payment Component
 * Basic payment confirmation without complex integrations
 */
const UpiPayment = ({ show, onClose, amount, onPaymentSuccess, deliveryAddress }) => {
  const [processing, setProcessing] = useState(false);
  const [transactionId] = useState(`TXN${Date.now()}`);

  const handlePayment = () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const orderId = `ORD${Date.now()}`;
      onPaymentSuccess({
        amount,
        orderId,
        transactionId,
        method: 'UPI Payment',
        upiId: 'wellnexus@upi',
      });
      setProcessing(false);
    }, 1500);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 scale-in">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-t-2xl text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">💳 Payment</h2>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
              disabled={processing}
            >
              ✕
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm opacity-90">Amount to Pay</p>
            <p className="text-4xl font-bold">₹{amount?.toFixed(2)}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-semibold">ORD{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono font-semibold">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold">UPI</span>
              </div>
            </div>
          </div>

          {deliveryAddress && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-gray-800 mb-2">📦 Delivery Address</p>
              <div className="text-sm text-gray-700">
                <p className="font-semibold">{deliveryAddress.name}</p>
                <p>{deliveryAddress.address}</p>
                <p>{deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}</p>
                <p className="text-gray-600 mt-1">📧 {deliveryAddress.email}</p>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full btn-primary btn-animated disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg font-semibold"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>✓</span>
                Confirm Payment
              </span>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 Secure payment • Email confirmation will be sent
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpiPayment;
