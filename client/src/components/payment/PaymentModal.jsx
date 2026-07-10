import React, { useState } from 'react';
import { paymentService } from '../../services/paymentService';
import Modal from '../ui/Modal';
import { CreditCard, Smartphone, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const PaymentModal = ({ isOpen, onClose, plan, billingCycle, amount, onSuccess }) => {
  const [method, setMethod] = useState('card');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      if (method === 'card') {
        // For now simulate, will integrate Stripe Elements
        await paymentService.payWithCard({ amount, plan, billingCycle });
      } else if (method === 'mtn_money') {
        if (!phoneNumber) {
          toast.error('Please enter your MTN number');
          setProcessing(false);
          return;
        }
        await paymentService.payWithMtnMoney({ amount, plan, billingCycle, phoneNumber });
      } else if (method === 'orange_money') {
        if (!phoneNumber) {
          toast.error('Please enter your Orange number');
          setProcessing(false);
          return;
        }
        await paymentService.payWithOrangeMoney({ amount, plan, billingCycle, phoneNumber });
      }

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });

      toast.success('Payment successful! 🎉');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-400 transition-all text-sm";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Payment" size="md">
      <div className="space-y-5">
        {/* Amount Display */}
        <div className="bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-sky-900/20 dark:to-emerald-900/20 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{plan} Plan - {billingCycle}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{amount} XAF</p>
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'card', label: 'Card', icon: CreditCard },
              { value: 'mtn_money', label: 'MTN MoMo', icon: Smartphone },
              { value: 'orange_money', label: 'Orange Money', icon: Smartphone },
            ].map((m) => (
              <button
                key={m.value}
                onClick={() => setMethod(m.value)}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                  method === m.value
                    ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/20'
                    : 'border-gray-100 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <m.icon className={`w-5 h-5 ${method === m.value ? 'text-sky-500' : 'text-gray-400'}`} />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Phone Number for Mobile Money */}
        {(method === 'mtn_money' || method === 'orange_money') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {method === 'mtn_money' ? 'MTN Mobile Money Number' : 'Orange Money Number'}
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={method === 'mtn_money' ? 'e.g., 23767XXXXXXX' : 'e.g., 23769XXXXXXX'}
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">
              {method === 'mtn_money' 
                ? 'You\'ll receive a prompt on your phone to confirm.' 
                : 'Dial #150# to confirm the payment.'}
            </p>
          </div>
        )}

        {/* Card Payment Info */}
        {method === 'card' && (
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Card payments are processed securely. Integration with Stripe/Paystack coming soon.
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full py-3 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {processing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Pay {amount} XAF</>
          )}
        </button>
      </div>
    </Modal>
  );
};

export default PaymentModal;