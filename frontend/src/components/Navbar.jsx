import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { 
  HiOutlineCube, 
  HiOutlineShoppingBag, 
  HiOutlineViewGrid, 
  HiOutlineShoppingCart,
  HiOutlineLogout,
  HiViewGrid,
  HiShieldCheck,
  HiOutlineShieldCheck,
  HiCollection
} from 'react-icons/hi';

const navLinkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? 'text-white'
      : 'text-zinc-400 hover:text-white'
  }`;

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-black/50 px-5 py-2.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
        
        <NavLink to="/" className="flex items-center gap-2.5 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-black shadow-lg shadow-orange-500/20">
            <HiCollection className="text-lg" />
          </span>
          <span className="font-title text-xl font-black tracking-tight">ShopVault</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass}>
            <HiViewGrid className="text-lg" />
            Browse
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass}>
              <HiShieldCheck className="text-lg" />
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white transition-colors">
            <HiOutlineShoppingCart className="text-xl" />
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-black shadow-sm shadow-orange-500/50 border border-black">
                {totalQuantity}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="hidden sm:flex items-center gap-2 hover:bg-white/5 px-2 py-1.5 rounded-full transition-colors cursor-pointer">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/20 text-orange-500 font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-zinc-300">{user.name.split(' ')[0]}</span>
              </Link>
              <button 
                onClick={() => dispatch(logout())}
                className="flex h-9 items-center gap-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-red-400 hover:border-red-500/30 px-3 py-1.5 text-sm font-semibold transition-colors"
              >
                <HiOutlineLogout className="text-base"/>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="flex h-9 items-center rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white px-4 py-1.5 text-sm font-semibold transition-colors">
                Log in
              </Link>
              <Link to="/register" className="flex h-9 items-center rounded-full bg-white text-black hover:bg-zinc-200 px-4 py-1.5 text-sm font-bold shadow-md shadow-white/10 transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
