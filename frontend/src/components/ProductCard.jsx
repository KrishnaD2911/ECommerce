import { HiOutlineShoppingBag, HiOutlineTag, HiOutlineArchive } from 'react-icons/hi';

const CATEGORY_ACCENTS = {
  Electronics: { start: '#0f766e', end: '#38bdf8' },
  Clothing: { start: '#7c3aed', end: '#f472b6' },
  'Home & Kitchen': { start: '#ea580c', end: '#facc15' },
  Books: { start: '#475569', end: '#94a3b8' },
  Sports: { start: '#16a34a', end: '#84cc16' },
  Beauty: { start: '#db2777', end: '#fb7185' },
  Toys: { start: '#2563eb', end: '#22d3ee' },
  Automotive: { start: '#111827', end: '#64748b' },
  Other: { start: '#0f766e', end: '#f97316' },
};

const ProductCard = ({ product }) => {
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
    <article className="group flex h-full min-h-[430px] flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_45px_-34px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_28px_54px_-32px_rgba(15,118,110,0.45)]">
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.34),transparent_32%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.18))]" />
          </>
        )}
        {imageUrl && <div className="absolute inset-0 bg-gradient-to-b from-slate-950/18 via-transparent to-slate-950/20" />}
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-slate-900 shadow-sm">
            {product.category}
          </span>
          {product.status !== 'active' && (
            <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-extrabold text-white">
              {product.status.replace('_', ' ')}
            </span>
          )}
        </div>
        {!imageUrl && <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white/92 text-4xl font-black text-slate-950 shadow-2xl shadow-slate-950/20">
            {product.name ? product.name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <HiOutlineTag />
            {product.sku}
          </span>
          <span className={stockInfo.className}>{stockInfo.label}</span>
        </div>

        <h3 className="line-clamp-2 font-title text-xl font-black leading-tight text-slate-950">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Price</div>
            <div className="font-title text-2xl font-black text-slate-950">{formatPrice(product.price)}</div>
          </div>
          <button className="btn btn-primary px-4" disabled={isUnavailable}>
            {isUnavailable ? <HiOutlineArchive /> : <HiOutlineShoppingBag />}
            {isUnavailable ? 'Unavailable' : 'Buy Now'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
