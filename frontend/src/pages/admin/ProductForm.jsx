import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { addProduct, editProduct, fetchProduct, clearProduct, clearError } from '../../redux/productSlice';
import { HiArrowLeft, HiSave, HiOutlineCube, HiOutlinePhotograph, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

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

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { product, loading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    category: '',
    stock: 0,
    status: 'active',
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState('');

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchProduct(id));
    }
    return () => {
      dispatch(clearProduct());
      dispatch(clearError());
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || 0,
        status: product.status || 'active',
        imageFile: null,
      });
      setImagePreview(product.image?.url || '');
    }
  }, [isEditMode, product]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = value;

    if (name === 'sku') {
      finalValue = value.toUpperCase().replace(/\s+/g, '-');
    }
    if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      imageFile: file,
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const clearSelectedImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: null,
    }));
    setImagePreview(product?.image?.url || '');
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.sku.trim()) errors.sku = 'SKU is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (formData.price === '' || formData.price < 0) errors.price = 'Valid price is required';
    if (!formData.category) errors.category = 'Category is required';
    if (formData.stock === '' || formData.stock < 0) errors.stock = 'Valid stock is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(editProduct({ id, productData: formData })).unwrap();
      } else {
        await dispatch(addProduct(formData)).unwrap();
      }
      navigate('/admin/products');
    } catch (err) {
      // Error is handled in thunk (toast) and stored in redux state
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/admin/products" className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 shadow-sm transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700">
        <HiArrowLeft /> Back to Products
      </Link>
      
      <div className="panel overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-950 p-6 text-white md:p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
              <HiOutlineCube />
            </span>
            <div>
              <h1 className="font-title text-3xl font-black">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-300">Keep catalog details accurate and ready for shoppers.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="m-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600 md:mx-8">
            {error}
          </div>
        )}

        {loading && isEditMode && !product ? (
          <div className="flex justify-center py-12"><div className="loader"></div></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-7 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group md:col-span-2">
                <label className="mb-2 block text-sm font-black text-slate-600">Product Image</label>
                <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-stretch">
                  <div className="flex h-44 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-400">
                        <HiOutlinePhotograph className="mx-auto mb-2 text-4xl" />
                        <span className="text-sm font-bold">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-5">
                    <input
                      id="product-image"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                    <label htmlFor="product-image" className="btn btn-secondary w-fit cursor-pointer">
                      <HiOutlinePhotograph />
                      Upload Image
                    </label>
                    <p className="mt-3 text-sm font-medium text-slate-500">JPEG, PNG, GIF, or WebP up to 5MB.</p>
                    {formData.imageFile && (
                      <button type="button" onClick={clearSelectedImage} className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-black text-red-600 hover:text-red-700">
                        <HiX /> Remove selected image
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Name */}
              <div className="form-group md:col-span-2">
                <label className="mb-2 block text-sm font-black text-slate-600">Product Name *</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-control ${validationErrors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="e.g. Premium Wireless Headphones"
                />
                {validationErrors.name && <p className="mt-2 text-xs font-bold text-red-600">{validationErrors.name}</p>}
              </div>

              {/* SKU */}
              <div className="form-group">
                <label className="mb-2 block text-sm font-black text-slate-600">SKU *</label>
                <input 
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={`form-control font-mono uppercase ${validationErrors.sku ? 'border-red-500' : ''}`}
                  placeholder="WH-001"
                />
                {validationErrors.sku && <p className="mt-2 text-xs font-bold text-red-600">{validationErrors.sku}</p>}
                <p className="mt-2 text-xs font-semibold text-slate-400">Must be unique. Spaces convert to hyphens.</p>
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="mb-2 block text-sm font-black text-slate-600">Category *</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`form-control ${validationErrors.category ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {validationErrors.category && <p className="mt-2 text-xs font-bold text-red-600">{validationErrors.category}</p>}
              </div>

              {/* Price */}
              <div className="form-group">
                <label className="mb-2 block text-sm font-black text-slate-600">Price ($) *</label>
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`form-control ${validationErrors.price ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                />
                {validationErrors.price && <p className="mt-2 text-xs font-bold text-red-600">{validationErrors.price}</p>}
              </div>

              {/* Stock */}
              <div className="form-group">
                <label className="mb-2 block text-sm font-black text-slate-600">Stock Quantity *</label>
                <input 
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`form-control ${validationErrors.stock ? 'border-red-500' : ''}`}
                  placeholder="0"
                />
                {validationErrors.stock && <p className="mt-2 text-xs font-bold text-red-600">{validationErrors.stock}</p>}
              </div>

              {/* Status */}
              <div className="form-group md:col-span-2">
                <label className="mb-3 block text-sm font-black text-slate-600">Product Status</label>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className={`cursor-pointer rounded-2xl border p-4 transition-colors ${formData.status === 'active' ? 'border-teal-300 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-sm font-black">Active</span>
                  </label>
                  <label className={`cursor-pointer rounded-2xl border p-4 transition-colors ${formData.status === 'inactive' ? 'border-slate-400 bg-slate-100 text-slate-900' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-sm font-black">Inactive</span>
                  </label>
                  <label className={`cursor-pointer rounded-2xl border p-4 transition-colors ${formData.status === 'out_of_stock' ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="out_of_stock"
                      checked={formData.status === 'out_of_stock'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-sm font-black">Out of Stock</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="form-group md:col-span-2">
                <label className="mb-2 block text-sm font-black text-slate-600">Description *</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`form-control ${validationErrors.description ? 'border-red-500' : ''}`}
                  placeholder="Product description..."
                ></textarea>
                {validationErrors.description && <p className="mt-2 text-xs font-bold text-red-600">{validationErrors.description}</p>}
              </div>

            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
              <Link to="/admin/products" className="btn btn-secondary px-6">
                Cancel
              </Link>
              <button 
                type="submit" 
                className="btn btn-primary px-6 flex items-center gap-2"
                disabled={loading}
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <HiSave />}
                {isEditMode ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
