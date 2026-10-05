import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BriefcaseBusiness, Check, ClipboardList, FileText,
  Leaf, LogOut, Minus, Package, Plus, ShoppingBag, Sparkles, Sprout, Trees,
  Waves, X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import TribalLogo from '../../assets/Logo';
import braceletImage from '../../assets/bracelet.png';
import penImage from '../../assets/pen.png';
import shirtImage from '../../assets/t-shirt.png';
import heroImage from '../../assets/rwanda.jpg';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

// NOTE: prices are in RWF. Adjust them to your real prices.
const products = [
  {
    id: 'bracelet',
    name: 'Umuco Heritage Bracelet',
    category: 'Wear & share',
    price: 40000,
    image: braceletImage,
    featured: true,
    description: 'Carry a little reminder of where stories begin. This bracelet celebrates the hands, heritage, and imagination that bring our community together.',
    story: 'Made to be worn, gifted, and talked about. Each bracelet is an invitation to share the stories and traditions that make Rwanda feel like home.',
  },
  {
    id: 'story-pen',
    name: 'Storykeeper Writing Kit',
    category: 'Stories & learning',
    price: 35000,
    image: penImage,
    description: 'Some of our most treasured stories live in the voices of the people around us. Make space to listen, write them down, and pass them on.',
    story: 'A thoughtful companion for preserving family memories, community wisdom, and the small moments that deserve to be remembered.',
  },
  {
    id: 'polo',
    name: 'Umuco Everyday Polo',
    category: 'Wear & share',
    price: 49000,
    image: shirtImage,
    description: 'Wear your connection with pride. This comfortable polo brings contemporary style together with a celebration of Rwandan creativity.',
    story: 'Created for everyday journeys and shared moments, the Umuco polo is a simple way to carry your culture wherever you go.',
  },
];

const materials = [
  { id: 'sisal', name: 'Sisal & sweetgrass', type: 'Plant fibre', icon: Sprout, detail: 'Plant fibre for woven pieces, baskets, and durable craft products.' },
  { id: 'natural-dyes', name: 'Natural pigments', type: 'Colour & finish', icon: Leaf, detail: 'Consider colour, safe handling, and a consistent finish for each product.' },
  { id: 'cotton', name: 'Cotton fabric', type: 'Textile', icon: Trees, detail: 'Estimate fabric for apparel or soft goods, including cutting waste.' },
  { id: 'paper', name: 'Paper & packaging', type: 'Presentation', icon: ClipboardList, detail: 'Plan story cards, labels, and recyclable packaging for finished kits.' },
  { id: 'water', name: 'Water & finishing', type: 'Workshop needs', icon: Waves, detail: 'Account for water and other basic needs when arranging workshop work.' },
];

const sections = [
  { id: 'kits', label: 'Shop kits', icon: ShoppingBag },
  { id: 'materials', label: 'Materials', icon: Leaf },
  { id: 'business', label: 'Idea generator', icon: BriefcaseBusiness },
  { id: 'orders', label: 'My orders', icon: Package },
];

const defaultBusinessForm = {
  idea: 'Cultural craft shop',
  location: 'Kigali',
  budget: '500000',
  customer: '',
  goal: '',
};

const ORDERS_KEY = 'umuco_orders_v2';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function readOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return true;
  } catch {
    return false;
  }
}

