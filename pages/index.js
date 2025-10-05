// pages/index.js
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { TruckIcon } from '@heroicons/react/24/outline';

// ... (categories and displayCategories arrays remain the same)
const categories = [
  { id: '1', name: 'Chicken', imageUrl: '/images/chicken.jpg' },
  { id: '2', name: 'Mutton', imageUrl: '/images/mutton.jpg' },
  { id: '3', name: 'Seafood', imageUrl: '/images/seafood.jpg' },
  { id: '4', name: 'Ready to Cook', imageUrl: '/images/readytocook.jpg' },
  { id: '5', name: 'Pork', imageUrl: '/images/pork.jpg' },
  { id: '6', name: 'Eggs', imageUrl: '/images/eggs.jpg' },
];

const displayCategories = [
    { id: '0', name: 'All', imageUrl: 'https://i.postimg.cc/q7DtttCD/all.webp' },
    ...categories
];

export default function Home({ allProducts }) {
  const [displayedProducts, setDisplayedProducts] = useState(allProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const { cartCount } = useCart();
  const { currentUser, userProfile, signOut, loading } = useAuth();
  const router = useRouter();

  // --- NEW: State to prevent hydration mismatch ---
  const [isMounted, setIsMounted] = useState(false);

  // --- NEW: useEffect to set mounted state on client ---
  useEffect(() => {
    setIsMounted(true);
  }, []);


  // Redirect new users (who have no profile data) to complete their profile
  useEffect(() => {
    if (!loading && currentUser && !userProfile) {
      router.push('/complete-profile');
    }
  }, [currentUser, userProfile, loading, router]);

  useEffect(() => {
    let filtered = [...allProducts];
    if (activeCategory !== 'All') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    if (sortOrder === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    }
    setDisplayedProducts(filtered);
  }, [activeCategory, sortOrder, allProducts]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // If loading auth state or redirecting a new user, show a loading screen
  if (loading || (currentUser && !userProfile)) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50 p-4 md:py-3 md:px-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="w-full flex items-center justify-between mb-4 md:mb-0">
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/" className="text-2xl font-extrabold text-red-600">HafizMeatShop</Link>
                </div>

                <div className="flex items-center text-gray-700 text-sm">
                    <TruckIcon className="w-6 h-6 mr-2 text-red-600 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-bold text-base leading-tight">
                        {userProfile ? 'Delivering to' : 'Select Location'}
                      </span>
                      <span className="text-xs text-gray-500 leading-tight truncate max-w-[150px] sm:max-w-xs cursor-pointer hover:text-red-600">
                        {userProfile?.address ? userProfile.address : 'Gandhidham, Gujarat'}
                      </span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                  {currentUser ? (
                    <div className="relative group">
                      <button className="p-2 text-gray-700 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      </button>
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 hidden group-hover:block z-20">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                          Hi, {userProfile?.fullName || 'User'}
                        </div>
                        <Link href="/complete-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</Link>
                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                        <button onClick={signOut} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link href="/auth" className="text-sm font-semibold text-gray-700 hover:text-red-600">
                      Login/Sign Up
                    </Link>
                  )}
                  <Link href="/cart" className="relative p-2 text-gray-700 hover:text-red-600 rounded-full transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      {/* MODIFIED: Conditionally render the cart count only on the client */}
                      {isMounted && cartCount > 0 && (
                        <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                  </Link>
                </div>
            </div>
            <div className="w-full md:flex-grow md:mx-6 md:max-w-md relative">
                <div className="relative">
                  <input type="text" placeholder="Search for fresh meats..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-300 focus:bg-white" value={searchQuery} onChange={handleSearchChange} onBlur={() => setTimeout(() => setSearchResults([]), 150)} />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </div>
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-20">
                    <ul>
                      {searchResults.map(product => (
                        <li key={product.id}>
                          <Link href={`/product/${product.id}`} className="flex items-center p-3 hover:bg-gray-100 transition-colors duration-200">
                              <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md mr-4" />
                              <div>
                                <p className="font-semibold text-gray-800">{product.name}</p>
                                <p className="text-sm text-red-600 font-bold">₹{product.price}</p>
                              </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* ... (rest of the page is the same) ... */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Shop by Categories</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 md:grid md:grid-cols-7 md:gap-6 md:space-x-0 hide-scrollbar">
            {displayCategories.map((category) => (
              <button key={category.id} onClick={() => setActiveCategory(category.name)} className={`p-2 flex flex-col items-center justify-start rounded-lg shadow-md transition-all duration-300 border-2 w-24 flex-shrink-0 md:w-auto ${activeCategory === category.name ? 'border-red-500 bg-red-50' : 'border-transparent bg-white hover:shadow-xl hover:-translate-y-1'}`}>
                <div className="w-full aspect-square rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mb-2">
                  {category.imageUrl ? ( <img className="w-full h-full object-cover" src={category.imageUrl} alt={category.name} /> ) : ( <span className="font-bold text-gray-700">{category.name}</span> )}
                </div>
                {category.name !== 'All' && ( <h3 className="text-sm font-semibold text-gray-800 text-center">{category.name}</h3> )}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                    {activeCategory === 'All' ? 'Our Fresh Picks' : activeCategory}
                </h2>
                <div className="relative">
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="appearance-none bg-white border border-gray-300 text-gray-700 font-semibold py-2 pl-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent">
                        <option value="default">Sort by</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500 text-xl">No products found for this category.</p>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8 text-center">
        {/* ... (footer is the same) ... */}
         <div className="max-w-7xl mx-auto">
          <p>&copy; {new Date().getFullYear()} ButcherShop. All rights reserved.</p>
          <div className="mt-4 text-sm text-gray-400">
            <a href="#" className="hover:text-red-400 mx-2">Privacy Policy</a> |
            <a href="#" className="hover:text-red-400 mx-2">Terms of Service</a> |
            <a href="#" className="hover:text-red-400 mx-2">Contact Us</a>

            {userProfile && userProfile.role === 'admin' && (
              <>
                |
                <Link href="/admin/dashboard" className="font-bold text-white hover:text-red-400 mx-2">
                  Admin Panel
                </Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
    const productsCollection = collection(db, 'products');
    const productSnapshot = await getDocs(productsCollection);
    const allProducts = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    return {
      props: {
        allProducts,
      },
    };
  }