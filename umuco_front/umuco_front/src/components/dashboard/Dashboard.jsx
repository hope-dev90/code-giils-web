import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, BriefcaseBusiness, Check, Download, FileText,
  Leaf, LogOut, Minus, Package, Plus, ShoppingBag, Sparkles,
  Smartphone, Waves, X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/Language';
import TribalLogo from '../../assets/Logo';
import { apiJson, vercelApiJson } from '../../config/api';
import { STORY_LIBRARY, getRewardStory } from '../../data/stories';
import { localizeStory } from '../../utils/storyLocalization';
import StoryArticle from '../landing/StoryArticle';
import braceletImage from '../../assets/bracelet.png';
import penImage from '../../assets/pen.png';
import shirtImage from '../../assets/t-shirt.png';
import heroImage from '../../assets/rwanda.jpg';
import sisalImage from '../../assets/sisal.png';
import bananaLeavesImage from '../../assets/banana leaves.png';
import cowDungImage from '../../assets/cowdung.png';
import woodsSeedsImage from '../../assets/woods-seeds.png';

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
  {
    id: 'sisal-grass',
    name: 'Sisal & local grasses',
    type: 'Plant fibres',
    image: sisalImage,
    detail: 'Fibres used by Rwandan makers for woven crafts.',
    makes: ['Agaseke-style baskets', 'Storage baskets', 'Floor mats', 'Serving trays', 'Coasters and placemats', 'Woven wall decorations'],
  },
  {
    id: 'banana-fibre',
    name: 'Banana leaves & fibre',
    type: 'Plant fibres',
    image: bananaLeavesImage,
    detail: 'Banana plant material can be prepared and woven into useful handmade pieces.',
    makes: ['Woven baskets', 'Floor mats', 'Decorative wall panels', 'Small ornaments', 'Handmade toys', 'Gift decorations'],
  },
  {
    id: 'imigongo-materials',
    name: 'Cow dung & natural pigments',
    type: 'Art materials',
    image: cowDungImage,
    detail: 'Materials used in Imigongo art. Work with an experienced local maker on safe preparation and handling.',
    makes: ['Raised Imigongo art panels', 'Framed geometric wall art', 'Decorative panels', 'Patterned pottery details', 'Small cultural keepsakes'],
  },
  {
    id: 'wood-seeds',
    name: 'Responsibly sourced wood & seeds',
    type: 'Natural materials',
    image: woodsSeedsImage,
    detail: 'Use small offcuts and gathered seeds where they are locally available and sustainably sourced.',
    makes: ['Carved ornaments', 'Seed beads', 'Necklaces and bracelets', 'Keyrings', 'Small figurines', 'Personal keepsakes'],
  },
  {
    id: 'water-resource',
    name: 'Clean water access',
    type: 'Workshop resource',
    icon: Waves,
    detail: 'Plan reliable access to clean water for preparing fibres, cleaning tools, and finishing products.',
    makes: ['Preparing plant fibres', 'Cleaning tools and work surfaces', 'Mixing natural pigments', 'Washing and finishing products'],
  },
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

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function printBusinessPlan(plan) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;

  const materials = plan.materials.map((material) => `<li>${escapeHtml(material.name)}${material.uses?.length ? ` — ${escapeHtml(material.uses.join(', '))}` : ''}</li>`).join('');
  const allocation = plan.budgetAllocation.map((item) => `<li><strong>${escapeHtml(item.category)}: ${formatRwf(item.amountRwf)}</strong> — ${escapeHtml(item.rationale)}</li>`).join('');
  const firstSteps = plan.firstSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join('');
  const risks = plan.risks.map((risk) => `<li>${escapeHtml(risk)}</li>`).join('');
  const section = (title, content) => `<section><h2>${title}</h2>${content}</section>`;

  printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(plan.idea)} - Business Plan</title><style>
    *{box-sizing:border-box}body{max-width:850px;margin:40px auto;padding:0 32px;color:#30221e;font:14px/1.6 Arial,sans-serif}
    h1{margin:0 0 6px;color:#2c1a14;font-size:30px}h2{margin:0 0 8px;color:#874638;font-size:16px}
    .meta{margin:0 0 28px;color:#6f5b55}.demo{display:inline-block;margin:0 0 10px;padding:3px 9px;border:1px solid #d8e3d2;border-radius:20px;color:#456040;font-size:11px;font-weight:bold}
    section{margin:0 0 22px;break-inside:avoid}p{margin:0;color:#514742}ul,ol{margin:0;padding-left:22px}li{margin:0 0 5px}
    @media print{body{margin:0 auto;padding:0 12mm}@page{margin:16mm}}
  </style></head><body>
    ${plan.demo ? '<p class="demo">Demo plan · sample data</p>' : ''}
    <h1>${escapeHtml(plan.idea)} · ${escapeHtml(plan.location)}</h1>
    <p class="meta">UmucoCore business plan · ${escapeHtml(formatDate(plan.generatedAt))} · Starting budget ${escapeHtml(formatRwf(plan.budget))}</p>
    ${section('Executive summary', `<p>${escapeHtml(plan.summary)}</p>`)}
    ${section('Customers and value', `<p>${escapeHtml(plan.targetCustomers)}</p><p><strong>Why they may choose it:</strong> ${escapeHtml(plan.valueProposition)}</p>`)}
    ${materials ? section('Materials notes', `<ul>${materials}</ul>`) : ''}
    ${section('Marketing approach', `<p>${escapeHtml(plan.marketingPlan)}</p>`)}
    ${section('Suggested budget allocation', `<ul>${allocation}</ul>`)}
    ${section('Practical first steps', `<ol>${firstSteps}</ol>`)}
    ${section('Risks to check', `<ul>${risks}</ul>`)}
  </body></html>`);
  printWindow.document.close();
  window.setTimeout(() => { printWindow.focus(); printWindow.print(); }, 300);
  return true;
}

/** Accepts 078 123 4567, 0781234567, +250781234567, 250781234567 and returns 0781234567. */
function normalizeRwandaPhone(input) {
  let digits = String(input || '').replace(/\D/g, '');
  if (digits.startsWith('250')) digits = `0${digits.slice(3)}`;
  return digits;
}

function detectProvider(local) {
  if (/^07[89]\d{7}$/.test(local)) return 'MTN MoMo';
  if (/^07[23]\d{7}$/.test(local)) return 'Airtel Money';
  return null;
}

function maskPhone(local) {
  return `${local.slice(0, 3)}•••••${local.slice(-2)}`;
}

/**
 * TODO: replace this stub with a call to YOUR backend, which asks MTN MoMo / Airtel Money
 * (directly or through a provider such as Flutterwave or Paypack) to send a payment prompt
 * to the customer's phone and confirms the result. Never put payment secrets in the frontend.
 * Must resolve to { ok: true } on success or { ok: false, message } on failure.
 */
async function requestMobileMoneyPayment({ phone, provider, amount }) {
  void phone; void provider; void amount;
  await new Promise((resolve) => { setTimeout(resolve, 2500); });
  return { ok: true };
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
function Modal({ label, onClose, side = false, width = 'max-w-3xl', children }) {
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
          : `relative max-h-[92vh] w-full ${width} overflow-y-auto rounded-3xl bg-[#FDFBF7] shadow-2xl`}
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
        <button type="button" onClick={(event) => onAdd(product, 1, event)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8D493A] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#71392E]">
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

function MaterialCard({ material, selected, expanded, onExpand, onToggle }) {
  const Icon = material.icon;
  return (
    <article className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${selected ? 'border-2 border-[#8D493A] bg-[#FFFDFB] shadow-lg ring-2 ring-[#8D493A]/10 sm:col-span-2 xl:col-span-3' : 'border-[#EADBC8]'}`}>
      <button type="button" onClick={onExpand} aria-expanded={expanded} className={`w-full text-left hover:bg-[#FDFBF7] ${selected ? 'p-6 sm:p-8' : 'p-5'}`}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-[#F5EEE5] text-[#8D493A] ${selected ? 'size-20' : 'size-14'}`}>
            {material.image ? <img src={material.image} alt="" className="h-full w-full object-cover" /> : <Icon size={selected ? 30 : 22} />}
          </span>
          <span className="rounded-full bg-[#F8F5F0] px-3 py-1 text-[11px] font-bold text-[#6F5B55]">{material.type}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <h3 className={`m-0 font-bold ${selected ? 'text-xl sm:text-2xl' : 'text-base'}`}>{material.name}</h3>
          <ArrowRight size={16} className={`shrink-0 text-[#8D493A] transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
        <p className={`mb-0 mt-2 leading-6 text-[#6F5B55] ${selected ? 'text-sm' : 'text-xs leading-5'}`}>{material.detail}</p>
        <p className="mb-0 mt-3 text-[11px] font-semibold text-[#8D493A]">{selected ? 'Selected for your business plan' : `Explore ${material.makes.length} things you could make`}</p>
      </button>
      {expanded && (
        <div className="border-t border-[#F0E7DE] px-5 pb-5 pt-4">
          <p className="mb-3 text-xs font-bold text-[#874638]">Examples of things you can make</p>
          <div className="mb-4 grid gap-2 sm:grid-cols-2">
            {material.makes.map((item) => <div key={item} className="flex items-center gap-2 rounded-xl bg-[#F8F5F0] px-3 py-2.5 text-xs font-medium leading-5 text-[#6F5B55]"><Sparkles size={13} className="shrink-0 text-[#A97561]" />{item}</div>)}
          </div>
          <button type="button" onClick={() => onToggle(material.id)} aria-pressed={selected} className={`w-full rounded-xl px-4 py-3 text-xs font-bold transition ${selected ? 'border border-[#78916F] bg-[#EFF5EB] text-[#456040]' : 'bg-[#8D493A] text-white hover:bg-[#71392E]'}`}>
            {selected ? 'Selected for business plan · Remove' : 'Select for business plan'}
          </button>
        </div>
      )}
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
            Continue to payment <ArrowRight size={16} />
          </button>
        </div>
      )}
    </Modal>
  );
}

function PaymentDialog({ items, onPay, onClose, onViewOrders }) {
  const { language } = useLanguage();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | waiting | success
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const local = normalizeRwandaPhone(phone);
  const provider = detectProvider(local);
  const waiting = status === 'waiting';

  const handleClose = () => {
    if (!waiting) onClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!provider) {
      setError('Enter a valid MTN or Airtel number, for example 078 123 4567.');
      return;
    }
    setError('');
    setStatus('waiting');
    try {
      const payment = await requestMobileMoneyPayment({ phone: local, provider, amount: total });
      if (!payment?.ok) throw new Error(payment?.message || 'The payment was not approved.');
      setResult(onPay({ method: provider, phone: maskPhone(local) }));
      setStatus('success');
    } catch (err) {
      setError(`${err.message || 'The payment could not be completed.'} Please try again.`);
      setStatus('idle');
    }
  };

  if (status === 'success' && result) {
    const unlocked = result.order.storyIds.map(getRewardStory).filter(Boolean);
    return (
      <Modal label="Payment received" onClose={handleClose} width="max-w-3xl">
        <div className="p-6 sm:p-8">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#EFF7EF] text-[#315D3A]"><Check size={24} /></span>
          <h2 className="mb-1 pr-10 text-2xl font-bold">Thank you. Payment received.</h2>
          <p className="mb-5 text-sm text-[#6F5B55]">Order {result.order.id} · {formatRwf(result.order.total)} paid with {result.order.payment.method}. Your order unlocked a story from the Umuco archive.</p>
          <div className="mb-5 space-y-4">
            {unlocked.map((story) => <StoryArticle key={story.id} story={story} language={language} rewardLabel="A story unlocked with your purchase" compact />)}
          </div>
          {!result.saved && <p className="mb-4 rounded-xl bg-[#FFF6EA] p-3 text-xs text-[#7A4A1C]">This order could not be saved on this device, so it may not appear in My orders. Keep the order number above.</p>}
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onViewOrders} className="rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white hover:bg-[#71392E]">View my orders</button>
            <button type="button" onClick={onClose} className="rounded-xl border border-[#DCC9B9] bg-white px-5 py-3 text-sm font-bold text-[#874638] hover:bg-[#F8F5F0]">Keep shopping</button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal label="Pay with mobile money" onClose={handleClose} width="max-w-lg">
      <form onSubmit={submit} className="p-6 sm:p-8" noValidate>
        <h2 className="mb-1 pr-10 text-2xl font-bold">Pay with mobile money</h2>
        <p className="mb-5 text-sm text-[#6F5B55]">Pay with MTN MoMo or Airtel Money, and unlock a story with your order.</p>

        <ul className="m-0 mb-4 list-none space-y-2 p-0">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 rounded-xl bg-[#F8F5F0] px-4 py-3 text-sm">
              <span className="font-semibold">{item.name} × {item.quantity}</span>
              <span className="text-[#874638]">{formatRwf(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#6F5B55]">Total to pay</span>
          <strong className="text-xl text-[#874638]">{formatRwf(total)}</strong>
        </div>

        <label htmlFor="momo-phone" className="text-xs font-bold text-[#6F5B55]">Mobile money number</label>
        <div className="relative mt-2">
          <Smartphone size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8D493A]" />
          <input
            id="momo-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => { setPhone(event.target.value); setError(''); }}
            disabled={waiting}
            placeholder="078 123 4567"
            aria-invalid={Boolean(error)}
            aria-describedby="momo-help"
            className="w-full rounded-xl border border-[#EADBC8] bg-white py-3 pl-10 pr-3 text-base font-medium text-[#30221E] disabled:opacity-60"
          />
        </div>
        <p id="momo-help" className={`mb-0 mt-2 min-h-[1.25rem] text-xs ${error ? 'text-[#A32D2D]' : 'text-[#6F5B55]'}`} role={error ? 'alert' : undefined}>
          {error || (provider ? `${provider} number detected.` : 'MTN numbers start with 078 or 079. Airtel numbers start with 072 or 073.')}
        </p>

        {waiting && (
          <div role="status" className="mt-4 flex items-center gap-3 rounded-xl bg-[#F5EEE5] p-4 text-sm">
            <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[#EADBC8] border-t-[#8D493A]" />
            <span>Check your phone ({maskPhone(local)}) and approve the payment of {formatRwf(total)}.</span>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" disabled={waiting} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white hover:bg-[#71392E] disabled:cursor-not-allowed disabled:opacity-60">
            {waiting ? 'Waiting for approval…' : `Pay ${formatRwf(total)}`}
          </button>
          <button type="button" onClick={handleClose} disabled={waiting} className="rounded-xl border border-[#DCC9B9] bg-white px-5 py-3 text-sm font-bold text-[#874638] hover:bg-[#F8F5F0] disabled:opacity-50">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

function OrdersView({ orders, onShop, onClear }) {
  const { language } = useLanguage();
  return (
    <section aria-labelledby="orders-title">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold tracking-wide text-[#8D493A]">Your purchases</p>
          <h1 id="orders-title" className="mb-2 text-3xl font-bold tracking-tight">My orders</h1>
          <p className="m-0 max-w-2xl text-sm leading-6 text-[#6F5B55]">Every order you place, with the stories you unlocked. Orders are saved on this device.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {orders.length > 0 && <button type="button" onClick={onClear} className="rounded-full border border-[#DCC9B9] bg-white px-4 py-2.5 text-sm font-bold text-[#874638] hover:bg-[#F8F5F0]">Clear order history</button>}
          <button type="button" onClick={onShop} className="inline-flex items-center gap-2 rounded-full border border-[#DCC9B9] bg-white px-4 py-2.5 text-sm font-bold text-[#874638] hover:bg-[#F8F5F0]"><ArrowLeft size={15} /> Back to shop</button>
        </div>
      </div>
      {orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const unlocked = (order.storyIds || []).map(getRewardStory).filter(Boolean);
            return (
              <article key={order.id} className="rounded-2xl border border-[#EADBC8] bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-xs font-bold text-[#874638]">{order.id} · {formatDate(order.createdAt)}</p>
                    <p className="mb-1 text-sm font-semibold">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p>
                    {order.payment && <p className="m-0 text-xs text-[#6F5B55]">Paid with {order.payment.method} · {order.payment.phone}</p>}
                  </div>
                  <strong className="text-lg text-[#874638]">{formatRwf(order.total)}</strong>
                </div>
                {unlocked.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-[#F0E7DE] pt-4">
                    {unlocked.map((story) => (
                      <details key={story.id} className="group overflow-hidden rounded-xl border border-[#EADBC8] bg-white">
                        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-[#8D493A]"><BookOpen className="mr-2 inline" size={16} />Story unlocked: {localizeStory(story, language).title}</summary>
                        <div className="border-t border-[#EADBC8] p-3 sm:p-5"><StoryArticle story={story} language={language} rewardLabel="Unlocked with this order" compact /></div>
                      </details>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#DCC9B9] bg-white/60 p-8 text-center">
          <ShoppingBag className="mx-auto mb-3 text-[#8D493A]" size={23} />
          <p className="mb-1 text-sm font-bold">Your story starts here</p>
          <p className="mb-4 text-xs text-[#6F5B55]">You haven’t placed an order yet. Every order unlocks a story.</p>
          <button type="button" onClick={onShop} className="rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white hover:bg-[#71392E]">Explore the collection</button>
        </div>
      )}
    </section>
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
  const [expandedMaterial, setExpandedMaterial] = useState(null);
  const [businessForm, setBusinessForm] = useState(defaultBusinessForm);
  const [businessPlan, setBusinessPlan] = useState(null);
  const [planStale, setPlanStale] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState('');
  const [toast, setToast] = useState('');
  const [detailProduct, setDetailProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartNudge, setCartNudge] = useState(null);
  const [checkout, setCheckout] = useState(null); // { items, source: 'cart' | 'buy' }
  const [view, setView] = useState('shop'); // 'shop' | 'orders'
  const pendingScroll = useRef(null);
  const cartNudgeTimer = useRef(null);

  const featuredProduct = products.find((product) => product.featured) || products[0];

  const cartItems = useMemo(
    () => products.filter((product) => cart[product.id] > 0).map((product) => ({ ...product, quantity: cart[product.id] })),
    [cart],
  );
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const arrangedMaterials = materials.filter((material) => selectedMaterials[material.id]);

  /* Toast auto-dismiss */
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => () => window.clearTimeout(cartNudgeTimer.current), []);

  /* Highlight the nav item for the shop section currently in view */
  useEffect(() => {
    if (view !== 'shop') return undefined;
    const elements = sections
      .filter(({ id }) => id !== 'orders')
      .map(({ id }) => document.getElementById(`dashboard-${id}`))
      .filter(Boolean);
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
  }, [view]);

  /* After switching back from My orders, scroll to the requested shop section */
  useEffect(() => {
    if (view !== 'shop' || !pendingScroll.current) return;
    const id = pendingScroll.current;
    pendingScroll.current = null;
    requestAnimationFrame(() => {
      document.getElementById(`dashboard-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [view]);

  const goTo = (id) => {
    setActiveSection(id);
    if (id === 'orders') {
      setView('orders');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (view !== 'shop') {
      pendingScroll.current = id;
      setView('shop');
      return;
    }
    document.getElementById(`dashboard-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateCart = useCallback((product, delta, event) => {
    setCart((current) => ({ ...current, [product.id]: Math.max(0, (current[product.id] || 0) + delta) }));
    if (delta > 0 && Number.isFinite(event?.clientX) && Number.isFinite(event?.clientY)) {
      const width = 144;
      const height = 48;
      setCartNudge({
        left: Math.max(12, Math.min(event.clientX + 14, window.innerWidth - width - 12)),
        top: Math.max(12, Math.min(event.clientY + 14, window.innerHeight - height - 12)),
      });
      window.clearTimeout(cartNudgeTimer.current);
      cartNudgeTimer.current = window.setTimeout(() => setCartNudge(null), 4500);
    } else if (delta > 0) {
      setToast(`${product.name} added to your cart.`);
    }
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

  /** Called by PaymentDialog after the mobile money payment succeeds. */
  const confirmOrder = (payment) => {
    const order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      items: checkout.items,
      total: checkout.items.reduce((total, item) => total + item.price * item.quantity, 0),
      payment,
      storyIds: [STORY_LIBRARY[Math.floor(Math.random() * STORY_LIBRARY.length)].id],
    };
    const nextOrders = [order, ...orders];
    const saved = writeOrders(nextOrders);
    setOrders(nextOrders);
    if (checkout.source === 'cart') setCart({});
    return { order, saved };
  };

  const clearOrderHistory = () => {
    try {
      localStorage.removeItem(ORDERS_KEY);
      localStorage.removeItem('umuco_demo_orders');
      setOrders([]);
      setToast('Order history cleared. You can start fresh.');
    } catch {
      setToast('Could not clear order history on this device.');
    }
  };

  const toggleMaterialSelection = (id) => {
    setSelectedMaterials((current) => ({ ...current, [id]: !current[id] }));
    if (businessPlan) setPlanStale(true);
  };

  const updateBusinessForm = (event) => {
    const { name, value } = event.target;
    setBusinessForm((current) => ({ ...current, [name]: value }));
    if (businessPlan) setPlanStale(true);
  };

  const generateBusinessPlan = async (event) => {
    event.preventDefault();
    setPlanLoading(true);
    setPlanError('');
    try {
      const plan = await vercelApiJson('/api/ai/business-plan', {
        method: 'POST',
        body: JSON.stringify({
          ...businessForm,
          budget: Number(businessForm.budget),
          materials: arrangedMaterials.map((material) => ({
            name: material.name,
            type: material.type,
            uses: material.makes,
          })),
        }),
      });
      setBusinessPlan(plan);
      setPlanStale(false);
    } catch (error) {
      setPlanError(error.message || 'Could not generate a business plan. Please try again.');
    } finally {
      setPlanLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  const inputClass = 'mt-2 w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-3 text-sm font-medium text-[#30221E]';

  return (
    <div className="min-h-screen bg-[#F8F5F0] font-poppins text-[#30221E]">
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
              {id === 'orders' && orders.length > 0 && <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px]">{orders.length}</span>}
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

        {view === 'orders' && (
          <div className="mx-auto mt-6 max-w-6xl sm:mt-8">
            <OrdersView orders={orders} onShop={() => goTo('kits')} onClear={clearOrderHistory} />
          </div>
        )}
        {view === 'shop' && (
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
                <h1 className="mb-4 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"><span className="text-[#FFFFFF]">A piece of culture.</span>{' '}<span className="text-[#FDFBF7]">A story of your own.</span></h1>
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
                  <button type="button" onClick={(event) => updateCart(featuredProduct, 1, event)} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#71392E]"><Plus size={16} /> Add to cart</button>
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
              eyebrow="Rwanda-inspired materials"
              title="Choose materials for your idea"
              description="Open a material to explore what makers can create with it, then select the materials you want included in your business plan."
              aside={<span className="rounded-full bg-[#F3E7DE] px-3 py-1.5 text-xs font-semibold text-[#874638]">{arrangedMaterials.length} selected</span>}
            />
            <div className="mb-5 rounded-2xl border border-[#D8E3D2] bg-[#F2F6EF] p-4 text-sm leading-6 text-[#456040]">
              These are examples of materials used by makers in Rwanda, not items for sale here. Local availability can vary; check with makers and suppliers in your area. Your selections only inform the business plan and never change your cart or purchases.
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[...materials].sort((a, b) => Number(Boolean(selectedMaterials[b.id])) - Number(Boolean(selectedMaterials[a.id]))).map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  selected={Boolean(selectedMaterials[material.id])}
                  expanded={expandedMaterial === material.id}
                  onExpand={() => setExpandedMaterial((current) => current === material.id ? null : material.id)}
                  onToggle={toggleMaterialSelection}
                />
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#F5EEE5] p-5 sm:p-6">
              <div>
                <h3 className="mb-1 text-sm font-bold">Materials selected for your plan</h3>
                <p className="m-0 text-xs leading-5 text-[#6F5B55]">
                  {arrangedMaterials.length
                    ? arrangedMaterials.map((material) => material.name).join(' · ')
                    : 'Open a material and select it to include it in your business plan.'}
                </p>
              </div>
              <button type="button" onClick={() => goTo('business')} disabled={!arrangedMaterials.length} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#71392E] disabled:cursor-not-allowed disabled:opacity-45">
                Continue to business plan <ArrowRight size={16} />
              </button>
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
            <p className="mb-5 rounded-xl border border-[#EADBC8] bg-white p-4 text-xs leading-5 text-[#6F5B55]">AI-generated guidance is a starting point. Check costs, local requirements, and market assumptions before making business decisions.</p>
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
                <button type="submit" disabled={planLoading} className="inline-flex items-center gap-2 rounded-xl bg-[#8D493A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#71392E] disabled:cursor-wait disabled:opacity-60">
                  <FileText size={16} /> {planLoading ? 'Generating plan…' : 'Generate business plan'}
                </button>
              </div>
            </form>

            {planError && <p role="alert" className="mt-4 rounded-xl border border-[#E8C9A8] bg-[#FFF6EA] p-4 text-sm text-[#7A4A1C]">{planError}</p>}

            {businessPlan && (
              <article className="mt-5 rounded-2xl border border-[#EADBC8] bg-[#F5EEE5] p-5 sm:p-7">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="mb-2 text-xs font-bold tracking-wide text-[#8D493A]">Your starter idea</p>
                    <h3 className="m-0 text-xl font-bold">{businessPlan.idea} · {businessPlan.location}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => { if (!printBusinessPlan(businessPlan)) setToast('Allow pop-ups to download your plan as a PDF.'); }} className="inline-flex items-center gap-2 rounded-full border border-[#DCC9B9] bg-white px-3 py-2 text-[11px] font-bold text-[#874638] transition hover:bg-[#F8F5F0]">
                      <Download size={14} /> Download PDF
                    </button>
                    {businessPlan.demo && <span className="rounded-full border border-[#D8E3D2] bg-[#F2F6EF] px-3 py-1 text-[11px] font-bold text-[#456040]">Demo plan · sample data</span>}
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#6F5B55]">Created {formatDate(businessPlan.generatedAt)}</span>
                  </div>
                </div>
                {planStale && (
                  <p role="status" className="mb-4 rounded-xl border border-[#E8C9A8] bg-[#FFF6EA] p-3 text-xs text-[#7A4A1C]">
                    You changed your inputs after this idea was created. Select “Generate starter idea” to refresh it.
                  </p>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">Executive summary</p>
                    <p className="m-0 text-sm leading-6 text-[#6F5B55]">{businessPlan.summary}</p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">Customers and value</p>
                    <p className="mb-2 text-sm leading-6 text-[#6F5B55]">{businessPlan.targetCustomers}</p>
                    <p className="mb-1 text-xs font-bold text-[#874638]">Why they may choose it</p>
                    <p className="m-0 text-sm leading-6 text-[#6F5B55]">{businessPlan.valueProposition}</p>
                  </div>
                  {businessPlan.materials.length > 0 && (
                    <div className="rounded-xl bg-white p-4">
                      <p className="mb-1 text-xs font-bold text-[#874638]">Materials notes</p>
                      <ul className="m-0 space-y-1 pl-4 text-sm leading-6 text-[#6F5B55]">
                        {businessPlan.materials.map((material) => <li key={material.name}>{material.name}{material.uses?.length ? ` — ${material.uses.join(', ')}` : ''}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">Marketing approach</p>
                    <p className="m-0 text-sm leading-6 text-[#6F5B55]">{businessPlan.marketingPlan}</p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">Suggested budget allocation</p>
                    <p className="mb-2 text-xs text-[#6F5B55]">Available starting budget: {formatRwf(businessPlan.budget)}</p>
                    <ul className="m-0 space-y-2 pl-4 text-sm leading-6 text-[#6F5B55]">
                      {businessPlan.budgetAllocation.map((item) => <li key={item.category}><strong>{item.category}: {formatRwf(item.amountRwf)}</strong> — {item.rationale}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">Practical first steps</p>
                    <ol className="m-0 space-y-1 pl-4 text-sm leading-6 text-[#6F5B55]">
                      {businessPlan.firstSteps.map((step, index) => <li key={`${index}-${step}`}>{step}</li>)}
                    </ol>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-1 text-xs font-bold text-[#874638]">Risks to check</p>
                    <ul className="m-0 space-y-1 pl-4 text-sm leading-6 text-[#6F5B55]">
                      {businessPlan.risks.map((risk, index) => <li key={`${index}-${risk}`}>{risk}</li>)}
                    </ul>
                  </div>
                </div>
              </article>
            )}
          </section>

        </div>
        )}
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

      {cartNudge && (
        <button
          type="button"
          onClick={() => { setCartOpen(true); setCartNudge(null); }}
          style={{ left: cartNudge.left, top: cartNudge.top }}
          className="fixed z-[65] inline-flex h-12 items-center gap-2 rounded-full border border-[#EADBC8] bg-[#FDFBF7] px-4 text-xs font-bold text-[#8D493A] shadow-xl transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D493A]"
          aria-label={`View cart, ${cartCount} items`}
        >
          <ShoppingBag size={16} /> View cart <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#8D493A] px-1 text-[10px] text-white">{cartCount}</span>
        </button>
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
      {checkout && (
        <PaymentDialog
          items={checkout.items}
          onPay={confirmOrder}
          onClose={() => setCheckout(null)}
          onViewOrders={() => { setCheckout(null); goTo('orders'); }}
        />
      )}
      {detailProduct && (
        <ProductDetail
          product={detailProduct}
          onAdd={(event) => { updateCart(detailProduct, 1, event); setDetailProduct(null); }}
          onClose={() => setDetailProduct(null)}
        />
      )}
    </div>
  );
}
