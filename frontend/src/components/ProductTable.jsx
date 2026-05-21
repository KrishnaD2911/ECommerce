import { Link } from 'react-router-dom';
import { HiPencil, HiTrash, HiRefresh, HiOutlineCube } from 'react-icons/hi';

const ProductTable = ({
  products,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onDelete,
  onRestore,
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="panel p-10 text-center">
        <HiOutlineCube className="mx-auto mb-3 text-5xl text-slate-300" />
        <p className="font-bold text-slate-500">No products found.</p>
      </div>
    );
  }

  const allSelected = products.length > 0 && selectedIds.length === products.length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">Active</span>;
      case 'inactive':
        return <span className="badge badge-warning">Inactive</span>;
      case 'out_of_stock':
        return <span className="badge badge-error">Out of Stock</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="w-12 px-5 py-4 text-center">
                <input type="checkbox" className="checkbox" checked={allSelected} onChange={onSelectAll} />
              </th>
              <th className="px-5 py-4 text-xs font-black uppercase text-slate-500">Product</th>
              <th className="px-5 py-4 text-xs font-black uppercase text-slate-500">SKU</th>
              <th className="px-5 py-4 text-xs font-black uppercase text-slate-500">Price</th>
              <th className="px-5 py-4 text-xs font-black uppercase text-slate-500">Stock</th>
              <th className="px-5 py-4 text-xs font-black uppercase text-slate-500">Status</th>
              <th className="px-5 py-4 text-xs font-black uppercase text-slate-500">Created</th>
              <th className="px-5 py-4 text-right text-xs font-black uppercase text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {products.map((product) => (
              <tr key={product._id} className="transition-colors hover:bg-teal-50/40">
                <td className="px-5 py-4 text-center">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedIds.includes(product._id)}
                    onChange={() => onSelectOne(product._id)}
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {product.image?.url ? (
                      <img
                        src={product.image.url}
                        alt={product.name}
                        className="h-11 w-11 shrink-0 rounded-2xl object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 font-black text-white shadow-sm">
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-black text-slate-950">{product.name}</div>
                      <div className="text-sm font-medium text-slate-500">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <code className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                    {product.sku}
                  </code>
                </td>
                <td className="px-5 py-4 font-black text-slate-950">{formatPrice(product.price)}</td>
                <td className="px-5 py-4">
                  <span className={`font-black ${product.stock <= 5 ? 'text-amber-600' : 'text-slate-700'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-4">{getStatusBadge(product.status)}</td>
                <td className="px-5 py-4 text-sm font-medium text-slate-500">{formatDate(product.createdAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/products/edit/${product._id}`} className="action-btn text-blue-600 hover:bg-blue-50" title="Edit">
                      <HiPencil />
                    </Link>
                    {product.isDeleted ? (
                      <button onClick={() => onRestore(product._id)} className="action-btn text-emerald-600 hover:bg-emerald-50" title="Restore">
                        <HiRefresh />
                      </button>
                    ) : (
                      <button onClick={() => onDelete(product._id)} className="action-btn text-red-600 hover:bg-red-50" title="Delete">
                        <HiTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s ease;
          border: none;
          cursor: pointer;
          background: transparent;
        }
        .checkbox {
          width: 1.1rem;
          height: 1.1rem;
          border-radius: 6px;
          accent-color: #0f766e;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ProductTable;