function newOrderId() {
  const raw = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}${Math.random()}`;
  return `UM-${raw.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()}`;
}

function formatRwf(amount) {
  return `RWF ${Number(amount || 0).toLocaleString('en-RW')}`;
}

function formatDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function SectionHeading({ eyebrow, title, description, aside }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-bold tracking-wide text-[#8D493A]">{eyebrow}</p>}
        <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {description && <p className="m-0 max-w-2xl text-sm leading-6 text-[#6F5B55]">{description}</p>}
      </div>
      {aside}
    </div>
  );
}

function QuantityStepper({ value, onChange, label, min = 0 }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(-1)}
        disabled={value <= min}
        aria-label={`Remove one ${label}`}
        className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#874638] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus size={15} />
      </button>
      <span className="min-w-[1.25rem] text-center text-sm font-bold" aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(1)}
        aria-label={`Add one ${label}`}
        className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#874638]"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

/** Accessible modal / side drawer: Escape closes, focus is trapped and restored, page scroll is locked. */
function Modal({ label, onClose, side = false, children }) {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const panel = panelRef.current;
    const getFocusable = () =>
      [...panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
        .filter((el) => !el.disabled);

    getFocusable()[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = getFocusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex bg-[#241815]/60 ${side ? 'justify-end' : 'items-center justify-center p-4'}`}
      role="presentation"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={side
          ? 'relative flex h-full w-full max-w-md flex-col bg-[#FDFBF7] shadow-2xl'
          : 'relative w-full max-w-3xl overflow-hidden rounded-3xl bg-[#FDFBF7] shadow-2xl'}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-[#874638] shadow"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

function ProductCard({ product, quantity, onAdd, onBuyNow, onViewDetails }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#EADBC8] bg-white shadow-[0_8px_28px_rgba(80,49,20,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(80,49,20,0.12)]">
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#F5EEE5] p-6 sm:h-72">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#874638]">{product.category}</span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="m-0 text-lg font-bold tracking-tight text-[#30221E]">{product.name}</h3>
          <span className="shrink-0 text-base font-bold text-[#874638]">{formatRwf(product.price)}</span>
        </div>
        <p className="mb-5 min-h-[4.5rem] text-sm leading-6 text-[#6F5B55]">{product.description}</p>
        {quantity > 0 && (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-[#F8F5F0] p-2">
            <span className="pl-2 text-xs font-semibold text-[#6F5B55]">In your cart</span>
            <QuantityStepper value={quantity} label={product.name} onChange={(delta) => onAdd(product, delta)} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => onAdd(product, 1)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8D493A] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#71392E]">
            <Plus size={15} /> Add to cart
          </button>
          <button type="button" onClick={() => onViewDetails(product)} className="rounded-xl border border-[#DCC9B9] bg-white px-3 py-3 text-xs font-bold text-[#874638] transition hover:bg-[#F8F5F0]">
            View details
          </button>
        </div>
        <button type="button" onClick={() => onBuyNow(product)} className="mt-2 w-full rounded-xl border border-[#874638] px-3 py-2.5 text-xs font-bold text-[#874638] transition hover:bg-[#F8F1EB]">
          Buy now
        </button>
      </div>
    </article>
  );
}

function MaterialCard({ material, quantity, onChange }) {
  const Icon = material.icon;
  return (
    <article className={`rounded-2xl border bg-white p-5 transition ${quantity > 0 ? 'border-[#A97561] shadow-sm' : 'border-[#EADBC8]'}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F5EEE5] text-[#8D493A]"><Icon size={20} /></span>
        <span className="rounded-full bg-[#F8F5F0] px-3 py-1 text-[11px] font-bold text-[#6F5B55]">{material.type}</span>
      </div>
      <h3 className="mb-2 text-base font-bold">{material.name}</h3>
      <p className="mb-5 min-h-10 text-xs leading-5 text-[#6F5B55]">{material.detail}</p>
      <div className="flex items-center justify-between rounded-xl bg-[#F8F5F0] p-2">
        <span className="pl-2 text-xs font-semibold text-[#6F5B55]">Planning units</span>
        <QuantityStepper value={quantity} label={material.name} onChange={(delta) => onChange(material.id, delta)} />
      </div>
    </article>
  );
}

function CartDrawer({ items, total, onChange, onCheckout, onClose }) {
  return (
    <Modal label="Shopping cart" onClose={onClose} side>
      <div className="border-b border-[#EADBC8] p-6 pr-16">
        <h2 className="m-0 text-xl font-bold">Your cart</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DCC9B9] p-7 text-center">
            <ShoppingBag className="mx-auto mb-3 text-[#8D493A]" size={23} />
            <p className="mb-1 text-sm font-bold">Your cart is empty</p>
            <p className="m-0 text-xs text-[#6F5B55]">Add a kit from the collection to get started.</p>
          </div>
        ) : (
          <ul className="m-0 list-none space-y-4 p-0">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 rounded-2xl border border-[#EADBC8] bg-white p-3">
                <img src={item.image} alt="" className="h-16 w-16 rounded-xl bg-[#F5EEE5] object-contain p-1" />
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-sm font-bold">{item.name}</p>
                  <p className="mb-2 mt-0.5 text-xs text-[#6F5B55]">{formatRwf(item.price)}</p>
                  <QuantityStepper value={item.quantity} label={item.name} onChange={(delta) => onChange(item, delta)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {items.length > 0 && (
        <div className="border-t border-[#EADBC8] p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#6F5B55]">Total</span>
            <strong className="text-xl text-[#874638]">{formatRwf(total)}</strong>
          </div>
          <button type="button" onClick={onCheckout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white hover:bg-[#71392E]">
            Review order <ArrowRight size={16} />
          </button>
        </div>
      )}
    </Modal>
  );
}

function CheckoutDialog({ items, onConfirm, onClose }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <Modal label="Confirm your order" onClose={onClose}>
      <div className="p-6 sm:p-8">
        <h2 className="mb-1 pr-10 text-2xl font-bold">Confirm your order</h2>
        <p className="mb-5 text-sm text-[#6F5B55]">Check your items before placing the order.</p>
        <ul className="m-0 mb-5 list-none space-y-2 p-0">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 rounded-xl bg-[#F8F5F0] px-4 py-3 text-sm">
              <span className="font-semibold">{item.name} × {item.quantity}</span>
              <span className="text-[#874638]">{formatRwf(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#6F5B55]">Total</span>
          <strong className="text-xl text-[#874638]">{formatRwf(total)}</strong>
        </div>
        <p className="mb-5 text-xs leading-5 text-[#6F5B55]">Online payment and delivery are not available yet. Your order is saved on this device so you can find it under My orders.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onConfirm} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white hover:bg-[#71392E]">
            <Check size={16} /> Place order
          </button>
          <button type="button" onClick={onClose} className="rounded-xl border border-[#DCC9B9] bg-white px-5 py-3 text-sm font-bold text-[#874638] hover:bg-[#F8F5F0]">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ProductDetail({ product, onAdd, onClose }) {
  return (
    <Modal label={product.name} onClose={onClose}>
      <div className="grid sm:grid-cols-2">
        <div className="flex min-h-64 items-center justify-center bg-[#F5EEE5] p-8">
          <img src={product.image} alt={product.name} className="h-56 w-full object-contain" />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <span className="mb-3 w-fit rounded-full bg-[#F3E7DE] px-3 py-1 text-[11px] font-bold text-[#874638]">{product.category}</span>
          <h2 className="mb-3 pr-8 text-2xl font-bold">{product.name}</h2>
          <p className="mb-4 text-sm leading-7 text-[#6F5B55]">{product.story}</p>
          <strong className="mb-5 text-xl text-[#874638]">{formatRwf(product.price)}</strong>
          <button type="button" onClick={onAdd} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white hover:bg-[#71392E]">
            <Plus size={16} /> Add to cart
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Dashboard({ onNavigate, onLogout }) {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('kits');
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState(readOrders);
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [businessForm, setBusinessForm] = useState(defaultBusinessForm);
  const [businessPlan, setBusinessPlan] = useState(null);
  const [planStale, setPlanStale] = useState(false);
  const [toast, setToast] = useState('');
  const [detailProduct, setDetailProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(null); // { items, source: 'cart' | 'buy' }

  const featuredProduct = products.find((product) => product.featured) || products[0];

  const cartItems = useMemo(
    () => products.filter((product) => cart[product.id] > 0).map((product) => ({ ...product, quantity: cart[product.id] })),
    [cart],
  );
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const arrangedMaterials = materials.filter((material) => selectedMaterials[material.id] > 0);
  const arrangedUnitCount = arrangedMaterials.reduce((total, material) => total + selectedMaterials[material.id], 0);

  /* Toast auto-dismiss */
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  /* Highlight the nav item for the section currently in view */
  useEffect(() => {
    const elements = sections.map(({ id }) => document.getElementById(`dashboard-${id}`)).filter(Boolean);
    if (!elements.length || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActiveSection(visible[0].target.id.replace('dashboard-', ''));
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const goTo = (id) => {
    setActiveSection(id);
    document.getElementById(`dashboard-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateCart = useCallback((product, delta) => {
    setCart((current) => ({ ...current, [product.id]: Math.max(0, (current[product.id] || 0) + delta) }));
    if (delta > 0) setToast(`${product.name} added to your cart.`);
  }, []);

  const buyNow = (product) => {
    setCheckout({ source: 'buy', items: [{ id: product.id, name: product.name, price: product.price, quantity: 1 }] });
  };

  const openCartCheckout = () => {
    setCartOpen(false);
    setCheckout({
      source: 'cart',
      items: cartItems.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
    });
  };

  const confirmOrder = () => {
    if (!checkout) return;
    const order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      items: checkout.items,
      total: checkout.items.reduce((total, item) => total + item.price * item.quantity, 0),
    };
    const nextOrders = [order, ...orders];
    const saved = writeOrders(nextOrders);
    setOrders(nextOrders);
    if (checkout.source === 'cart') setCart({});
    setCheckout(null);
    setToast(saved
      ? `Order ${order.id} placed and saved on this device.`
      : `Order ${order.id} placed, but it could not be saved on this device.`);
    goTo('orders');
  };

  const clearOrderHistory = () => {
    try {
      localStorage.removeItem(ORDERS_KEY);
      // Remove the earlier demo key too, in case orders were saved by the old dashboard.
      localStorage.removeItem('umuco_demo_orders');
      setOrders([]);
      setToast('Order history cleared. You can start fresh.');
    } catch {
      setToast('Could not clear order history on this device.');
    }
  };

  const updateMaterialPlan = (id, delta) => {
    setSelectedMaterials((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) + delta) }));
    if (businessPlan) setPlanStale(true);
  };

  const updateBusinessForm = (event) => {
    const { name, value } = event.target;
    setBusinessForm((current) => ({ ...current, [name]: value }));
    if (businessPlan) setPlanStale(true);
  };

  const generateBusinessPlan = (event) => {
    event.preventDefault();
    setBusinessPlan({
      ...businessForm,
      materials: arrangedMaterials.map((material) => ({
        name: material.name,
        quantity: selectedMaterials[material.id],
        type: material.type,
      })),
      generatedAt: new Date().toISOString(),
    });
    setPlanStale(false);
  };

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  const inputClass = 'mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]';

  return (
    <div className="min-h-screen bg-[#F8F5F0] font-sans text-[#30221E]">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#EADBC8] bg-[#FDFBF7] px-5 py-6 lg:flex">
        <button type="button" onClick={() => onNavigate?.('home')} className="mb-10 flex items-center gap-3 text-left">
          <TribalLogo aria-label="UmucoCore logo" role="img" style={{ width: 40, height: 40 }} />
          <span className="text-lg font-bold tracking-tight text-[#8D493A]">UmucoCore</span>
        </button>
        <p className="mb-3 px-3 text-xs font-bold text-[#6F5B55]">Explore Umuco</p>
        <nav className="space-y-1" aria-label="Dashboard sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id)}
              aria-current={activeSection === id ? 'true' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${activeSection === id ? 'bg-[#F3E7DE] text-[#8D493A]' : 'text-[#6F5B55] hover:bg-[#F8F3ED]'}`}
            >
              <Icon size={18} /><span>{label}</span>
              {id === 'kits' && cartCount > 0 && <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px]">{cartCount}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#F5EEE5] p-4">
          <Sparkles size={18} className="mb-3 text-[#8D493A]" />
          <p className="mb-1 text-sm font-bold">Culture, carried forward.</p>
          <p className="mb-0 text-xs leading-5 text-[#6F5B55]">Discover keepsakes made to connect generations and spark new ideas.</p>
        </div>
        <button type="button" onClick={handleLogout} className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#6F5B55] hover:bg-[#F8F3ED]">
          <LogOut size={18} /> Log out
        </button>
      </aside>

      <main className="px-4 pb-28 pt-5 sm:px-7 lg:ml-64 lg:px-10 lg:pb-16 lg:pt-7">
        {/* Top bar */}
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:hidden">
            <TribalLogo aria-label="UmucoCore logo" role="img" style={{ width: 36, height: 36 }} />
            <b className="text-[#8D493A]">UmucoCore</b>
          </div>
          <button type="button" onClick={() => onNavigate?.('home')} className="hidden items-center gap-2 text-sm font-semibold text-[#8D493A] lg:flex">
            <ArrowLeft size={16} /> Back to home
          </button>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[#EADBC8] bg-white text-[#8D493A]"
              aria-label={`Open shopping cart, ${cartCount} items`}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-[#8D493A] px-1 text-[11px] font-bold text-white">{cartCount}</span>}
            </button>
            <div className="hidden text-right sm:block">
              <p className="m-0 text-xs text-[#6F5B55]">Welcome back</p>
              <p className="m-0 text-sm font-bold">{user?.name || 'Explorer'}</p>
            </div>
            <button type="button" onClick={handleLogout} className="rounded-full border border-[#EADBC8] bg-white px-4 py-2 text-xs font-bold text-[#8D493A] lg:hidden">Log out</button>
          </div>
        </header>

        <div className="mx-auto mt-6 max-w-6xl space-y-16 sm:mt-8 sm:space-y-20">
          {/* ---------------- Shop ---------------- */}
          <section id="dashboard-kits" className="scroll-mt-8">
            {/* Hero with Rwanda background image */}
            <div
              className="relative mb-8 overflow-hidden rounded-[2rem] bg-[#874638] bg-cover bg-center px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-14 lg:py-24"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(48,24,18,0.88) 0%, rgba(48,24,18,0.62) 55%, rgba(48,24,18,0.25) 100%), url(${heroImage})`,
              }}
            >
              <div className="relative max-w-2xl">
                <p className="mb-3 text-xs font-bold tracking-wide text-[#F4D5C6]">UmucoCore · Made to mean something</p>
                <h1 className="mb-4 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">A piece of culture. A story of your own.</h1>
                <p className="mb-7 max-w-xl text-sm leading-7 text-white/90 sm:text-base">Discover thoughtful keepsakes inspired by Rwandan heritage, creative expression, and the stories that bring us closer.</p>
                <button
                  type="button"
                  onClick={() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FDFBF7] px-5 py-3 text-sm font-bold text-[#874638] transition hover:bg-white"
                >
                  Explore the collection <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="mb-9 max-w-3xl">
              <p className="mb-2 text-xs font-bold tracking-wide text-[#8D493A]">A collection with a heartbeat</p>
              <h2 className="mb-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">This is more than a product.</h2>
              <p className="m-0 text-sm leading-7 text-[#6F5B55] sm:text-base">Each kit represents Rwandan culture, creativity, and opportunity. Find something that speaks to you, gift a story to someone you love, or simply wear a reminder of the things worth carrying forward.</p>
            </div>

            {/* Featured product */}
            <article className="mb-10 grid overflow-hidden rounded-[2rem] border border-[#EADBC8] bg-white shadow-[0_14px_44px_rgba(80,49,20,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative flex min-h-72 items-center justify-center bg-[#F5EEE5] p-8 sm:min-h-96 sm:p-12">
                <img src={featuredProduct.image} alt={featuredProduct.name} className="h-64 w-full object-contain sm:h-80" />
                <span className="absolute left-5 top-5 rounded-full bg-[#874638] px-4 py-2 text-[11px] font-bold text-white">Featured</span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                <p className="mb-3 text-xs font-bold tracking-wide text-[#8D493A]">A favourite from the collection</p>
                <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">{featuredProduct.name}</h2>
                <p className="mb-5 text-sm leading-7 text-[#6F5B55]">{featuredProduct.story}</p>
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#874638]">{formatRwf(featuredProduct.price)}</span>
                  <span className="rounded-full bg-[#F8F5F0] px-3 py-1 text-[11px] font-semibold text-[#6F5B55]">{featuredProduct.category}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => updateCart(featuredProduct, 1)} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#71392E]"><Plus size={16} /> Add to cart</button>
                  <button type="button" onClick={() => buyNow(featuredProduct)} className="rounded-xl border border-[#874638] px-5 py-3 text-sm font-bold text-[#874638] transition hover:bg-[#F8F1EB]">Buy now</button>
                  <button type="button" onClick={() => setDetailProduct(featuredProduct)} className="rounded-xl px-4 py-3 text-sm font-bold text-[#6F5B55] underline decoration-[#DCC9B9] underline-offset-4">Our story</button>
                </div>
              </div>
            </article>

            <div id="product-grid" className="scroll-mt-8">
              <SectionHeading
                eyebrow="The Umuco collection"
                title="Find your piece"
                description="Story-led gifts and keepsakes, chosen to celebrate the culture we share."
                aside={<span className="text-xs font-medium text-[#6F5B55]">{products.length} pieces to discover</span>}
              />
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={cart[product.id] || 0}
                    onAdd={updateCart}
                    onBuyNow={buyNow}
                    onViewDetails={setDetailProduct}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- Materials ---------------- */}
          <section id="dashboard-materials" className="scroll-mt-8 border-t border-[#E7D9CA] pt-12 sm:pt-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#EAF0E6] px-3 py-1.5 text-xs font-bold text-[#476344]"><Leaf size={13} /> Optional planning tool</div>
            <SectionHeading
              eyebrow="Explore a making process"
              title="Materials planning"
              description="Curious about what goes into making things? Explore materials and quantities at your own pace."
              aside={<span className="rounded-full bg-[#F3E7DE] px-3 py-1.5 text-xs font-semibold text-[#874638]">{arrangedUnitCount} planned units</span>}
            />
            <div className="mb-5 rounded-2xl border border-[#D8E3D2] bg-[#F2F6EF] p-4 text-sm leading-6 text-[#456040]">
              This section is for planning only. It doesn’t change your cart or your orders.
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {materials.map((material) => (
                <MaterialCard key={material.id} material={material} quantity={selectedMaterials[material.id] || 0} onChange={updateMaterialPlan} />
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-[#F5EEE5] p-5 sm:p-6">
              <h3 className="mb-1 text-sm font-bold">Your materials notes</h3>
              <p className="m-0 text-xs leading-5 text-[#6F5B55]">
                {arrangedMaterials.length
                  ? arrangedMaterials.map((material) => `${material.name} × ${selectedMaterials[material.id]}`).join(' · ')
                  : 'Add materials here if you want to explore a making idea. You can skip this section entirely.'}
              </p>
            </div>
          </section>

          {/* ---------------- Idea generator ---------------- */}
          <section id="dashboard-business" className="scroll-mt-8 border-t border-[#E7D9CA] pt-12 sm:pt-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#F3E7DE] px-3 py-1.5 text-xs font-bold text-[#874638]"><Sparkles size={13} /> Create something of your own</div>
            <SectionHeading
              eyebrow="Separate from shopping"
              title="Business idea generator"
              description="Shape a first idea for a small cultural business. Use your materials notes if helpful, or start with your idea alone."
            />
            {/* Dev note: when AI analysis is added, call it from the backend. Never put API keys in this frontend. */}
            <form onSubmit={generateBusinessPlan} className="grid gap-4 rounded-2xl border border-[#EADBC8] bg-white p-5 sm:grid-cols-2 sm:p-7">
              <label className="text-xs font-bold text-[#6F5B55]">
                Business idea
                <select name="idea" value={businessForm.idea} onChange={updateBusinessForm} className={inputClass}>
                  <option>Cultural craft shop</option>
                  <option>Community weaving cooperative</option>
                  <option>Natural materials workshop</option>
                  <option>Heritage tourism experience</option>
                  <option>Local apparel brand</option>
                </select>
              </label>
              <label className="text-xs font-bold text-[#6F5B55]">
                District or town
                <input name="location" value={businessForm.location} onChange={updateBusinessForm} required className={inputClass} placeholder="e.g. Kigali" />
              </label>
              <label className="text-xs font-bold text-[#6F5B55]">
                Starting budget (RWF)
                <input name="budget" type="number" min="0" value={businessForm.budget} onChange={updateBusinessForm} required className={inputClass} />
              </label>
              <label className="text-xs font-bold text-[#6F5B55]">
                Who do you want to serve?
                <input name="customer" value={businessForm.customer} onChange={updateBusinessForm} className={inputClass} placeholder="e.g. local families and visitors" />
              </label>
              <label className="text-xs font-bold text-[#6F5B55] sm:col-span-2">
                What would you like the business to achieve?
                <textarea name="goal" value={businessForm.goal} onChange={updateBusinessForm} rows="3" className={`${inputClass} resize-y`} placeholder="Describe the first thing you want to make, sell, or improve." />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
                <p className="m-0 text-xs text-[#6F5B55]">
                  {arrangedMaterials.length ? `${arrangedMaterials.length} material types will be included.` : 'Materials are optional. You can generate an idea without them.'}
                </p>
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#71392E]">
                  <FileText size={16} /> Generate starter idea
                </button>
              </div>
            </form>

            {businessPlan && (
              <article className="mt-5 rounded-2xl border border-[#EADBC8] bg-[#F5EEE5] p-5 sm:p-7">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="mb-2 text-xs font-bold tracking-wide text-[#8D493A]">Your starter idea</p>
                    <h3 className="m-0 text-xl font-bold">{businessPlan.idea} · {businessPlan.location}</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#6F5B55]">Created {formatDate(businessPlan.generatedAt)}</span>
                </div>
                {planStale && (
                  <p role="status" className="mb-4 rounded-xl border border-[#E8C9A8] bg-[#FFF6EA] p-3 text-xs text-[#7A4A1C]">
                    You changed your inputs after this idea was created. Select “Generate starter idea” to refresh it.
                  </p>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">Concept</p>
                    <p className="m-0 text-sm leading-6 text-[#6F5B55]">Build a {businessPlan.idea.toLowerCase()} in {businessPlan.location}, using local skills to create useful cultural products.</p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">Starting budget</p>
                    <p className="m-0 text-sm leading-6 text-[#6F5B55]">{formatRwf(businessPlan.budget)}. Start with a small pilot, track material and production costs, and adjust before increasing output.</p>
                  </div>
                  {businessPlan.materials.length > 0 && (
                    <div className="rounded-xl bg-white p-4">
                      <p className="mb-1 text-xs font-bold text-[#874638]">Materials notes</p>
                      <ul className="m-0 space-y-1 pl-4 text-sm leading-6 text-[#6F5B55]">
                        {businessPlan.materials.map((material) => <li key={material.name}>{material.name} · {material.quantity} planning units</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">First steps</p>
                    <p className="m-0 text-sm leading-6 text-[#6F5B55]">Talk with {businessPlan.customer || 'potential customers'}, learn what people value in {businessPlan.location}, then test a small first offer.</p>
                    {businessPlan.goal && (
                      <p className="mb-0 mt-3 border-t border-[#F0E7DE] pt-3 text-sm leading-6 text-[#6F5B55]"><strong className="text-[#30221E]">Your goal:</strong> {businessPlan.goal}</p>
                    )}
                  </div>
                </div>
              </article>
            )}
          </section>

          {/* ---------------- Orders ---------------- */}
          <section id="dashboard-orders" className="scroll-mt-8 border-t border-[#E7D9CA] pt-12 sm:pt-16">
            <SectionHeading
              eyebrow="Your purchases"
              title="My orders"
              description="Orders you place are saved on this device. Online payment and delivery are not available yet."
              aside={orders.length > 0 && (
                <button type="button" onClick={clearOrderHistory} className="rounded-xl border border-[#DCC9B9] bg-white px-4 py-2.5 text-xs font-bold text-[#874638] transition hover:bg-[#F8F1EB]">
                  Clear order history
                </button>
              )}
            />
            {orders.length ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <article key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EADBC8] bg-white p-5">
                    <div>
                      <p className="mb-1 text-xs font-bold text-[#874638]">{order.id}</p>
                      <p className="mb-1 text-sm font-semibold">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p>
                      <p className="m-0 text-xs text-[#6F5B55]">{formatDate(order.createdAt)}</p>
                    </div>
                    <strong className="text-[#874638]">{formatRwf(order.total)}</strong>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#DCC9B9] bg-white/60 p-7 text-center">
                <ShoppingBag className="mx-auto mb-3 text-[#8D493A]" size={23} />
                <p className="mb-1 text-sm font-bold">Your story starts here</p>
                <p className="m-0 text-xs text-[#6F5B55]">You haven’t placed an order yet. Explore the collection whenever you’re ready.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border border-[#EADBC8] bg-[#FDFBF7]/95 p-2 shadow-lg backdrop-blur lg:hidden" aria-label="Dashboard sections">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => goTo(id)}
            aria-current={activeSection === id ? 'true' : undefined}
            className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-bold ${activeSection === id ? 'text-[#8D493A]' : 'text-[#6F5B55]'}`}
          >
            <Icon size={18} />{label}
          </button>
        ))}
      </nav>

      {/* Toast */}
      {toast && (
        <div role="status" className="fixed bottom-24 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-xl border border-[#BBD6BD] bg-[#EFF7EF] p-4 text-sm text-[#315D3A] shadow-lg lg:bottom-8">
          <Check size={18} className="mt-0.5 shrink-0" />
          <span className="flex-1">{toast}</span>
          <button type="button" onClick={() => setToast('')} aria-label="Dismiss message" className="shrink-0 text-[#315D3A]"><X size={16} /></button>
        </div>
      )}

      {/* Overlays */}
      {cartOpen && (
        <CartDrawer
          items={cartItems}
          total={cartTotal}
          onChange={updateCart}
          onCheckout={openCartCheckout}
          onClose={() => setCartOpen(false)}
        />
      )}
      {checkout && <CheckoutDialog items={checkout.items} onConfirm={confirmOrder} onClose={() => setCheckout(null)} />}
      {detailProduct && (
        <ProductDetail
          product={detailProduct}
          onAdd={() => { updateCart(detailProduct, 1); setDetailProduct(null); }}
          onClose={() => setDetailProduct(null)}
        />
      )}
    </div>
  );
}
