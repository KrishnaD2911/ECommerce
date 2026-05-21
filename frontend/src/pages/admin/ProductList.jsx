import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchProducts,
  removeProduct,
  restoreProduct,
  bulkRemoveProducts,
  bulkPriceUpdate,
  bulkStatusUpdate,
  setPage,
} from '../../redux/productSlice';
import SearchBar from '../../components/SearchBar';
import Filters from '../../components/Filters';
import ProductTable from '../../components/ProductTable';
import BulkToolbar from '../../components/BulkToolbar';
import { HiPlus, HiChevronLeft, HiChevronRight, HiOutlineViewGrid } from 'react-icons/hi';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error, page, pages, filters, totalProducts } = useSelector((state) => state.products);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, page, filters]);

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? products.map(p => p._id) : []);
  };

  const handleSelectOne = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter(itemId => itemId !== id) : [...current, id]
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(removeProduct(id));
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    }
  };

  const handleRestore = (id) => {
    dispatch(restoreProduct(id)).then(() => {
      dispatch(fetchProducts());
    });
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      dispatch(bulkRemoveProducts(selectedIds)).then(() => {
        setSelectedIds([]);
      });
    }
  };

  const handleBulkPriceUpdate = (percentage) => {
    dispatch(bulkPriceUpdate({ ids: selectedIds, percentage })).then(() => {
      dispatch(fetchProducts());
      setSelectedIds([]);
    });
  };

  const handleBulkStatusUpdate = (status) => {
    dispatch(bulkStatusUpdate({ ids: selectedIds, status })).then(() => {
      dispatch(fetchProducts());
      setSelectedIds([]);
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      dispatch(setPage(newPage));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-black text-teal-700">
            <HiOutlineViewGrid />
            Inventory
          </div>
          <h1 className="font-title text-4xl font-black text-slate-950">Manage Products</h1>
          <p className="mt-2 text-base font-medium text-slate-500">{totalProducts} products in the current view</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <HiPlus className="text-lg" />
          Add Product
        </Link>
      </header>

      <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_340px]">
        <Filters />
        <aside className="panel flex flex-col justify-center p-5">
          <label className="mb-3 block text-sm font-black text-slate-600">Quick Search</label>
          <SearchBar />
        </aside>
      </div>

      <BulkToolbar
        selectedCount={selectedIds.length}
        onDelete={handleBulkDelete}
        onPriceUpdate={handleBulkPriceUpdate}
        onStatusUpdate={handleBulkStatusUpdate}
        onClearSelection={() => setSelectedIds([])}
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {loading && products.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="loader" />
        </div>
      ) : (
        <>
          <ProductTable
            products={products}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />

          {pages > 1 && (
            <div className="panel mt-6 flex items-center justify-between rounded-2xl p-4">
              <span className="text-sm font-black text-slate-500">Page {page} of {pages}</span>
              <div className="flex gap-2">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="btn btn-secondary">
                  <HiChevronLeft /> Prev
                </button>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === pages} className="btn btn-secondary">
                  Next <HiChevronRight />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
