import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react';
import { Badge, StatCard, fmt, fmtMoney, ORDER_STATUSES } from './adminHelpers.jsx';

export default function OverviewSection({ stats, loading }) {
  if (loading) return <p className="py-16 text-center text-sm text-[#9A877D]">Loading stats…</p>;
  if (!stats) return null;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users"  value={fmt(stats.users)}    icon={Users} />
        <StatCard label="Products"     value={fmt(stats.products)} icon={Package} />
        <StatCard label="Total orders" value={fmt(stats.orders)}   icon={ShoppingBag} />
        <StatCard label="Revenue"      value={fmtMoney(stats.revenue)} icon={DollarSign} sub="Excludes cancelled" />
      </div>
      <div className="rounded-2xl border border-[#EADBC8] bg-white p-5">
        <h3 className="mb-4 text-sm font-bold text-[#30221E]">Orders by status</h3>
        <div className="flex flex-wrap gap-3">
          {ORDER_STATUSES.map((s) => (
            <div key={s} className="flex items-center gap-2 rounded-xl border border-[#EADBC8] px-4 py-2">
              <Badge status={s} />
              <span className="text-sm font-bold text-[#30221E]">{fmt(stats.ordersByStatus?.[s])}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
