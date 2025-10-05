// pages/checkout.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const { userProfile, currentUser } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Animation variants for step transitions
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  if (!currentUser) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold">Please log in to proceed to checkout.</h1>
        <Link href="/login" className="text-red-600 hover:underline mt-4 inline-block">Go to Login</Link>
      </div>
    );
  }
  
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        userName: userProfile.fullName,
        userAddress: userProfile.address,
        items: cartItems,
        total: cartTotal,
        status: 'Processing',
        createdAt: serverTimestamp(),
      });
      clearCart();
      router.push('/orders');
    } catch (error) {
      console.error("Error placing order: ", error);
      alert("Failed to place order. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white md:bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto py-4 px-4 flex items-center space-x-4">
          <button onClick={() => router.back()} className="text-gray-700 hover:text-red-600">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Checkout</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 md:py-12 md:px-4">
        {/* On desktop, this is a card. On mobile, it's the full background. */}
        <div className="bg-white md:rounded-lg md:shadow-xl md:p-8">
          {/* Step Indicator */}
          <div className="flex justify-center items-center mb-8">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}>1</div>
              <p className={`mt-2 text-sm font-semibold ${step === 1 ? 'text-red-600' : 'text-gray-800'}`}>Address</p>
            </div>
            <div className="flex-auto border-t-2 border-gray-200 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}>2</div>
              <p className={`mt-2 text-sm font-semibold ${step === 2 ? 'text-red-600' : 'text-gray-800'}`}>Review</p>
            </div>
          </div>
          
          {/* We use AnimatePresence for smooth transitions between steps */}
          <AnimatePresence initial={false} custom={step}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                className="pb-24" // Padding to avoid overlap with sticky footer
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Your Delivery Address</h2>
                {userProfile ? (
                  <div className="p-4 border rounded-lg bg-gray-50 text-gray-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{userProfile.fullName}</p>
                        <p className="text-gray-600">
                           {userProfile.address || `${userProfile.houseNo}, ${userProfile.street}`}
                        </p>
                        <p className="text-gray-600">{userProfile.phone}</p>
                      </div>
                      <Link href="/complete-profile" className="text-sm font-semibold text-red-600 hover:underline flex-shrink-0">
                        Edit
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-gray-100 animate-pulse h-24"></div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={2}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                className="pb-24" // Padding to avoid overlap with sticky footer
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Review Your Order</h2>
                <div className="border rounded-lg p-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <p className="text-gray-800">{item.name}</p>
                      <p className="font-semibold text-gray-800">₹{item.price}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 font-bold text-lg text-gray-800">
                    <p>Total</p>
                    <p>₹{cartTotal}</p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 text-center mb-6">
                  <p className="font-bold">Your order will be delivered within 1-2 hours to your doorstep.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- Sticky Footer Button for Mobile --- */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t md:hidden">
        {step === 1 && (
            <button onClick={() => setStep(2)} className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg">
              Continue to Review
            </button>
        )}
        {step === 2 && (
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-600">Total Payable</p>
              <p className="font-bold text-xl text-gray-800">₹{cartTotal}</p>
            </div>
            <button onClick={handlePlaceOrder} disabled={loading} className="py-3 px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:bg-green-300">
              {loading ? 'Placing...' : 'Place Order'}
            </button>
          </div>
        )}
      </footer>
      
      {/* --- Desktop Buttons --- */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8 hidden md:block">
        {step === 1 && (
          <div className="mt-6 flex justify-end">
            <button onClick={() => setStep(2)} className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg">
              Continue to Review
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="mt-6 flex justify-between items-center">
            <button onClick={() => setStep(1)} className="text-gray-600 hover:underline">
              &larr; Back to Address
            </button>
            <button onClick={handlePlaceOrder} disabled={loading} className="py-3 px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:bg-green-300">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}