// pages/_app.js
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext'; // <-- Import AuthProvider
import WhatsAppButton from '../components/WhatsAppButton';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider> {/* <-- Wrap with AuthProvider */}
      <CartProvider>
        <Component {...pageProps} />
        <WhatsAppButton />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;