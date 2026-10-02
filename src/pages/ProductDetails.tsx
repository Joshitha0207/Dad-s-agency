import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Star, Tag, Check, ShieldCheck } from 'lucide-react';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { formatCurrency, calculateDiscount } from '../utils/formatting';
import { useCart } from '../hooks/useCart';
import { ToastContainer, ToastMessage } from '../components/ui/Toast';
import { BackButton } from '../components/ui/BackButton';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const fetchProd = async () => {
      if (!id) return;
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
      setLoading(false);
    };
    fetchProd();
  }, [id]);

  const addToast = (message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type: 'success', message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <span className="text-4xl">🍦</span>
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-xs text-gray-500">The requested item might have been removed or is unavailable.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-pink-600 text-white rounded-full font-bold text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.mrp, product.price);
  const isOutOfStock = !product.is_available || product.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    addToast(`🍦 Added ${quantity} × ${product.name} to your cart!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Back Button */}
      <div>
        <BackButton />
      </div>

      {/* Main Detail Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Large Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-pink-50/50 border border-pink-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              {discount}% OFF
            </span>
          )}

          {/* Stock Tag */}
          {isOutOfStock ? (
            <span className="absolute bottom-4 left-4 bg-rose-700 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
              Out of Stock
            </span>
          ) : (
            <span className="absolute bottom-4 left-4 bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
              In Stock ({product.stock_quantity} available)
            </span>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs font-semibold text-gray-500 uppercase">
                {product.product_type} • {product.unit}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating} / 5.0 Rating</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

          {/* Pricing */}
          <div className="bg-pink-50/60 p-4 rounded-2xl border border-pink-100 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-gray-500 font-semibold block">Selling Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">{formatCurrency(product.price)}</span>
                {product.mrp > product.price && (
                  <span className="text-sm text-gray-400 line-through">{formatCurrency(product.mrp)}</span>
                )}
              </div>
            </div>
            {discount > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                Save {formatCurrency(product.mrp - product.price)}
              </span>
            )}
          </div>

          {/* Quantity Selector & Add To Cart */}
          {!isOutOfStock ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-700 uppercase">Quantity:</span>
                <div className="flex items-center border border-pink-200 rounded-full bg-white shadow-2xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-l-full transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-extrabold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-r-full transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold rounded-full shadow-xl shadow-pink-200 transition-all transform active:scale-98 text-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart 🍦</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-gray-100 rounded-2xl text-center text-xs font-bold text-gray-500">
              This product is currently out of stock. Please check back later!
            </div>
          )}

          {/* Shop Guarantee */}
          <div className="pt-2 flex items-center gap-3 text-xs text-gray-500 border-t border-gray-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Delivered direct from Dad's Agency, College Road, Tiruppur.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
