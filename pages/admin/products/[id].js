// pages/admin/products/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { db } from '../../../firebase';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';

export default function ProductForm() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === 'new';
  
  const [product, setProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: 'Chicken',
    cut: '',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const fetchProduct = async () => {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.log("No such document!");
        }
      };
      fetchProduct();
    }
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) {
        await addDoc(collection(db, 'products'), product);
      } else {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, product);
      }
      router.push('/admin/products');
    } catch (error) {
      console.error("Error saving product: ", error);
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-white mb-8">
        {isNew ? 'Add New Product' : 'Edit Product'}
      </h1>
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Product Name" name="name" value={product.name} onChange={handleChange} />
            <FormField label="Image URL" name="imageUrl" value={product.imageUrl} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Price" name="price" type="number" value={product.price} onChange={handleChange} />
            <FormField label="Stock" name="stock" type="number" value={product.stock} onChange={handleChange} />
            <FormField as="select" label="Category" name="category" value={product.category} onChange={handleChange}>
              <option>Chicken</option>
              <option>Mutton</option>
              <option>Seafood</option>
              <option>Pork</option>
              <option>Eggs</option>
              <option>Ready to Cook</option>
            </FormField>
          </div>
          <FormField label="Cut Type (e.g., Boneless, Curry Cut)" name="cut" value={product.cut} onChange={handleChange} />
          <FormField as="textarea" label="Description" name="description" value={product.description} onChange={handleChange} />

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg disabled:bg-red-400">
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

// A helper component for form fields to keep the code clean
const FormField = ({ as = 'input', label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    {as === 'input' && <input id={name} name={name} {...props} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 focus:ring-red-500 focus:border-red-500" />}
    {as === 'textarea' && <textarea id={name} name={name} {...props} rows="4" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 focus:ring-red-500 focus:border-red-500" />}
    {as === 'select' && <select id={name} name={name} {...props} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 focus:ring-red-500 focus:border-red-500" />}
  </div>
);