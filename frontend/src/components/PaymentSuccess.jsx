import React from 'react';

/**
 * PaymentSuccess Component
 * Shows beautiful success animation after payment
 * Enhanced UPI payment confirmation with detailed transaction info
 */
const PaymentSuccess = ({ show, onClose, amount, orderId, transactionId, method, upiId, deliveryAddress }) => {
  if (!show) return null;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
  const formattedTime = currentDate.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 scale-in payment-success max-h-[90vh] overflow-y-auto">
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
              <span className="text-2xl font-bold text-green-600">₹{amount?.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-green-200 pt-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Order ID</span>
                <span className="font-mono font-semibold text-gray-800">{orderId}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono font-semibold text-gray-800">{transactionId || `TXN${orderId?.slice(-8)}`}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-800">{method || 'UPI'}</span>
              </div>

              {upiId && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">UPI ID</span>
                  <span className="font-mono font-semibold text-gray-800">{upiId}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Paid To</span>
                <span className="font-semibold text-gray-800">WellNexus Healthcare</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-semibold text-gray-800">{formattedDate}, {formattedTime}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Status</span>
                <span className="badge-success">✓ Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Download */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                📄
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Payment Receipt</p>
                <p className="text-xs text-gray-600">Download your receipt</p>
              </div>
            </div>
            <button 
              onClick={() => {
                const receiptContent = `
WELLNEXUS HEALTHCARE - PAYMENT RECEIPT
=====================================

Order ID: ${orderId}
Transaction ID: ${transactionId}
Date: ${new Date().toLocaleString()}

Amount Paid: ₹${amount?.toFixed(2)}
Payment Method: ${method}
${upiId ? `UPI ID: ${upiId}` : ''}

Paid To: WellNexus Healthcare
Status: Completed

${deliveryAddress ? `\nDelivery Address:
${deliveryAddress.name}
${deliveryAddress.address}
${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}
Phone: ${deliveryAddress.phone}
Email: ${deliveryAddress.email}

Expected Delivery: 3-5 business days` : ''}

Thank you for your purchase!
=====================================
                `;
                const blob = new Blob([receiptContent], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `WellNexus_Receipt_${orderId}.txt`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Download
            </button>
          </div>
        </div>

        {/* Success Messages */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-blue-800">
          <p className="flex items-center gap-2 mb-2">
            <span>📧</span>
            <span>Confirmation email sent to {deliveryAddress?.email || 'your email'}</span>
          </p>
          <p className="flex items-center gap-2">
            <span>📱</span>
            <span>SMS notification sent</span>
          </p>
        </div>

        {/* Delivery Address */}
        {deliveryAddress && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📦</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Delivery Address</p>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-semibold">{deliveryAddress.name}</p>
                  <p>{deliveryAddress.address}</p>
                  <p>{deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}</p>
                  <p className="text-gray-600">📞 {deliveryAddress.phone}</p>
                </div>
                <p className="text-xs text-orange-700 mt-2 font-semibold">
                  🚚 Expected delivery in 3-5 business days
                </p>
              </div>
            </div>
          </div>
        )}

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
