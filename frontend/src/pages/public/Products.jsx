import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilters, clearFilters, setPage } from '../../redux/productSlice';
import ProductCard from '../../components/ProductCard';
import heroImage from '../../assets/hero.png';
import { HiSearch, HiChevronLeft, HiChevronRight, HiFilter, HiOutlineSparkles } from 'react-icons/hi';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error, page, pages, filters, totalProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearFilters());
    };
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setFilters({ search: searchTerm }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, dispatch, filters.search]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, page, filters]);

  const handleSortChange = (e) => {
    dispatch(setFilters({ sort: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    dispatch(setFilters({ category: e.target.value }));
  };

  const handleStatusChange = (e) => {
    dispatch(setFilters({ status: e.target.value }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      dispatch(setPage(newPage));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <section
        className="relative min-h-[430px] overflow-hidden bg-slate-950 px-4 py-16 text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.62), rgba(15, 23, 42, 0.34)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-end gap-8 pt-12 md:min-h-[340px] md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-bold text-teal-100 backdrop-blur">
              <HiOutlineSparkles />
              Curated essentials
            </div>
            <h1 className="font-title text-5xl font-black leading-[1.02] md:text-7xl">
              Discover Premium Gear
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Shop refined picks across electronics, apparel, home, books, and everyday favorites.
            </p>
          </div>

          <div className="w-full max-w-xl rounded-[24px] border border-white/18 bg-white/12 p-3 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <div className="relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or SKU"
                className="h-14 w-full rounded-2xl border-0 bg-white pl-12 pr-4 text-base font-semibold text-slate-950 shadow-sm outline-none ring-0 transition focus:shadow-[0_0_0_4px_rgba(20,184,166,0.22)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-7 max-w-7xl px-4">
        <div className="panel mb-8 flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 font-title text-lg font-black text-slate-950">
              <HiFilter className="text-teal-600" />
              Product Catalog
            </div>
            <p className="mt-1 text-sm font-medium text-slate-500">{totalProducts} active products</p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 md:w-auto">
            <select className="form-control min-w-44" value={filters.status || ''} onChange={handleStatusChange}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <select className="form-control min-w-52" value={filters.category || ''} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Books">Books</option>
              <option value="Sports">Sports</option>
              <option value="Beauty">Beauty</option>
              <option value="Automotive">Automotive</option>
            </select>

            <select className="form-control min-w-52" value={filters.sort || '-createdAt'} onChange={handleSortChange}>
              <option value="-createdAt">Newest Arrivals</option>
              <option value="createdAt">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-center font-semibold text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[430px] rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="skeleton h-52 rounded-[18px]" />
                <div className="mt-5 space-y-3">
                  <div className="skeleton h-4 w-1/3 rounded-full" />
                  <div className="skeleton h-7 w-4/5 rounded-full" />
                  <div className="skeleton h-4 w-full rounded-full" />
                  <div className="skeleton h-4 w-2/3 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="panel py-20 text-center">
            <HiSearch className="mx-auto mb-4 text-5xl text-slate-300" />
            <h3 className="font-title text-2xl font-black text-slate-950">No products found</h3>
            <p className="mx-auto mt-2 max-w-md text-slate-500">
              We could not find anything matching the current filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                dispatch(clearFilters());
              }}
              className="btn btn-primary mt-6"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {pages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="panel flex items-center gap-4 rounded-full px-4 py-3">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="btn btn-secondary h-10 w-10 rounded-full p-0"
                    title="Previous page"
                  >
                    <HiChevronLeft className="text-xl" />
                  </button>
                  <span className="px-2 text-sm font-black text-slate-700">Page {page} of {pages}</span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pages}
                    className="btn btn-secondary h-10 w-10 rounded-full p-0"
                    title="Next page"
                  >
                    <HiChevronRight className="text-xl" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Products;
