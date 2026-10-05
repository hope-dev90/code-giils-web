import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ClipboardList,
  FileText,
  Leaf,
  LogOut,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Sprout,
  Trees,
  Waves,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import TribalLogo from '../../assets/Logo';
import braceletImage from '../../assets/bracelet.png';
import penImage from '../../assets/pen.png';
import shirtImage from '../../assets/t-shirt.png';

const kits = [
  {
    id: 'bracelet',
    name: 'Umuco Bracelet Kit',
    category: 'Wear & share',
    price: 28,
    image: braceletImage,
    description: 'A branded bracelet paired with a short prompt to explore and share Rwandan heritage.',
  },
  {
    id: 'story-pen',
    name: 'Storykeeper Writing Kit',
    category: 'Stories & learning',
    price: 24,
    image: penImage,
    description: 'A branded Umuco pen and a simple activity for recording stories from your community.',
  },
  {
    id: 'polo',
    name: 'Umuco Polo Kit',
    category: 'Wear & share',
    price: 34,
    image: shirtImage,
    description: 'A branded polo with a guide to the ideas behind the UmucoCore collection.',
  },
];

const materials = [
  {
    id: 'sisal',
    name: 'Sisal & sweetgrass',
    type: 'Plant fibre',
    icon: Sprout,
    detail: 'Plan fibre for woven pieces, baskets, and durable craft products.',
  },
  {
    id: 'natural-dyes',
    name: 'Natural pigments',
    type: 'Colour & finish',
    icon: Leaf,
    detail: 'Consider colour, safe handling, and a consistent finish for each product.',
  },
  {
    id: 'cotton',
    name: 'Cotton fabric',
    type: 'Textile',
    icon: Trees,
    detail: 'Estimate fabric for apparel or soft goods, including cutting waste.',
  },
  {
    id: 'paper',
    name: 'Paper & packaging',
    type: 'Presentation',
    icon: ClipboardList,
    detail: 'Plan story cards, labels, and recyclable packaging for finished kits.',
  },
  {
    id: 'water',
    name: 'Water & finishing',
    type: 'Workshop needs',
    icon: Waves,
    detail: 'Account for water and other basic needs when arranging workshop work.',
  },
];

