// pages/orders.js
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import Link from 'next/link';

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchOrders = async () => {
        const ordersCollection = collection(db, 'orders');
        const q = query(
          ordersCollection, 
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setOrders(userOrders);
        setLoading(false);
      };

      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <div className="text-center p-10">Loading your orders...</div>;
  }
  
  if (!currentUser) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold">Please log in to see your orders.</h1>
        <Link href="/login" className="text-red-600 hover:underline mt-4 inline-block">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-extrabold text-red-600 hover:opacity-80">
            ButcherShop
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        {orders.length === 0 ? (
          // FIX: Replaced "haven't" with "haven&apos;t"
          <p>You haven&apos;t placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <div>
                    <p className="font-bold text-lg">Order ID: <span className="text-gray-600 font-medium">{order.id.substring(0, 8)}</span></p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(order.createdAt?.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </div>
                </div>
                <div>
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-gray-700 py-1">
                      <span>{item.name}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-xl pt-4 mt-4 border-t">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}