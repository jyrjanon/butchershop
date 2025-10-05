// pages/admin/products.js
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <Link href="/admin/products/new"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-white">{product.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{product.category} - {product.cut}</p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-2xl font-bold text-white">₹{product.price}</p>
                <p className="text-sm text-gray-300">Stock: {product.stock}</p>
              </div>
              <div className="mt-auto pt-4 flex space-x-2">
                <Link href={`/admin/products/${product.id}`}
                  className="w-1/2 bg-gray-700 hover:bg-gray-600 text-white text-center font-semibold py-2 rounded-lg"
                >
                  Edit
                </Link>
                <button onClick={() => handleDelete(product.id)}
                  className="w-1/2 bg-red-800 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}