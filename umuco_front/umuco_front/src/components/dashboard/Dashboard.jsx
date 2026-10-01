import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, FileText, Gem, Leaf, LogOut, Minus, Package, Plus, ShoppingBag, Sparkles, Sprout, Trees, Waves } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import imigongoImage from '../../assets/imigongo.jpg';
import intoreImage from '../../assets/intore.jpg';
import inangaImage from '../../assets/inanga.jpg';
import oralImage from '../../assets/oral.jpg';
import bookImage from '../../assets/book.jpg';
import rwandaImage from '../../assets/rwanda.jpg';

const kits = [
  { id: 'imigongo', name: 'Imigongo Art Kit', type: 'Art & craft', price: 28, image: imigongoImage, description: 'Explore Rwanda’s geometric art tradition with a pattern guide and a small practice set.' },
  { id: 'intore', name: 'Intore Rhythm Kit', type: 'Music & movement', price: 34, image: intoreImage, description: 'Discover the stories, movement and ceremonial rhythm of Intore performance.' },
  { id: 'inanga', name: 'Inanga Sound Kit', type: 'Music & movement', price: 32, image: inangaImage, description: 'Listen closely to the inanga and learn about Rwanda’s musical storytelling.' },
  { id: 'oral', name: 'Oral Stories Kit', type: 'Stories & history', price: 24, image: oralImage, description: 'A guided collection for listening to oral histories and sharing stories across generations.' },
  { id: 'language', name: 'Kinyarwanda Learning Kit', type: 'Language', price: 19, image: bookImage, description: 'Start with useful words, pronunciation prompts and everyday cultural context.' },
  { id: 'heritage', name: 'Rwanda Heritage Explorer', type: 'Stories & history', price: 39, image: rwandaImage, description: 'A broad introduction to places, traditions and people across Rwanda’s heritage.' },
];

const resources = [
  { name: 'Land & soil', icon: Sprout, detail: 'Healthy land supports food, livelihoods and the materials used in local craft.' },
  { name: 'Forests & plants', icon: Trees, detail: 'Responsible stewardship protects habitats and the plant knowledge communities carry.' },
  { name: 'Water & lakes', icon: Waves, detail: 'Freshwater sustains households, farms and the rich ecosystems around Rwanda’s lakes.' },
  { name: 'Minerals & materials', icon: Gem, detail: 'Trace materials from source to maker, with care for people and the environment.' },
];

const sections = [
  { id: 'kits', label: 'Sanctuary kit purchase', icon: Package },
  { id: 'resources', label: 'Natural resources', icon: Leaf },
  { id: 'business', label: 'Business plan generation', icon: BriefcaseBusiness },
  { id: 'orders', label: 'My orders', icon: ShoppingBag },
];

