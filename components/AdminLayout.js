// components/AdminLayout.js
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, Ticket, LogOut, Home } from 'lucide-react';

const NavLink = ({ href, icon: Icon, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-red-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );
};

export default function AdminLayout({ children, theme = 'dark' }) {
  const { userProfile, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading...</div>;
  }

  if (typeof window !== 'undefined' && (!userProfile || userProfile.role !== 'admin')) {
    router.push('/');
    return <div className="text-center p-10 bg-gray-900 text-white">Access Denied. Redirecting...</div>;
  }
  
  // Create theme-specific classes
  const themeClass = theme === 'dark' ? 'theme-dark bg-gray-800' : 'theme-light bg-gray-100';

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col fixed h-full z-20">
        <div className="flex items-center space-x-2 mb-10">
          <span className="text-2xl font-extrabold">ButcherShop</span>
          <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <nav className="flex flex-col space-y-2">
          <NavLink href="/admin/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
          <NavLink href="/admin/orders" icon={ShoppingBag}>Orders</NavLink>
          <NavLink href="/admin/products" icon={Package}>Products</NavLink>
          <NavLink href="/admin/coupons" icon={Ticket}>Coupons</NavLink>
        </nav>
        <div className="mt-auto space-y-2">
            <NavLink href="/" icon={Home}>Back to Store</NavLink>
            <button onClick={signOut} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
            </button>
        </div>
      </aside>
      
      {/* The new themeClass is applied here */}
      <main className={`flex-1 p-8 ml-64 ${themeClass}`}>
        {children}
      </main>
    </div>
  );
}