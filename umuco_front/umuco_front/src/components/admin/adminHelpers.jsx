import { useEffect } from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

export const ORDER_STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
export const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};
export const fmt = (n) => Number(n || 0).toLocaleString();
export const fmtMoney = (n) => `$${Number(n || 0).toFixed(2)}`;
export const authH = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
export const jsonH = () => ({ 'Content-Type': 'application/json', ...authH() });

export function Badge({ status }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export function Toast({ message, type, onDismiss }) {
  useEffect(() => { const t = setTimeout(onDismiss, 3500); return () => clearTimeout(t); }, [onDismiss]);
  const cls = type === 'error'
    ? 'bg-red-50 border-red-200 text-red-800'
    : 'bg-green-50 border-green-200 text-green-800';
  const Icon = type === 'error' ? AlertCircle : Check;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-5 py-4 shadow-lg ${cls}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#EADBC8] px-6 py-4">
          <h3 className="text-base font-bold text-[#30221E]">{title}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-xl hover:bg-[#F5EEE5] text-[#6F5B55]">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function Confirm({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Confirm action" onClose={onCancel}>
      <p className="mb-6 text-sm text-[#6F5B55]">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="rounded-xl border border-[#EADBC8] px-4 py-2 text-sm font-semibold text-[#6F5B55] hover:bg-[#F8F3ED]">
          Cancel
        </button>
        <button onClick={onConfirm} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
          Delete
        </button>
      </div>
    </Modal>
  );
}

export function StatCard({ label, value, icon: Icon, sub }) {
  return (
    <div className="rounded-2xl border border-[#EADBC8] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-[#9A877D]">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F5EEE5] text-[#8D493A]">
          <Icon size={18} />
        </span>
      </div>
      <p className="mb-1 text-3xl font-bold text-[#30221E]">{value}</p>
      {sub && <p className="text-xs text-[#78665E]">{sub}</p>}
    </div>
  );
}