export default function Dashboard({ onNavigate, onLogout }) {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('kits');
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('umuco_demo_orders') || '[]'); } catch { return []; }
  });
  const [notice, setNotice] = useState('');
  const [businessForm, setBusinessForm] = useState({ idea: 'Cultural craft shop', location: 'Kigali', budget: '500000' });
  const [businessPlan, setBusinessPlan] = useState(null);
  const cartCount = Object.values(cart).reduce((total, count) => total + count, 0);
  const cartTotal = useMemo(() => kits.reduce((total, kit) => total + kit.price * (cart[kit.id] || 0), 0), [cart]);

  const goTo = (id) => {
    setActiveSection(id);
    document.getElementById(`dashboard-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateCart = (id, delta) => {
    setCart((current) => {
      const nextCount = Math.max(0, (current[id] || 0) + delta);
      return { ...current, [id]: nextCount };
    });
    setNotice('');
  };

  const placeOrder = () => {
    if (!cartCount) return;
    const order = {
      id: `UM-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString(),
      items: kits.filter((kit) => cart[kit.id]).map((kit) => ({ name: kit.name, quantity: cart[kit.id] })),
      total: cartTotal,
    };
    const nextOrders = [order, ...orders];
    localStorage.setItem('umuco_demo_orders', JSON.stringify(nextOrders));
    setOrders(nextOrders);
    setCart({});
    setNotice(`Order ${order.id} confirmed. This demo records your order locally; no payment was collected.`);
    setActiveSection('orders');
    setTimeout(() => document.getElementById('dashboard-orders')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] font-sans text-[#30221E]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#EADBC8] bg-[#FDFBF7] px-5 py-6 lg:flex">
        <button type="button" onClick={() => onNavigate?.('home')} className="mb-10 flex items-center gap-3 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#8D493A] text-xl text-[#8D493A]">✳</span>
          <span className="text-lg font-bold tracking-tight text-[#8D493A]">UmucoCore</span>
        </button>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#9A877D]">Your workspace</p>
        <nav className="space-y-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => goTo(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${activeSection === id ? 'bg-[#F3E7DE] text-[#8D493A]' : 'text-[#6F5B55] hover:bg-[#F8F3ED]'}`}>
              <Icon size={18} />{label}{id === 'kits' && <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px]">{kits.length}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#F5EEE5] p-4">
          <Sparkles size={18} className="mb-3 text-[#8D493A]" />
          <p className="mb-1 text-sm font-bold">Culture lives when shared.</p>
          <p className="mb-0 text-xs leading-5 text-[#78665E]">Explore a kit and discover the story behind it.</p>
        </div>
        <button type="button" onClick={handleLogout} className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#78665E] hover:bg-[#F8F3ED]"><LogOut size={18} /> Log out</button>
      </aside>

      <main className="px-4 pb-16 pt-6 sm:px-7 lg:ml-64 lg:px-10 lg:pt-8">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:hidden"><span className="grid h-9 w-9 place-items-center rounded-full border border-[#8D493A] text-lg text-[#8D493A]">✳</span><b className="text-[#8D493A]">UmucoCore</b></div>
          <button type="button" onClick={() => onNavigate?.('home')} className="hidden items-center gap-2 text-sm font-semibold text-[#8D493A] lg:flex"><ArrowLeft size={16} /> Back to home</button>
          <div className="ml-auto flex items-center gap-3">
            <button type="button" onClick={() => goTo('kits')} className="relative grid h-10 w-10 place-items-center rounded-full border border-[#EADBC8] bg-white text-[#8D493A]" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={18} />{cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#8D493A] px-1 text-[10px] font-bold text-white">{cartCount}</span>}</button>
            <div className="hidden text-right sm:block"><p className="m-0 text-xs text-[#9A877D]">Signed in as</p><p className="m-0 text-sm font-bold">{user?.name || 'Explorer'}</p></div>
            <button type="button" onClick={handleLogout} className="rounded-full border border-[#EADBC8] bg-white px-4 py-2 text-xs font-bold text-[#8D493A] lg:hidden">Log out</button>
          </div>
        </header>

        <div className="mx-auto mt-8 max-w-6xl space-y-12">
          <section id="dashboard-overview" className="scroll-mt-8 rounded-3xl bg-[#874638] px-6 py-8 text-white sm:px-10 sm:py-11">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#F4D5C6]">Your Umuco dashboard</p>
              <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">Welcome{user?.name ? `, ${user.name}` : ' back'}.</h1>
              <p className="mb-7 max-w-xl text-sm leading-6 text-white/80 sm:text-base">Explore three ways to turn Rwanda’s heritage into opportunity: purchase a sanctuary kit, learn how natural resources become crafts, or generate a starter business plan.</p>
              <button type="button" onClick={() => goTo('kits')} className="inline-flex items-center gap-2 rounded-full bg-[#FDFBF7] px-5 py-3 text-sm font-bold text-[#874638] transition hover:bg-[#F4E8DD]">Explore sanctuary kits <ArrowRight size={16} /></button>
            </div>
          </section>

          <section id="dashboard-resources" className="scroll-mt-8">
            <div className="mb-6 max-w-2xl"><p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Learn · care · create</p><h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Natural resources</h2><p className="m-0 text-sm leading-6 text-[#78665E]">Discover natural resources that can be used for traditional crafts, and follow how raw materials can become tangible products.</p></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {resources.map(({ name, icon: Icon, detail }) => <article key={name} className="rounded-2xl border border-[#EADBC8] bg-white p-5"><span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#F5EEE5] text-[#8D493A]"><Icon size={20} /></span><h3 className="mb-2 text-base font-bold">{name}</h3><p className="m-0 text-xs leading-5 text-[#78665E]">{detail}</p></article>)}
            </div>
            <div className="mt-5 rounded-2xl border border-[#EADBC8] bg-[#F5EEE5] p-5 sm:p-6">
              <h3 className="mb-4 text-base font-bold">How a resource story can work</h3>
              <div className="grid gap-4 sm:grid-cols-4">
                {[['01', 'Source', 'Learn where a material comes from.'], ['02', 'Stewardship', 'See how communities protect and renew it.'], ['03', 'Craft', 'Meet the people turning knowledge into useful work.'], ['04', 'Impact', 'Follow how a purchase can support makers and care.']].map(([number, title, text], index) => <div key={number} className="relative rounded-xl bg-white p-4"><span className="text-[10px] font-extrabold tracking-widest text-[#A97561]">{number}</span><p className="mb-1 mt-2 text-sm font-bold">{title}</p><p className="m-0 text-xs leading-5 text-[#78665E]">{text}</p>{index < 3 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-[#B89A87] sm:block" size={15} />}</div>)}
              </div>
            </div>
          </section>

          <section id="dashboard-kits" className="scroll-mt-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Sanctuary kit purchase</p><h2 className="m-0 text-2xl font-bold tracking-tight sm:text-3xl">View all sanctuary kits <span className="text-base font-medium text-[#9A877D]">({kits.length})</span></h2><p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[#78665E]">Well-designed cultural kits bring together materials inspired by Rwanda’s raw materials, craft traditions and stories.</p></div><span className="text-xs text-[#78665E]">Curated demo collection · USD</span></div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {kits.map((kit) => <article key={kit.id} className="overflow-hidden rounded-2xl border border-[#EADBC8] bg-white shadow-sm">
                <div className="relative h-48 overflow-hidden bg-[#E8D9CC]"><img src={kit.image} alt={kit.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" /><span className="absolute left-3 top-3 rounded-full bg-[#FDFBF7]/95 px-3 py-1 text-[10px] font-bold text-[#874638]">{kit.type}</span></div>
                <div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="mb-2 text-base font-bold">{kit.name}</h3><b className="shrink-0 text-sm text-[#874638]">${kit.price}</b></div><p className="mb-5 min-h-10 text-xs leading-5 text-[#78665E]">{kit.description}</p>
                  {(cart[kit.id] || 0) === 0 ? <button type="button" onClick={() => updateCart(kit.id, 1)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8D493A] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#71392E]"><Plus size={15} /> Add to order</button> : <div className="flex items-center justify-between rounded-xl bg-[#F5EEE5] p-2"><button type="button" onClick={() => updateCart(kit.id, -1)} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#874638]" aria-label={`Remove one ${kit.name}`}><Minus size={15} /></button><span className="text-xs font-bold">{cart[kit.id]} in your order</span><button type="button" onClick={() => updateCart(kit.id, 1)} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#874638]" aria-label={`Add one ${kit.name}`}><Plus size={15} /></button></div>}
                </div>
              </article>)}
            </div>
          </section>

          <section id="dashboard-business" className="scroll-mt-8">
            <div className="mb-6 max-w-2xl"><p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">From small idea to success story</p><h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Business plan generation</h2><p className="m-0 text-sm leading-6 text-[#78665E]">Create a practical first outline for a business that could grow in Rwanda, from a small local idea toward a sustainable success story.</p></div>
            <form onSubmit={(event) => { event.preventDefault(); setBusinessPlan({ ...businessForm }); }} className="grid gap-4 rounded-2xl border border-[#EADBC8] bg-white p-5 sm:grid-cols-3 sm:p-7">
              <label className="text-xs font-bold text-[#6F5B55]">Business idea<select value={businessForm.idea} onChange={(event) => setBusinessForm({ ...businessForm, idea: event.target.value })} className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]"><option>Cultural craft shop</option><option>Farm produce cooperative</option><option>Community tourism experience</option><option>Natural materials workshop</option></select></label>
              <label className="text-xs font-bold text-[#6F5B55]">District or town<input value={businessForm.location} onChange={(event) => setBusinessForm({ ...businessForm, location: event.target.value })} required className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]" placeholder="e.g. Kigali" /></label>
              <label className="text-xs font-bold text-[#6F5B55]">Starting budget (RWF)<input type="number" min="0" value={businessForm.budget} onChange={(event) => setBusinessForm({ ...businessForm, budget: event.target.value })} required className="mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]" /></label>
              <div className="sm:col-span-3"><button className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#71392E]"><FileText size={16} /> Generate starter plan</button></div>
            </form>
            {businessPlan && <article className="mt-5 rounded-2xl border border-[#EADBC8] bg-[#F5EEE5] p-5 sm:p-7"><p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Starter business plan</p><h3 className="mb-5 text-xl font-bold">{businessPlan.idea} · {businessPlan.location}</h3><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-white p-4"><p className="mb-1 text-xs font-bold text-[#874638]">Concept</p><p className="m-0 text-sm leading-6 text-[#6F5B55]">Build a {businessPlan.idea.toLowerCase()} serving customers in {businessPlan.location}, with a focus on local skills, cultural knowledge and responsible sourcing.</p></div><div className="rounded-xl bg-white p-4"><p className="mb-1 text-xs font-bold text-[#874638]">Starting budget</p><p className="m-0 text-sm leading-6 text-[#6F5B55]">RWF {Number(businessPlan.budget || 0).toLocaleString()} · Use this amount to plan essential tools, materials and early operating costs.</p></div><div className="rounded-xl bg-white p-4"><p className="mb-1 text-xs font-bold text-[#874638]">First steps</p><p className="m-0 text-sm leading-6 text-[#6F5B55]">Talk with potential customers, identify local suppliers, make a small first batch or pilot, then gather feedback before expanding.</p></div><div className="rounded-xl bg-white p-4"><p className="mb-1 text-xs font-bold text-[#874638]">Growth path</p><p className="m-0 text-sm leading-6 text-[#6F5B55]">Track costs and sales, build partnerships in {businessPlan.location}, and reinvest in quality, training and reliable supply.</p></div></div></article>}
          </section>

          {cartCount > 0 && <section className="rounded-2xl border border-[#EADBC8] bg-white p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-5"><div><p className="mb-1 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Your selection · {cartCount} {cartCount === 1 ? 'item' : 'items'}</p><h2 className="m-0 text-xl font-bold">Order total <span className="text-[#874638]">${cartTotal.toFixed(2)}</span></h2></div><button type="button" onClick={placeOrder} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white hover:bg-[#71392E]">Place demo order <ArrowRight size={16} /></button></div><p className="mb-0 mt-3 text-xs text-[#78665E]">Demo checkout stores a confirmation in this browser. Payment processing is not connected.</p></section>}

          <section id="dashboard-orders" className="scroll-mt-8">
            <div className="mb-5"><p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#8D493A]">Your activity</p><h2 className="m-0 text-2xl font-bold tracking-tight">My orders</h2></div>
            {notice && <div role="status" className="mb-4 flex items-start gap-3 rounded-xl border border-[#BBD6BD] bg-[#EFF7EF] p-4 text-sm text-[#315D3A]"><Check size={18} className="mt-0.5 shrink-0" />{notice}</div>}
            {orders.length ? <div className="space-y-3">{orders.map((order) => <article key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EADBC8] bg-white p-5"><div><p className="mb-1 text-xs font-bold text-[#874638]">{order.id} · Confirmed</p><p className="mb-1 text-sm font-semibold">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p><p className="m-0 text-xs text-[#78665E]">{order.date}</p></div><strong className="text-[#874638]">${Number(order.total).toFixed(2)}</strong></article>)}</div> : <div className="rounded-2xl border border-dashed border-[#DCC9B9] bg-white/60 p-7 text-center"><ShoppingBag className="mx-auto mb-3 text-[#A97561]" size={23} /><p className="mb-1 text-sm font-bold">No orders yet</p><p className="m-0 text-xs text-[#78665E]">Add one of the cultural kits to create a demo order.</p></div>}
          </section>
        </div>
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl border border-[#EADBC8] bg-[#FDFBF7]/95 p-2 shadow-lg backdrop-blur lg:hidden">
        {sections.map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => goTo(id)} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-[9px] font-bold ${activeSection === id ? 'text-[#8D493A]' : 'text-[#78665E]'}`}><Icon size={17} />{label}</button>)}
      </nav>
    </div>
  );
}
