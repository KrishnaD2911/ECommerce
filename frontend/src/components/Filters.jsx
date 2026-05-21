import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../redux/productSlice';
import { HiFilter, HiX } from 'react-icons/hi';

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Books',
  'Sports',
  'Beauty',
  'Toys',
  'Automotive',
  'Other',
];

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Out of stock', value: 'out_of_stock' },
];

const deletedOptions = [
  { label: 'Current', value: '' },
  { label: 'Deleted', value: 'only' },
  { label: 'All records', value: 'include' },
];

const Filters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.products);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleStatusChange = (value) => {
    dispatch(setFilters({ status: value }));
  };

  const handleDeletedChange = (value) => {
    dispatch(setFilters({ deleted: value }));
  };

  return (
    <section className="panel p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <HiFilter className="text-xl" />
          </span>
          <div>
            <h3 className="font-title text-lg font-black text-slate-950">Filters</h3>
            <p className="text-sm font-medium text-slate-500">Refine the inventory view</p>
          </div>
        </div>
        <button onClick={() => dispatch(clearFilters())} className="btn btn-secondary px-3" title="Reset filters">
          <HiX />
          Reset
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleStatusChange(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
              filters.status === option.value
                ? 'bg-slate-950 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
        {deletedOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleDeletedChange(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
              filters.deleted === option.value
                ? 'bg-teal-700 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-600">Category</span>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="form-control">
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-600">Sort By</span>
          <select name="sort" value={filters.sort} onChange={handleFilterChange} className="form-control">
            <option value="-createdAt">Latest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-600">From Date</span>
          <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="form-control" />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-600">To Date</span>
          <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="form-control" />
        </label>
      </div>
    </section>
  );
};

export default Filters;
