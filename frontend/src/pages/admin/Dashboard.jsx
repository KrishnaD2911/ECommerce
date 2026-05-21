import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductStats, fetchProducts } from '../../redux/productSlice';
import { Link } from 'react-router-dom';
import {
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineExclamationCircle,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiArrowRight,
  HiPlus,
  HiOutlineSparkles,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.products);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProductStats());

    dispatch(fetchProducts())
      .unwrap()
      .then(res => {
        setRecentProducts(res.products.slice(0, 5));
      })
      .catch(() => toast.error('Failed to load recent products'));
  }, [dispatch]);

  if (loading && !stats) {
    return <div className="flex h-64 items-center justify-center"><div className="loader" /></div>;
  }

  if (error) {
    return <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center font-semibold text-red-600">Error loading dashboard: {error}</div>;
  }

  const totals = stats?.totals || {
    totalProducts: 0,
    totalActive: 0,
    totalInactive: 0,
    outOfStock: 0,
    totalStock: 0,
    totalInventoryValue: 0,
    avgPrice: 0,
  };

  const categoryStats = stats?.categoryStats || [];

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  const formatNumber = (val) => new Intl.NumberFormat('en-US').format(val || 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="mb-8 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/15 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-black text-teal-100">
              <HiOutlineSparkles />
              Admin Portal
            </div>
            <h1 className="font-title text-4xl font-black md:text-5xl">Overview</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Current inventory health, category mix, and the latest product activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/products" className="btn border-white/12 bg-white/10 text-white hover:bg-white/15">
              Manage Inventory
            </Link>
            <Link to="/admin/products/new" className="btn bg-white text-slate-950 hover:bg-teal-50">
              <HiPlus /> Add Product
            </Link>
          </div>
        </div>
      </section>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={<HiOutlineCube />} title="Products" value={formatNumber(totals.totalProducts)} accent="teal" />
        <StatCard icon={<HiOutlineCheckCircle />} title="Active" value={formatNumber(totals.totalActive)} accent="emerald" />
        <StatCard icon={<HiOutlineXCircle />} title="Inactive" value={formatNumber(totals.totalInactive)} accent="slate" />
        <StatCard icon={<HiOutlineExclamationCircle />} title="Out of Stock" value={formatNumber(totals.outOfStock)} accent="red" alert={totals.outOfStock > 0} />
        <StatCard icon={<HiOutlineChartBar />} title="Stock Items" value={formatNumber(totals.totalStock)} accent="blue" />
        <StatCard icon={<HiOutlineCurrencyDollar />} title="Value" value={formatCurrency(totals.totalInventoryValue)} accent="orange" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="panel p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-title text-2xl font-black text-slate-950">Category Distribution</h2>
            <span className="badge badge-secondary">{categoryStats.length} categories</span>
          </div>

          {categoryStats.length === 0 ? (
            <p className="font-medium text-slate-500">No categories found.</p>
          ) : (
            <div className="space-y-5">
              {categoryStats.map((cat, index) => {
                const percentage = totals.totalProducts ? (cat.count / totals.totalProducts) * 100 : 0;
                return (
                  <div key={cat._id || index}>
                    <div className="mb-2 flex justify-between gap-4 text-sm">
                      <span className="font-black text-slate-700">{cat._id}</span>
                      <span className="font-bold text-slate-500">{cat.count} items ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-orange-400" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="panel p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-title text-2xl font-black text-slate-950">Recent Additions</h2>
            <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm font-black text-teal-700 hover:text-teal-900">
              View All <HiArrowRight />
            </Link>
          </div>

          <div className="space-y-3">
            {recentProducts.length === 0 ? (
              <p className="text-sm font-medium text-slate-500">No recent products.</p>
            ) : (
              recentProducts.map(product => (
                <div key={product._id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 transition-colors hover:border-teal-200 hover:bg-teal-50/60">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 font-black text-white">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-black text-slate-950">{product.name}</h4>
                    <p className="text-xs font-bold text-slate-500">{product.sku}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-950">{formatCurrency(product.price)}</div>
                    <div className={product.status === 'active' ? 'text-xs font-bold text-emerald-600' : 'text-xs font-bold text-slate-400'}>
                      {product.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const accentClasses = {
  teal: 'bg-teal-50 text-teal-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  slate: 'bg-slate-100 text-slate-700',
  red: 'bg-red-50 text-red-700',
  blue: 'bg-blue-50 text-blue-700',
  orange: 'bg-orange-50 text-orange-700',
};

const StatCard = ({ icon, title, value, accent, alert }) => (
  <div className={`panel p-5 transition-transform hover:-translate-y-1 ${alert ? 'border-red-200' : ''}`}>
    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${accentClasses[accent]}`}>
      {icon}
    </div>
    <h3 className="text-sm font-bold text-slate-500">{title}</h3>
    <div className="mt-1 font-title text-2xl font-black text-slate-950">{value}</div>
  </div>
);

export default Dashboard;
