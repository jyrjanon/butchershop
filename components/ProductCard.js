// components/ProductCard.js
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, isProductInCart, removeFromCart } = useCart();
  const inCart = isProductInCart(product.id);

  const handleCartClick = () => {
    if (inCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  const stock = product.stock;
  const isSoldOut = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  // Static discount for demonstration
  const originalPrice = product.price + 50;
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <Link 
      href={`/product/${product.id}`}
      className={`relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer block ${isSoldOut ? 'opacity-60' : ''}`}
    >
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {!isSoldOut && (
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {discountPercentage}% OFF
          </div>
        )}
        {isLowStock && (
          <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            Only {stock} left!
          </div>
        )}
        {isSoldOut && (
          <div className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full">
            SOLD OUT
          </div>
        )}
      </div>

      <img
        className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
        src={product.imageUrl}
        alt={product.name}
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-1 leading-tight truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">500g | 1-2 Pieces</p>
        
        <div className="flex-grow">
            <p className="text-gray-700 text-sm mb-3 h-10 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-baseline mb-3">
          <span className="text-red-600 text-2xl font-bold mr-2">₹{product.price}</span>
          <span className="text-gray-500 text-sm line-through">₹{originalPrice}</span>
        </div>

        <div className="h-12">
          {isSoldOut ? (
            <button
              disabled
              className="w-full font-semibold py-2 rounded-lg text-lg bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleCartClick();
              }}
              className={`w-full font-semibold py-2 rounded-lg text-lg transition-all duration-300 flex items-center justify-center
                ${inCart ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
              `}
            >
              {inCart ? 'In Cart ✔' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}