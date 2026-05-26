import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../redux/orderSlice';
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineCalendar, HiOutlineMail } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-title text-4xl font-black text-white mb-8 tracking-tight">Your Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* User Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 shadow-xl shadow-black/50 p-8">
            <div className="flex flex-col items-center border-b border-white/5 pb-6 mb-6">
              <div className="h-24 w-24 rounded-full bg-orange-500/15 text-orange-500 flex items-center justify-center text-4xl font-black mb-4">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-title text-2xl font-black text-white">{user?.name}</h2>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-zinc-300 uppercase">
                {user?.role}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-zinc-400">
                <HiOutlineMail className="text-xl text-orange-500" />
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <HiOutlineCalendar className="text-xl text-orange-500" />
                <span className="font-medium">Joined {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <HiOutlineShoppingBag className="text-2xl" />
            </div>
            <h2 className="font-title text-3xl font-black text-white">Order History</h2>
          </div>

          {error && (
            <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 font-bold text-red-400 shadow-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 rounded-[24px] border border-white/5 bg-[#0a0a0a] p-6 shadow-sm animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[32px] border border-white/5 bg-[#0a0a0a] py-16 text-center shadow-sm">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-black/50 text-zinc-500">
                <HiOutlineShoppingBag className="text-4xl" />
              </div>
              <h3 className="font-title text-2xl font-black text-white">No orders yet</h3>
              <p className="mt-2 text-zinc-400 font-medium max-w-sm">When you place an order, it will appear here so you can easily track it.</p>
              <Link to="/" className="btn btn-primary mt-6 px-6">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-[#0a0a0a] rounded-[24px] border border-white/5 shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-black border-b border-white/5 px-6 py-4 flex flex-wrap justify-between items-center gap-4 text-sm">
                    <div className="flex gap-8">
                      <div>
                        <span className="block text-zinc-500 font-medium">Order Placed</span>
                        <span className="font-bold text-white">{formatDate(order.createdAt)}</span>
                      </div>
                      <div>
                        <span className="block text-zinc-500 font-medium">Total</span>
                        <span className="font-bold text-white">{formatCurrency(order.totalPrice)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-zinc-500 font-medium">Order # {order._id.substring(order._id.length - 8).toUpperCase()}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold uppercase mt-1 ${order.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-orange-500/15 text-orange-500'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-black/50 flex items-center justify-center">
                             {item.image ? (
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                             ) : (
                                <span className="font-bold text-zinc-500">{item.name.charAt(0)}</span>
                             )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white hover:text-orange-500 transition-colors">
                              <Link to="/">{item.name}</Link>
                            </h4>
                            <div className="text-orange-500 font-black mt-1">{formatCurrency(item.price)}</div>
                            <div className="text-sm font-medium text-zinc-500 mt-1">Qty: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
