import React from 'react';

/**
 * PaymentSuccess Component
 * Shows beautiful success animation after payment
 * UPI-like payment flow with QR code and success screen
 */
const PaymentSuccess = ({ show, onClose, amount, orderId }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 scale-in payment-success">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-block p-6 bg-green-100 rounded-full mb-4">
            <svg
              className="w-20 h-20 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful! 🎉
          </h2>
          <p className="text-gray-600">
            Your order has been confirmed
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount Paid</span>
              <span className="text-2xl font-bold text-green-600">₹{amount}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Order ID</span>
              <span className="font-mono font-semibold text-gray-800">{orderId}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-800">UPI / Card</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Status</span>
              <span className="badge-success">✓ Completed</span>
            </div>
          </div>
        </div>

        {/* Success Messages */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-blue-800">
          <p className="flex items-center gap-2 mb-2">
            <span>📧</span>
            <span>Confirmation email sent</span>
          </p>
          <p className="flex items-center gap-2">
            <span>📱</span>
            <span>SMS notification sent</span>
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full btn-primary btn-animated"
        >
          Continue Shopping
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Thank you for your purchase! 💚
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
