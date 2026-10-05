import { useMemo, useState } from 'react';
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

const products = [
  {
    id: 'bracelet',
    name: 'Umuco Heritage Bracelet',
    category: 'Wear & share',
    price: 28,
    image: braceletImage,
    badge: 'Popular',
    description: 'Carry a little reminder of where stories begin. This bracelet celebrates the hands, heritage, and imagination that bring our community together.',
    story: 'Made to be worn, gifted, and talked about. Each bracelet is an invitation to share the stories and traditions that make Rwanda feel like home.',
  },
  {
    id: 'story-pen',
    name: 'Storykeeper Writing Kit',
    category: 'Stories & learning',
    price: 24,
    image: penImage,
    description: 'Some of our most treasured stories live in the voices of the people around us. Make space to listen, write them down, and pass them on.',
    story: 'A thoughtful companion for preserving family memories, community wisdom, and the small moments that deserve to be remembered.',
  },
  {
    id: 'polo',
    name: 'Umuco Everyday Polo',
    category: 'Wear & share',
    price: 34,
    image: shirtImage,
    description: 'Wear your connection with pride. This comfortable polo brings contemporary style together with a celebration of Rwandan creativity.',
    story: 'Created for everyday journeys and shared moments, the Umuco polo is a simple way to carry your culture wherever you go.',
  },
];

const materials = [
  { id: 'sisal', name: 'Sisal & sweetgrass', type: 'Plant fibre', icon: Sprout, detail: 'Plan fibre for woven pieces, baskets, and durable craft products.' },
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

function readOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem('umuco_demo_orders') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function formatRwf(amount) {
  return `RWF ${Number(amount || 0).toLocaleString('en-RW')}`;
}

function SectionHeading({ eyebrow, title, description, aside }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">{eyebrow}</p>}
        <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {description && <p className="m-0 max-w-2xl text-sm leading-6 text-[#78665E]">{description}</p>}
      </div>
      {aside}
    </div>
  );
}

