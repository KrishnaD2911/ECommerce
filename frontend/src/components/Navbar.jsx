import { NavLink } from 'react-router-dom';
import { HiOutlineCube, HiOutlineShoppingBag, HiOutlineViewGrid } from 'react-icons/hi';

const navLinkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
    isActive
      ? 'bg-teal-50 text-teal-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
  }`;

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/88 px-4 py-3 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-3 text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
            <HiOutlineCube className="text-xl" />
          </span>
          <span className="font-title text-2xl font-black">ShopVault</span>
        </NavLink>

        <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1">
          <NavLink to="/" className={navLinkClass}>
            <HiOutlineShoppingBag />
            Browse
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            <HiOutlineViewGrid />
            Admin
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
