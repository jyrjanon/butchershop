// pages/product/[id].js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Link from 'next/link';

export default function ProductPage({ product }) {
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-2xl font-extrabold text-red-600 hover:opacity-80"
          >
            &larr; Back to Store
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden md:flex">
          <div className="md:w-1/2">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:w-1/2">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6 text-lg">{product.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-red-600">₹{product.price}</span>
              <span className="text-xl text-gray-500 line-through ml-3">₹{product.price + 50}</span>
            </div>
            {/* Quantity Selector */}
            <div className="flex items-center mb-8">
              <label htmlFor="quantity" className="font-bold mr-4">Quantity:</label>
              <input type="number" id="quantity" name="quantity" min="1" defaultValue="1" className="w-20 p-2 border border-gray-300 rounded-lg text-center" />
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return { notFound: true };
  }

  return {
    props: {
      product: {
        id: docSnap.id,
        ...docSnap.data(),
      },
    },
  };
}