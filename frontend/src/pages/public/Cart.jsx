import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart, checkout } from '../../redux/cartSlice';
import { HiOutlineShoppingCart, HiOutlineTrash, HiOutlineArrowRight } from 'react-icons/hi';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, subtotal, tax, totalPrice, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(checkout()).unwrap().then(() => {
      navigate('/orders');
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
          <HiOutlineShoppingCart className="text-5xl" />
        </div>
        <h2 className="font-title text-3xl font-black text-white">Your cart is empty</h2>
        <p className="mt-2 text-zinc-400 font-medium">Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn btn-primary mt-8 px-8 py-3 shadow-lg shadow-orange-500/20">
          Start Shopping
        </Link>
      </div>
    );
  }

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-title text-4xl font-black text-white mb-8 tracking-tight">Shopping Cart</h1>

      {error && (
        <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 font-bold text-red-400 shadow-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product} className="flex flex-col sm:flex-row items-center gap-6 bg-[#0a0a0a] p-4 rounded-[24px] border border-white/5 shadow-sm">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[16px] bg-black/50 border border-white/5 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <HiOutlineShoppingCart className="text-3xl text-zinc-500" />
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <Link to={`/`} className="font-bold text-lg text-white hover:text-orange-500">{item.name}</Link>
                <div className="font-black text-orange-500 mt-1">{formatCurrency(item.price)}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border border-white/10 bg-black p-1">
                  <button 
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a0a0a] text-zinc-300 shadow-sm hover:text-orange-500 disabled:opacity-50"
                    onClick={() => dispatch(updateQuantity({ id: item.product, quantity: item.quantity - 1 }))}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-white">{item.quantity}</span>
                  <button 
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a0a0a] text-zinc-300 shadow-sm hover:text-orange-500 disabled:opacity-50"
                    onClick={() => dispatch(updateQuantity({ id: item.product, quantity: item.quantity + 1 }))}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={() => dispatch(removeFromCart(item.product))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition-colors hover:bg-red-500 hover:text-white"
                  title="Remove item"
                >
                  <HiOutlineTrash className="text-lg" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button 
              onClick={() => dispatch(clearCart())}
              className="text-sm font-bold text-zinc-500 hover:text-red-400 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 shadow-xl shadow-black/50 p-8 sticky top-24">
            <h2 className="font-title text-2xl font-black text-white mb-6 border-b border-white/5 pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-zinc-400 font-medium">
              <div className="flex justify-between">
                <span>Items ({totalQuantity}):</span>
                <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%):</span>
                <span className="font-bold text-white">{formatCurrency(tax)}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-end">
              <span className="font-bold text-white">Total:</span>
              <span className="font-title text-3xl font-black text-orange-500">{formatCurrency(totalPrice)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary w-full mt-8 py-4 text-lg rounded-[16px] shadow-lg shadow-orange-500/20 flex justify-center items-center gap-2"
            >
              {loading ? <div className="loader h-6 w-6 border-2 border-black/30 border-t-black"></div> : (
                <>Checkout <HiOutlineArrowRight /></>
              )}
            </button>
            
            {!isAuthenticated && (
              <p className="mt-4 text-center text-xs font-bold text-orange-500 bg-orange-500/10 p-2 rounded-lg border border-orange-500/20">
                You will be asked to sign in before completing your purchase.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