function ProductCard({ product, quantity, onAdd, onBuyNow, onViewDetails }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#EADBC8] bg-white shadow-[0_8px_28px_rgba(80,49,20,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(80,49,20,0.12)]">
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#F5EEE5] p-6 sm:h-72">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#874638]">{product.category}</span>
        {product.badge && <span className="absolute right-4 top-4 rounded-full bg-[#874638] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">{product.badge}</span>}
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="m-0 text-lg font-bold tracking-tight text-[#30221E]">{product.name}</h3>
          <span className="shrink-0 text-base font-bold text-[#874638]">${product.price}</span>
        </div>
        <p className="mb-5 min-h-[4.5rem] text-sm leading-6 text-[#78665E]">{product.description}</p>
        {quantity > 0 && (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-[#F8F5F0] p-2">
            <span className="pl-2 text-xs font-semibold text-[#6F5B55]">In your cart</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => onAdd(product.id, -1)} aria-label={`Remove one ${product.name}`} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#874638]"><Minus size={15} /></button>
              <span className="min-w-5 text-center text-sm font-bold">{quantity}</span>
              <button type="button" onClick={() => onAdd(product.id, 1)} aria-label={`Add one ${product.name}`} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#874638]"><Plus size={15} /></button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => onAdd(product.id, 1)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8D493A] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#71392E]">
            <Plus size={15} /> Add to cart
          </button>
          <button type="button" onClick={() => onViewDetails(product)} className="rounded-xl border border-[#DCC9B9] bg-white px-3 py-3 text-xs font-bold text-[#874638] transition hover:bg-[#F8F5F0]">View details</button>
        </div>
        <button type="button" onClick={() => onBuyNow(product)} className="mt-2 w-full rounded-xl border border-[#874638] px-3 py-2.5 text-xs font-bold text-[#874638] transition hover:bg-[#F8F1EB]">Buy now</button>
      </div>
    </article>
  );
}

export default function Dashboard({ onNavigate, onLogout }) {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('kits');
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState(readOrders);
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [businessForm, setBusinessForm] = useState(defaultBusinessForm);
  const [businessPlan, setBusinessPlan] = useState(null);
  const [notice, setNotice] = useState('');
  const [detailProduct, setDetailProduct] = useState(null);

  const cartCount = Object.values(cart).reduce((total, count) => total + count, 0);
  const cartTotal = useMemo(
    () => products.reduce((total, product) => total + product.price * (cart[product.id] || 0), 0),
    [cart],
  );
  const arrangedMaterials = materials.filter((material) => selectedMaterials[material.id] > 0);
  const arrangedUnitCount = arrangedMaterials.reduce((total, material) => total + selectedMaterials[material.id], 0);

  const goTo = (id) => {
    setActiveSection(id);
    document.getElementById(`dashboard-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateCart = (id, delta) => {
    setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) + delta) }));
    setNotice('');
  };

  const saveOrder = (items) => {
    const order = {
      id: `UM-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString(),
      items,
      total: items.reduce((total, item) => total + item.price * item.quantity, 0),
    };
    const nextOrders = [order, ...orders];
    localStorage.setItem('umuco_demo_orders', JSON.stringify(nextOrders));
    setOrders(nextOrders);
    setNotice(`Order ${order.id} saved as a demo. No payment was collected.`);
    goTo('orders');
  };

  const placeDemoOrder = () => {
    if (!cartCount) return;
    const items = products
      .filter((product) => cart[product.id] > 0)
      .map((product) => ({ name: product.name, quantity: cart[product.id], price: product.price }));
    setCart({});
    saveOrder(items);
  };

  const buyNow = (product) => {
    saveOrder([{ name: product.name, quantity: 1, price: product.price }]);
  };

  const updateMaterialPlan = (id, delta) => {
    setSelectedMaterials((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) + delta) }));
    setBusinessPlan(null);
  };

  const updateBusinessForm = (event) => {
    const { name, value } = event.target;
    setBusinessForm((current) => ({ ...current, [name]: value }));
    setBusinessPlan(null);
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
      generatedAt: new Date().toLocaleDateString(),
    });
  };

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] font-sans text-[#30221E]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#EADBC8] bg-[#FDFBF7] px-5 py-6 lg:flex">
        <button type="button" onClick={() => onNavigate?.('home')} className="mb-10 flex items-center gap-3 text-left">
          <TribalLogo aria-label="UmucoCore logo" role="img" style={{ width: 40, height: 40 }} />
          <span className="text-lg font-bold tracking-tight text-[#8D493A]">UmucoCore</span>
        </button>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#9A877D]">Explore Umuco</p>
        <nav className="space-y-1" aria-label="Dashboard sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => goTo(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${activeSection === id ? 'bg-[#F3E7DE] text-[#8D493A]' : 'text-[#6F5B55] hover:bg-[#F8F3ED]'}`}>
              <Icon size={18} /><span>{label}</span>
              {id === 'kits' && cartCount > 0 && <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px]">{cartCount}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#F5EEE5] p-4">
          <Sparkles size={18} className="mb-3 text-[#8D493A]" />
          <p className="mb-1 text-sm font-bold">Culture, carried forward.</p>
          <p className="mb-0 text-xs leading-5 text-[#78665E]">Discover keepsakes made to connect generations and spark new ideas.</p>
        </div>
        <button type="button" onClick={handleLogout} className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#78665E] hover:bg-[#F8F3ED]"><LogOut size={18} /> Log out</button>
      </aside>

      <main className="px-4 pb-24 pt-5 sm:px-7 lg:ml-64 lg:px-10 lg:pb-16 lg:pt-7">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:hidden">
            <TribalLogo aria-label="UmucoCore logo" role="img" style={{ width: 36, height: 36 }} />
            <b className="text-[#8D493A]">UmucoCore</b>
          </div>
          <button type="button" onClick={() => onNavigate?.('home')} className="hidden items-center gap-2 text-sm font-semibold text-[#8D493A] lg:flex"><ArrowLeft size={16} /> Back to home</button>
          <div className="ml-auto flex items-center gap-3">
            <button type="button" onClick={() => goTo('kits')} className="relative grid h-10 w-10 place-items-center rounded-full border border-[#EADBC8] bg-white text-[#8D493A]" aria-label={`Shopping cart, ${cartCount} items`}>
              <ShoppingBag size={18} />{cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#8D493A] px-1 text-[10px] font-bold text-white">{cartCount}</span>}
            </button>
            <div className="hidden text-right sm:block"><p className="m-0 text-xs text-[#9A877D]">Welcome back</p><p className="m-0 text-sm font-bold">{user?.name || 'Explorer'}</p></div>
            <button type="button" onClick={handleLogout} className="rounded-full border border-[#EADBC8] bg-white px-4 py-2 text-xs font-bold text-[#8D493A] lg:hidden">Log out</button>
          </div>
        </header>

        <div className="mx-auto mt-6 max-w-6xl space-y-16 sm:mt-8 sm:space-y-20">
          {notice && <div role="status" className="flex items-start gap-3 rounded-xl border border-[#BBD6BD] bg-[#EFF7EF] p-4 text-sm text-[#315D3A]"><Check size={18} className="mt-0.5 shrink-0" />{notice}</div>}

          <section id="dashboard-kits" className="scroll-mt-8">
            <div className="relative mb-8 overflow-hidden rounded-[2rem] bg-[#874638] px-6 py-9 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-16">
              <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full border border-white/10 sm:right-8 sm:top-[-9rem] sm:h-[28rem] sm:w-[28rem]" />
              <div className="pointer-events-none absolute -right-4 -top-12 h-56 w-56 rounded-full border border-white/10 sm:right-16 sm:top-[-7rem] sm:h-[22rem] sm:w-[22rem]" />
              <div className="relative max-w-2xl">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[.2em] text-[#F4D5C6]">UmucoCore · Made to mean something</p>
                <h1 className="mb-4 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">A piece of culture. A story of your own.</h1>
                <p className="mb-7 max-w-xl text-sm leading-7 text-white/80 sm:text-base">Discover thoughtful keepsakes inspired by Rwandan heritage, creative expression, and the stories that bring us closer.</p>
                <button type="button" onClick={() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex items-center gap-2 rounded-full bg-[#FDFBF7] px-5 py-3 text-sm font-bold text-[#874638] transition hover:bg-white">Explore the collection <ArrowRight size={16} /></button>
              </div>
            </div>

            <div className="mb-9 max-w-3xl">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">A collection with a heartbeat</p>
              <h2 className="mb-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">This is more than a product.</h2>
              <p className="m-0 text-sm leading-7 text-[#78665E] sm:text-base">Each kit represents Rwandan culture, creativity, and opportunity. Find something that speaks to you, gift a story to someone you love, or simply wear a reminder of the things worth carrying forward.</p>
            </div>

            <article className="mb-10 grid overflow-hidden rounded-[2rem] border border-[#EADBC8] bg-white shadow-[0_14px_44px_rgba(80,49,20,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative flex min-h-72 items-center justify-center bg-[#F5EEE5] p-8 sm:min-h-96 sm:p-12">
                <img src={products[0].image} alt={products[0].name} className="h-64 w-full object-contain sm:h-80" />
                <span className="absolute left-5 top-5 rounded-full bg-[#874638] px-4 py-2 text-[10px] font-bold uppercase tracking-[.15em] text-white">Featured · Popular</span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">A favourite from the collection</p>
                <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">{products[0].name}</h2>
                <p className="mb-5 text-sm leading-7 text-[#78665E]">{products[0].story}</p>
                <div className="mb-6 flex items-center gap-3"><span className="text-2xl font-bold text-[#874638]">${products[0].price}</span><span className="rounded-full bg-[#F8F5F0] px-3 py-1 text-[10px] font-semibold text-[#78665E]">{products[0].category}</span></div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => updateCart(products[0].id, 1)} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#71392E]"><Plus size={16} /> Add to cart</button>
                  <button type="button" onClick={() => buyNow(products[0])} className="rounded-xl border border-[#874638] px-5 py-3 text-sm font-bold text-[#874638] transition hover:bg-[#F8F1EB]">Buy now</button>
                  <button type="button" onClick={() => setDetailProduct(products[0])} className="rounded-xl px-4 py-3 text-sm font-bold text-[#78665E] underline decoration-[#DCC9B9] underline-offset-4">Our story</button>
                </div>
              </div>
            </article>

            <div id="product-grid" className="scroll-mt-8">
              <SectionHeading eyebrow="The Umuco collection" title="Find your piece" description="Small-batch treasures and story-led gifts, chosen to celebrate the culture we share." aside={<span className="text-xs font-medium text-[#78665E]">{products.length} pieces to discover</span>} />
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => <ProductCard key={product.id} product={product} quantity={cart[product.id] || 0} onAdd={updateCart} onBuyNow={buyNow} onViewDetails={setDetailProduct} />)}
              </div>
            </div>

            {cartCount > 0 && (
              <div className="mt-7 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#EADBC8] bg-white p-5 sm:p-7">
                <div><p className="mb-1 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Your cart · {cartCount} {cartCount === 1 ? 'item' : 'items'}</p><h3 className="m-0 text-xl font-bold">Cart total <span className="text-[#874638]">${cartTotal.toFixed(2)}</span></h3></div>
                <button type="button" onClick={placeDemoOrder} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white hover:bg-[#71392E]">Continue to demo checkout <ArrowRight size={16} /></button>
                <p className="m-0 w-full text-xs text-[#78665E]">Checkout saves an order in this browser. Payment and delivery are not connected.</p>
              </div>
            )}
          </section>

          <section id="dashboard-materials" className="scroll-mt-8 border-t border-[#E7D9CA] pt-12 sm:pt-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#EAF0E6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#476344]"><Leaf size={13} /> Optional planning tool</div>
            <SectionHeading eyebrow="Explore a making process" title="Materials planning" description="Curious about what goes into making things? Explore materials and quantities at your own pace." aside={<span className="rounded-full bg-[#F3E7DE] px-3 py-1.5 text-xs font-semibold text-[#874638]">{arrangedUnitCount} planned units</span>} />
            <div className="mb-5 rounded-2xl border border-[#D8E3D2] bg-[#F2F6EF] p-4 text-sm leading-6 text-[#52684D]"><strong>This does NOT affect your purchase.</strong> Your material selections are just for planning and will never change your cart or kit orders.</div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {materials.map((material) => {
                const Icon = material.icon;
                const quantity = selectedMaterials[material.id] || 0;
                return (
                  <article key={material.id} className={`rounded-2xl border bg-white p-5 transition ${quantity > 0 ? 'border-[#A97561] shadow-sm' : 'border-[#EADBC8]'}`}>
                    <div className="mb-4 flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F5EEE5] text-[#8D493A]"><Icon size={20} /></span><span className="rounded-full bg-[#F8F5F0] px-3 py-1 text-[10px] font-bold text-[#78665E]">{material.type}</span></div>
                    <h3 className="mb-2 text-base font-bold">{material.name}</h3><p className="mb-5 min-h-10 text-xs leading-5 text-[#78665E]">{material.detail}</p>
                    <div className="flex items-center justify-between rounded-xl bg-[#F8F5F0] p-2"><span className="pl-2 text-xs font-semibold text-[#6F5B55]">Planning units</span><div className="flex items-center gap-3"><button type="button" onClick={() => updateMaterialPlan(material.id, -1)} disabled={quantity === 0} aria-label={`Remove ${material.name}`} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#874638] disabled:opacity-40"><Minus size={15} /></button><span className="min-w-5 text-center text-sm font-bold">{quantity}</span><button type="button" onClick={() => updateMaterialPlan(material.id, 1)} aria-label={`Add ${material.name}`} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#874638]"><Plus size={15} /></button></div></div>
                  </article>
                );
              })}
            </div>
            <div className="mt-5 rounded-2xl bg-[#F5EEE5] p-5 sm:p-6"><h3 className="mb-1 text-sm font-bold">Your materials notes</h3><p className="m-0 text-xs leading-5 text-[#78665E]">{arrangedMaterials.length ? arrangedMaterials.map((material) => `${material.name} × ${selectedMaterials[material.id]}`).join(' · ') : 'Add materials here if you want to explore a making idea. You can skip this section entirely.'}</p></div>
          </section>

          <section id="dashboard-business" className="scroll-mt-8 border-t border-[#E7D9CA] pt-12 sm:pt-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#F3E7DE] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#874638]"><Sparkles size={13} /> Create something of your own</div>
            <SectionHeading eyebrow="Separate from shopping" title="Business idea generator" description="Shape a first idea for a small cultural business. Use the materials notes if helpful, or start with your idea alone." />
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#EADBC8] bg-white p-4 text-xs leading-5 text-[#78665E]"><BriefcaseBusiness size={17} className="mt-0.5 shrink-0 text-[#8D493A]" /><p className="m-0"><strong className="text-[#30221E]">This is an idea generation tool.</strong> It is independent of the shop and creates a starter outline in this browser. No purchase is required. For future AI analysis, keep API keys on the backend.</p></div>
            <form onSubmit={generateBusinessPlan} className="grid gap-4 rounded-2xl border border-[#EADBC8] bg-white p-5 sm:grid-cols-2 sm:p-7">
              <label className="text-xs font-bold text-[#6F5B55]">Business idea<select name="idea" value={businessForm.idea} onChange={updateBusinessForm} className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]"><option>Cultural craft shop</option><option>Community weaving cooperative</option><option>Natural materials workshop</option><option>Heritage tourism experience</option><option>Local apparel brand</option></select></label>
              <label className="text-xs font-bold text-[#6F5B55]">District or town<input name="location" value={businessForm.location} onChange={updateBusinessForm} required className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]" placeholder="e.g. Kigali" /></label>
              <label className="text-xs font-bold text-[#6F5B55]">Starting budget (RWF)<input name="budget" type="number" min="0" value={businessForm.budget} onChange={updateBusinessForm} required className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]" /></label>
              <label className="text-xs font-bold text-[#6F5B55]">Who do you want to serve?<input name="customer" value={businessForm.customer} onChange={updateBusinessForm} className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]" placeholder="e.g. local families and visitors" /></label>
              <label className="text-xs font-bold text-[#6F5B55] sm:col-span-2">What would you like the business to achieve?<textarea name="goal" value={businessForm.goal} onChange={updateBusinessForm} rows="3" className="mt-2 w-full resize-y rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]" placeholder="Describe the first thing you want to make, sell, or improve." /></label>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2"><p className="m-0 text-xs text-[#78665E]">{arrangedMaterials.length ? `${arrangedMaterials.length} material types can be included.` : 'Materials are optional. You can generate an idea without them.'}</p><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#71392E]"><FileText size={16} /> Generate starter idea</button></div>
            </form>

            {businessPlan && <article className="mt-5 rounded-2xl border border-[#EADBC8] bg-[#F5EEE5] p-5 sm:p-7"><div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Starter idea · local preview</p><h3 className="m-0 text-xl font-bold">{businessPlan.idea} · {businessPlan.location}</h3></div><span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-[#78665E]">Created {businessPlan.generatedAt}</span></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-white p-4"><p className="mb-1 text-xs font-bold text-[#874638]">Concept</p><p className="m-0 text-sm leading-6 text-[#6F5B55]">Build a {businessPlan.idea.toLowerCase()} in {businessPlan.location}, using local skills to create useful cultural products.</p></div><div className="rounded-xl bg-white p-4"><p className="mb-1 text-xs font-bold text-[#874638]">Starting budget</p><p className="m-0 text-sm leading-6 text-[#6F5B55]">{formatRwf(businessPlan.budget)}. Start with a small pilot, track material and production costs, and adjust before increasing output.</p></div>{businessPlan.materials.length > 0 && <div className="rounded-xl bg-white p-4"><p className="mb-1 text-xs font-bold text-[#874638]">Materials notes</p><ul className="m-0 space-y-1 pl-4 text-sm leading-6 text-[#6F5B55]">{businessPlan.materials.map((material) => <li key={material.name}>{material.name} · {material.quantity} planning units</li>)}</ul></div>}<div className="rounded-xl bg-white p-4"><p className="mb-1 text-xs font-bold text-[#874638]">First steps</p><p className="m-0 text-sm leading-6 text-[#6F5B55]">Talk with {businessPlan.customer || 'potential customers'}, learn what people value in {businessPlan.location}, then test a small first offer.</p>{businessPlan.goal && <p className="mb-0 mt-3 border-t border-[#F0E7DE] pt-3 text-sm leading-6 text-[#6F5B55]"><strong className="text-[#30221E]">Your goal:</strong> {businessPlan.goal}</p>}</div></div></article>}
          </section>

          <section id="dashboard-orders" className="scroll-mt-8 border-t border-[#E7D9CA] pt-12 sm:pt-16">
            <SectionHeading eyebrow="Your purchases" title="My orders" description="Your saved demo orders appear here. They are separate from material planning and business ideas." />
            {orders.length ? <div className="space-y-3">{orders.map((order) => <article key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EADBC8] bg-white p-5"><div><p className="mb-1 text-xs font-bold text-[#874638]">{order.id} · Demo order</p><p className="mb-1 text-sm font-semibold">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p><p className="m-0 text-xs text-[#78665E]">{order.date}</p></div><strong className="text-[#874638]">${Number(order.total).toFixed(2)}</strong></article>)}</div> : <div className="rounded-2xl border border-dashed border-[#DCC9B9] bg-white/60 p-7 text-center"><ShoppingBag className="mx-auto mb-3 text-[#A97561]" size={23} /><p className="mb-1 text-sm font-bold">Your story starts here</p><p className="m-0 text-xs text-[#78665E]">There are no demo orders yet. Explore the collection whenever you’re ready.</p></div>}
          </section>
        </div>
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border border-[#EADBC8] bg-[#FDFBF7]/95 p-2 shadow-lg backdrop-blur lg:hidden" aria-label="Dashboard sections">
        {sections.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => goTo(id)} className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] font-bold ${activeSection === id ? 'text-[#8D493A]' : 'text-[#78665E]'}`}><Icon size={17} />{label}</button>)}
      </nav>

      {detailProduct && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#241815]/60 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailProduct(null); }}><article role="dialog" aria-modal="true" aria-labelledby="product-detail-title" className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-[#FDFBF7] shadow-2xl sm:grid-cols-2"><button type="button" onClick={() => setDetailProduct(null)} aria-label="Close product details" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-[#874638] shadow"><X size={18} /></button><div className="flex min-h-64 items-center justify-center bg-[#F5EEE5] p-8"><img src={detailProduct.image} alt={detailProduct.name} className="h-56 w-full object-contain" /></div><div className="flex flex-col justify-center p-6 sm:p-8"><span className="mb-3 w-fit rounded-full bg-[#F3E7DE] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#874638]">{detailProduct.category}</span><h2 id="product-detail-title" className="mb-3 text-2xl font-bold">{detailProduct.name}</h2><p className="mb-4 text-sm leading-7 text-[#78665E]">{detailProduct.story}</p><strong className="mb-5 text-xl text-[#874638]">${detailProduct.price}</strong><button type="button" onClick={() => { updateCart(detailProduct.id, 1); setDetailProduct(null); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white hover:bg-[#71392E]"><Plus size={16} /> Add to cart</button></div></article></div>}
    </div>
  );
}