const sections = [
  { id: 'kits', label: 'Sanctuary kits', icon: Package, step: '01' },
  { id: 'materials', label: 'Arrange materials', icon: Leaf, step: '02' },
  { id: 'business', label: 'Business plan', icon: BriefcaseBusiness, step: '03' },
  { id: 'orders', label: 'My orders', icon: ShoppingBag },
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

export default function Dashboard({ onNavigate, onLogout }) {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('kits');
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState(readOrders);
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [businessForm, setBusinessForm] = useState(defaultBusinessForm);
  const [businessPlan, setBusinessPlan] = useState(null);
  const [notice, setNotice] = useState('');

  const cartCount = Object.values(cart).reduce((total, count) => total + count, 0);
  const cartTotal = useMemo(
    () => kits.reduce((total, kit) => total + kit.price * (cart[kit.id] || 0), 0),
    [cart],
  );
  const arrangedMaterials = materials.filter((material) => selectedMaterials[material.id] > 0);
  const arrangedUnitCount = arrangedMaterials.reduce(
    (total, material) => total + selectedMaterials[material.id],
    0,
  );

  const goTo = (id) => {
    setActiveSection(id);
    document.getElementById(`dashboard-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateCart = (id, delta) => {
    setCart((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] || 0) + delta),
    }));
    setNotice('');
  };

  const updateMaterialPlan = (id, delta) => {
    setSelectedMaterials((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] || 0) + delta),
    }));
    setBusinessPlan(null);
  };

  const updateBusinessForm = (event) => {
    const { name, value } = event.target;
    setBusinessForm((current) => ({ ...current, [name]: value }));
    setBusinessPlan(null);
  };

  const placeDemoOrder = () => {
    if (!cartCount) return;
    const order = {
      id: `UM-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString(),
      items: kits
        .filter((kit) => cart[kit.id] > 0)
        .map((kit) => ({ name: kit.name, quantity: cart[kit.id] })),
      total: cartTotal,
    };
    const nextOrders = [order, ...orders];
    localStorage.setItem('umuco_demo_orders', JSON.stringify(nextOrders));
    setOrders(nextOrders);
    setCart({});
    setNotice(`Order ${order.id} saved as a demo. No payment was collected.`);
    goTo('orders');
  };

  const generateBusinessPlan = (event) => {
    event.preventDefault();
    const inputs = arrangedMaterials.map((material) => ({
      name: material.name,
      quantity: selectedMaterials[material.id],
      type: material.type,
    }));
    setBusinessPlan({
      ...businessForm,
      materials: inputs,
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
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#9A877D]">Your workspace</p>
        <nav className="space-y-1" aria-label="Dashboard sections">
          {sections.map(({ id, label, icon: Icon, step }) => (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${activeSection === id ? 'bg-[#F3E7DE] text-[#8D493A]' : 'text-[#6F5B55] hover:bg-[#F8F3ED]'}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {step && <span className="ml-auto text-[10px] font-bold text-[#A97561]">{step}</span>}
              {id === 'kits' && cartCount > 0 && <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px]">{cartCount}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#F5EEE5] p-4">
          <Sparkles size={18} className="mb-3 text-[#8D493A]" />
          <p className="mb-1 text-sm font-bold">Culture lives when shared.</p>
          <p className="mb-0 text-xs leading-5 text-[#78665E]">Explore a kit, plan the materials, and shape an idea into a business.</p>
        </div>
        <button type="button" onClick={handleLogout} className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#78665E] hover:bg-[#F8F3ED]">
          <LogOut size={18} /> Log out
        </button>
      </aside>

      <main className="px-4 pb-24 pt-6 sm:px-7 lg:ml-64 lg:px-10 lg:pb-16 lg:pt-8">
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
              onClick={() => goTo('kits')}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[#EADBC8] bg-white text-[#8D493A]"
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#8D493A] px-1 text-[10px] font-bold text-white">{cartCount}</span>}
            </button>
            <div className="hidden text-right sm:block">
              <p className="m-0 text-xs text-[#9A877D]">Signed in as</p>
              <p className="m-0 text-sm font-bold">{user?.name || 'Explorer'}</p>
            </div>
            <button type="button" onClick={handleLogout} className="rounded-full border border-[#EADBC8] bg-white px-4 py-2 text-xs font-bold text-[#8D493A] lg:hidden">Log out</button>
          </div>
        </header>

        <div className="mx-auto mt-7 max-w-6xl space-y-12">
          <section className="overflow-hidden rounded-3xl bg-[#874638] px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#F4D5C6]">Your Umuco workspace</p>
              <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-5xl">Welcome{user?.name ? `, ${user.name}` : ' back'}.</h1>
              <p className="mb-7 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                Explore cultural kits, organize the materials behind an idea, then turn your plan into a practical first draft.
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {sections.filter((section) => section.step).map(({ id, step, label }, index) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => goTo(id)}
                    className="flex min-h-16 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 text-left transition hover:bg-white/15"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FDFBF7] text-xs font-extrabold text-[#874638]">{step}</span>
                    <span className="text-sm font-semibold">{label}</span>
                    {index < 2 && <ArrowRight className="ml-auto hidden text-white/60 sm:block" size={15} />}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {notice && (
            <div role="status" className="flex items-start gap-3 rounded-xl border border-[#BBD6BD] bg-[#EFF7EF] p-4 text-sm text-[#315D3A]">
              <Check size={18} className="mt-0.5 shrink-0" />{notice}
            </div>
          )}

          <section id="dashboard-kits" className="scroll-mt-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Step 01 · Explore & select</p>
                <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Sanctuary kits</h2>
                <p className="m-0 max-w-2xl text-sm leading-6 text-[#78665E]">Browse the collection and add the kits you want to your separate demo order.</p>
              </div>
              <span className="text-xs text-[#78665E]">Curated collection · USD</span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {kits.map((kit) => (
                <article key={kit.id} className="overflow-hidden rounded-2xl border border-[#EADBC8] bg-white shadow-sm">
                  <div className="relative flex h-52 items-center justify-center bg-[#F5EEE5] p-4">
                    <img src={kit.image} alt={kit.name} className="h-full w-full object-contain" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-[#874638]">{kit.category}</span>
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="m-0 text-base font-bold">{kit.name}</h3>
                      <b className="shrink-0 text-sm text-[#874638]">${kit.price}</b>
                    </div>
                    <p className="mb-5 min-h-10 text-xs leading-5 text-[#78665E]">{kit.description}</p>
                    {(cart[kit.id] || 0) === 0 ? (
                      <button type="button" onClick={() => updateCart(kit.id, 1)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8D493A] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#71392E]">
                        <Plus size={15} /> Add to order
                      </button>
                    ) : (
                      <div className="flex items-center justify-between rounded-xl bg-[#F5EEE5] p-2">
                        <button type="button" onClick={() => updateCart(kit.id, -1)} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#874638]" aria-label={`Remove one ${kit.name}`}><Minus size={15} /></button>
                        <span className="text-xs font-bold">{cart[kit.id]} in your order</span>
                        <button type="button" onClick={() => updateCart(kit.id, 1)} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#874638]" aria-label={`Add one ${kit.name}`}><Plus size={15} /></button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {cartCount > 0 && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#EADBC8] bg-white p-5 sm:p-7">
                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Your kit order · {cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
                  <h3 className="m-0 text-xl font-bold">Order total <span className="text-[#874638]">${cartTotal.toFixed(2)}</span></h3>
                </div>
                <button type="button" onClick={placeDemoOrder} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white hover:bg-[#71392E]">
                  Place demo order <ArrowRight size={16} />
                </button>
                <p className="m-0 w-full text-xs text-[#78665E]">Demo checkout saves the order in this browser. Payment and delivery are not connected.</p>
              </div>
            )}
          </section>

          <section id="dashboard-materials" className="scroll-mt-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Step 02 · Plan your inputs</p>
                <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Arrange raw materials</h2>
                <p className="m-0 max-w-2xl text-sm leading-6 text-[#78665E]">Select the materials your idea may need and set planning quantities. This list is separate from the kit order and does not place a purchase.</p>
              </div>
              <span className="rounded-full bg-[#F3E7DE] px-3 py-1.5 text-xs font-semibold text-[#874638]">{arrangedUnitCount} planned units</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {materials.map((material) => {
                const Icon = material.icon;
                const quantity = selectedMaterials[material.id] || 0;
                return (
                  <article key={material.id} className={`rounded-2xl border bg-white p-5 transition ${quantity > 0 ? 'border-[#A97561] shadow-sm' : 'border-[#EADBC8]'}`}>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F5EEE5] text-[#8D493A]"><Icon size={20} /></span>
                      <span className="rounded-full bg-[#F8F5F0] px-3 py-1 text-[10px] font-bold text-[#78665E]">{material.type}</span>
                    </div>
                    <h3 className="mb-2 text-base font-bold">{material.name}</h3>
                    <p className="mb-5 min-h-10 text-xs leading-5 text-[#78665E]">{material.detail}</p>
                    <div className="flex items-center justify-between rounded-xl bg-[#F8F5F0] p-2">
                      <span className="pl-2 text-xs font-semibold text-[#6F5B55]">Planning units</span>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => updateMaterialPlan(material.id, -1)} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#874638] disabled:cursor-not-allowed disabled:opacity-40" disabled={quantity === 0} aria-label={`Remove ${material.name}`}><Minus size={15} /></button>
                        <span className="min-w-5 text-center text-sm font-bold">{quantity}</span>
                        <button type="button" onClick={() => updateMaterialPlan(material.id, 1)} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#874638]" aria-label={`Add ${material.name}`}><Plus size={15} /></button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#F5EEE5] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Leaf size={19} className="mt-0.5 shrink-0 text-[#8D493A]" />
                <div>
                  <h3 className="mb-1 text-sm font-bold">Material plan summary</h3>
                  <p className="m-0 text-xs leading-5 text-[#78665E]">
                    {arrangedMaterials.length
                      ? arrangedMaterials.map((material) => `${material.name} × ${selectedMaterials[material.id]}`).join(' · ')
                      : 'Choose materials to create a planning summary for your business plan.'}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => goTo('business')} className="inline-flex items-center gap-2 rounded-full bg-[#8D493A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#71392E]">
                Continue to business plan <ArrowRight size={14} />
              </button>
            </div>
          </section>

          <section id="dashboard-business" className="scroll-mt-8">
            <div className="mb-6 max-w-3xl">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Step 03 · Turn inputs into a plan</p>
              <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Business plan studio</h2>
              <p className="m-0 text-sm leading-6 text-[#78665E]">Describe your idea and combine it with your material plan to create a practical starting outline. This tool is independent of kit purchases.</p>
            </div>

            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#EADBC8] bg-white p-4 text-xs leading-5 text-[#78665E]">
              <Sparkles size={17} className="mt-0.5 shrink-0 text-[#8D493A]" />
              <p className="m-0"><strong className="text-[#30221E]">Local preview for now.</strong> The form makes a starter outline in this browser. When AI analysis is added, keep its API key on the backend, never in this frontend.</p>
            </div>

            <form onSubmit={generateBusinessPlan} className="grid gap-4 rounded-2xl border border-[#EADBC8] bg-white p-5 sm:grid-cols-2 sm:p-7">
              <label className="text-xs font-bold text-[#6F5B55]">
                Business idea
                <select name="idea" value={businessForm.idea} onChange={updateBusinessForm} className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]">
                  <option>Cultural craft shop</option>
                  <option>Community weaving cooperative</option>
                  <option>Natural materials workshop</option>
                  <option>Heritage tourism experience</option>
                  <option>Local apparel brand</option>
                </select>
              </label>
              <label className="text-xs font-bold text-[#6F5B55]">
                District or town
                <input name="location" value={businessForm.location} onChange={updateBusinessForm} required className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]" placeholder="e.g. Kigali" />
              </label>
              <label className="text-xs font-bold text-[#6F5B55]">
                Starting budget (RWF)
                <input name="budget" type="number" min="0" value={businessForm.budget} onChange={updateBusinessForm} required className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]" />
              </label>
              <label className="text-xs font-bold text-[#6F5B55]">
                Who do you want to serve?
                <input name="customer" value={businessForm.customer} onChange={updateBusinessForm} className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]" placeholder="e.g. local families and visitors" />
              </label>
              <label className="text-xs font-bold text-[#6F5B55] sm:col-span-2">
                What would you like the business to achieve?
                <textarea name="goal" value={businessForm.goal} onChange={updateBusinessForm} rows="3" className="mt-2 w-full resize-y rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]" placeholder="Describe the first thing you want to make, sell, or improve." />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
                <p className="m-0 text-xs text-[#78665E]">{arrangedMaterials.length ? `${arrangedMaterials.length} material types will be included.` : 'Arrange materials first to include them in the draft.'}</p>
                <button type="submit" disabled={!arrangedMaterials.length} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#71392E] disabled:cursor-not-allowed disabled:opacity-45">
                  <FileText size={16} /> Generate starter plan
                </button>
              </div>
            </form>

            {businessPlan && (
              <article className="mt-5 rounded-2xl border border-[#EADBC8] bg-[#F5EEE5] p-5 sm:p-7">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Starter plan · local preview</p>
                    <h3 className="m-0 text-xl font-bold">{businessPlan.idea} · {businessPlan.location}</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-[#78665E]">Created {businessPlan.generatedAt}</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">Concept</p>
                    <p className="m-0 text-sm leading-6 text-[#6F5B55]">Build a {businessPlan.idea.toLowerCase()} in {businessPlan.location}, using local skills and the materials you selected to create useful cultural products.</p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">Starting budget</p>
                    <p className="m-0 text-sm leading-6 text-[#6F5B55]">{formatRwf(businessPlan.budget)}. Start with a small pilot, track material and production costs, and adjust before increasing output.</p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">Material arrangement</p>
                    <ul className="m-0 space-y-1 pl-4 text-sm leading-6 text-[#6F5B55]">
                      {businessPlan.materials.map((material) => <li key={material.name}>{material.name} · {material.quantity} planning units</li>)}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">First steps</p>
                    <p className="m-0 text-sm leading-6 text-[#6F5B55]">Talk with {businessPlan.customer || 'potential customers'}, confirm material availability in {businessPlan.location}, then make and price a small first batch.</p>
                    {businessPlan.goal && <p className="mb-0 mt-3 border-t border-[#F0E7DE] pt-3 text-sm leading-6 text-[#6F5B55]"><strong className="text-[#30221E]">Your goal:</strong> {businessPlan.goal}</p>}
                  </div>
                </div>
              </article>
            )}
          </section>

          <section id="dashboard-orders" className="scroll-mt-8">
            <div className="mb-5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Sanctuary kit orders</p>
              <h2 className="m-0 text-2xl font-bold tracking-tight">My orders</h2>
            </div>
            {orders.length ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <article key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EADBC8] bg-white p-5">
                    <div>
                      <p className="mb-1 text-xs font-bold text-[#874638]">{order.id} · Demo order</p>
                      <p className="mb-1 text-sm font-semibold">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p>
                      <p className="m-0 text-xs text-[#78665E]">{order.date}</p>
                    </div>
                    <strong className="text-[#874638]">${Number(order.total).toFixed(2)}</strong>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#DCC9B9] bg-white/60 p-7 text-center">
                <ShoppingBag className="mx-auto mb-3 text-[#A97561]" size={23} />
                <p className="mb-1 text-sm font-bold">No kit orders yet</p>
                <p className="m-0 text-xs text-[#78665E]">Your demo kit orders will appear here. Business plans are managed separately.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border border-[#EADBC8] bg-[#FDFBF7]/95 p-2 shadow-lg backdrop-blur lg:hidden" aria-label="Dashboard sections">
        {sections.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => goTo(id)} className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] font-bold ${activeSection === id ? 'text-[#8D493A]' : 'text-[#78665E]'}`}>
            <Icon size={17} />{label}
          </button>
        ))}
      </nav>
    </div>
  );
}
