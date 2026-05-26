import { HiOutlineShoppingBag, HiOutlineTag, HiOutlineArchive } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const CATEGORY_ACCENTS = {
  Electronics: { start: '#f97316', end: '#f59e0b' },
  Clothing: { start: '#ea580c', end: '#fb923c' },
  'Home & Kitchen': { start: '#c2410c', end: '#fcd34d' },
  Books: { start: '#fb923c', end: '#fed7aa' },
  Sports: { start: '#16a34a', end: '#84cc16' },
  Beauty: { start: '#db2777', end: '#fb7185' },
  Toys: { start: '#2563eb', end: '#22d3ee' },
  Automotive: { start: '#18181b', end: '#ea580c' },
  Other: { start: '#f97316', end: '#fbbf24' },
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const accent = CATEGORY_ACCENTS[product.category] || CATEGORY_ACCENTS.Other;
  const isUnavailable = product.stock === 0 || product.status !== 'active';
  const imageUrl = product.image?.url;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of stock', className: 'badge badge-error' };
    if (stock <= 5) return { label: `${stock} left`, className: 'badge badge-warning' };
    return { label: 'In stock', className: 'badge badge-success' };
  };

  const stockInfo = getStockStatus(product.stock);

  return (
    <article className="group flex h-full min-h-[430px] flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a] shadow-[0_20px_45px_-34px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-[0_28px_54px_-32px_rgba(249,115,22,0.15)]">
      <div
        className="relative h-56 overflow-hidden"
        style={!imageUrl ? { background: `linear-gradient(135deg, ${accent.start}, ${accent.end})` } : undefined}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-x-6 bottom-5 top-6 rounded-[28px] border border-white/20 bg-white/14 backdrop-blur-sm transition-transform duration-300 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.34),transparent_32%),linear-gradient(to_bottom,transparent,rgba(0,0,0,0.18))]" />
          </>
        )}
        {imageUrl && <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />}
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-[#0a0a0a]/80 px-3 py-1 text-xs font-extrabold text-white shadow-sm backdrop-blur-md border border-white/10">
            {product.category}
          </span>
          {product.status !== 'active' && (
            <span className="rounded-full bg-black/80 px-3 py-1 text-xs font-extrabold text-white border border-white/10 backdrop-blur-md">
              {product.status.replace('_', ' ')}
            </span>
          )}
        </div>
        {!imageUrl && <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#0a0a0a]/80 text-4xl font-black text-white shadow-2xl shadow-black/50 backdrop-blur-md border border-white/20">
            {product.name ? product.name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500">
            <HiOutlineTag />
            {product.sku}
          </span>
          <span className={stockInfo.className}>{stockInfo.label}</span>
        </div>

        <h3 className="line-clamp-2 font-title text-xl font-black leading-tight text-white">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <div className="text-xs font-bold uppercase text-zinc-500">Price</div>
            <div className="font-title text-2xl font-black text-white">{formatPrice(product.price)}</div>
          </div>
          <button 
            className="btn btn-primary px-4" 
            disabled={isUnavailable}
            onClick={() => dispatch(addToCart(product))}
          >
            {isUnavailable ? <HiOutlineArchive /> : <HiOutlineShoppingBag />}
            {isUnavailable ? 'Unavailable' : 'Buy Now'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
