import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { apiJson } from '../../config/api';
import { authH, jsonH, Badge, fmtMoney, ORDER_STATUSES } from './adminHelpers.jsx';

export default function OrdersSection({ toast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const load = useCallback(async () => {
    setLoading(true);
    try { setOrders(await apiJson('/api/admin/orders', { headers: authH() })); }
    catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (order, status) => {
    try {
      const updated = await apiJson(`/api/admin/orders/${order.id}`, {
        method: 'PATCH', headers: jsonH(), body: JSON.stringify({ status }),
      });
      setOrders((p) => p.map((o) => o.id === updated.id ? { ...o, status: updated.status } : o));
      toast(`Order #${updated.id} → ${updated.status}`);
    } catch (e) { toast(e.message, 'error'); }
  };

  const visible = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', ...ORDER_STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${filter === s ? 'bg-[#8D493A] text-white' : 'border border-[#EADBC8] text-[#6F5B55] hover:bg-[#F8F3ED]'}`}>
            {s}
          </button>
        ))}
        <button onClick={load} className="ml-auto flex items-center gap-2 rounded-xl border border-[#EADBC8] px-3 py-2 text-xs font-semibold text-[#6F5B55] hover:bg-[#F8F3ED]">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-[#9A877D]">Loading orders…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#EADBC8]">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F3ED]">
              <tr>
                {['#', 'Customer', 'Product', 'Price', 'Status', 'Date', 'Change status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#9A877D]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADBC8] bg-white">
              {visible.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-[#9A877D]">No orders found.</td></tr>
              )}
              {visible.map((o) => (
                <tr key={o.id} className="hover:bg-[#FDFBF7]">
                  <td className="px-4 py-3 font-mono text-xs text-[#9A877D]">#{o.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#30221E]">{o.user_name}</p>
                    <p className="text-xs text-[#9A877D]">{o.email}</p>
                  </td>
                  <td className="px-4 py-3 text-[#6F5B55]">{o.product_name}</td>
                  <td className="px-4 py-3 font-bold text-[#8D493A]">{fmtMoney(o.price)}</td>
                  <td className="px-4 py-3"><Badge status={o.status} /></td>
                  <td className="px-4 py-3 text-xs text-[#9A877D]">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o, e.target.value)}
                      className="rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-2 py-1.5 text-xs font-semibold text-[#30221E] focus:outline-none focus:ring-2 focus:ring-[#8D493A]/30"
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
