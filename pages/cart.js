// pages/cart.js
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, cartTotal, cartCount } = useCart();

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-extrabold text-red-600 hover:opacity-80">
            ButcherShop
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Shopping Cart</h1>
        
        {cartCount === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your cart is empty.</h2>
            <p className="text-gray-800 mb-6">Looks like you haven't added any fresh meat to your cart yet.</p>
            <Link href="/" className="inline-block py-3 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
                Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="p-4 flex items-center space-x-4">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.cut}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">₹{item.price}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold border-b pb-4 mb-4 text-gray-800">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-800">Subtotal ({cartCount} items)</span>
                  <span className="font-semibold text-gray-800">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800">Delivery Fee</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-4 text-gray-800">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="mt-6">
                <Link href="/checkout" className="block w-full text-center py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors">
                    Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}