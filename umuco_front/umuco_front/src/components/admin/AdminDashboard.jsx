import { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, Users, Package, ShoppingBag, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiJson } from '../../config/api';
import { Toast, authH } from './adminHelpers.jsx';
import OverviewSection from './OverviewSection.jsx';
import UsersSection from './UsersSection.jsx';
import ProductsSection from './ProductsSection.jsx';
import OrdersSection from './OrdersSection.jsx';

const NAV = [
  { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
  { id: 'users',     label: 'Users',      icon: Users },
  { id: 'products',  label: 'Products',   icon: Package },
  { id: 'orders',    label: 'Orders',     icon: ShoppingBag },
];

export default function AdminDashboard({ onNavigate }) {
  const { user, logout } = useAuth();
  const [active, setActive] = useState('overview');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    apiJson('/api/admin/stats', { headers: authH() })
      .then((data) => setStats(data))
      .catch((e) => showToast(e.message, 'error'))
      .finally(() => setStatsLoading(false));
  }, [showToast]);

  const handleLogout = () => {
    logout();
    onNavigate?.('home');
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] font-sans text-[#30221E]">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />}

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#EADBC8] bg-[#FDFBF7] px-5 py-6 lg:flex">
        <button
          type="button"
          onClick={() => onNavigate?.('home')}
          className="mb-2 flex items-center gap-3 text-left"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#8D493A] text-xl text-[#8D493A]">✳</span>
          <span className="text-lg font-bold tracking-tight text-[#8D493A]">UmucoCore</span>
        </button>
        <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-[#9A877D]">Admin panel</p>
        <div className="mb-5 rounded-xl bg-[#F5EEE5] px-3 py-2 text-xs font-semibold text-[#8D493A]">
          {user?.name}
        </div>

        <nav className="space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                active === id ? 'bg-[#F3E7DE] text-[#8D493A]' : 'text-[#6F5B55] hover:bg-[#F8F3ED]'
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#78665E] hover:bg-[#F8F3ED]"
        >
          <LogOut size={18} /> Log out
        </button>
      </aside>

      {/* Main */}
      <main className="px-4 pb-16 pt-6 sm:px-7 lg:ml-64 lg:px-10 lg:pt-8">
        <header className="mx-auto mb-8 flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[#8D493A] text-lg text-[#8D493A]">✳</span>
            <b className="text-[#8D493A]">Admin</b>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('dashboard')}
            className="hidden items-center gap-2 text-sm font-semibold text-[#8D493A] lg:flex"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </button>
          <div className="ml-auto hidden text-right sm:block">
            <p className="m-0 text-xs text-[#9A877D]">Admin</p>
            <p className="m-0 text-sm font-bold">{user?.name}</p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {NAV.find((n) => n.id === active)?.label}
            </h1>
          </div>

          {active === 'overview'  && <OverviewSection stats={stats} loading={statsLoading} />}
          {active === 'users'     && <UsersSection toast={showToast} currentUserId={user?.id} />}
          {active === 'products'  && <ProductsSection toast={showToast} />}
          {active === 'orders'    && <OrdersSection toast={showToast} />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl border border-[#EADBC8] bg-[#FDFBF7]/95 p-2 shadow-lg backdrop-blur lg:hidden">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-[9px] font-bold ${active === id ? 'text-[#8D493A]' : 'text-[#78665E]'}`}
          >
            <Icon size={17} /> {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
