// pages/admin/orders.js
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Upcoming Orders</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{order.id.substring(0, 8)}</td>
                <td className="p-4">{order.userName}</td>
                <td className="p-4 font-semibold">₹{order.total}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                    order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                   <select 
                     onChange={(e) => handleStatusChange(order.id, e.target.value)}
                     value={order.status}
                     className="border rounded p-1"
                   >
                     <option value="Processing">Processing</option>
                     <option value="Out for Delivery">Out for Delivery</option>
                     <option value="Completed">Completed</option>
                   </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}