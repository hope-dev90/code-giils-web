import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { apiJson } from '../../config/api';
import { authH, jsonH, Modal, Confirm, fmtMoney } from './adminHelpers.jsx';

const EMPTY = { name: '', description: '', price: '', image: '', cultural_story: '' };

function ProductForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const inputCls = 'w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8D493A]/30';

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <label className="block text-xs font-bold text-[#6F5B55]">
        Name *
        <input required value={form.name} onChange={(e) => set('name', e.target.value)} className={`mt-1 ${inputCls}`} />
      </label>
      <label className="block text-xs font-bold text-[#6F5B55]">
        Price (USD) *
        <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} className={`mt-1 ${inputCls}`} />
      </label>
      <label className="block text-xs font-bold text-[#6F5B55]">
        Description *
        <textarea required rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} className={`mt-1 resize-none ${inputCls}`} />
      </label>
      <label className="block text-xs font-bold text-[#6F5B55]">
        Cultural story *
        <textarea required rows={3} value={form.cultural_story} onChange={(e) => set('cultural_story', e.target.value)} className={`mt-1 resize-none ${inputCls}`} />
      </label>
      <label className="block text-xs font-bold text-[#6F5B55]">
        Image URL
        <input value={form.image} onChange={(e) => set('image', e.target.value)} className={`mt-1 ${inputCls}`} placeholder="https://…" />
      </label>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-xl border border-[#EADBC8] px-4 py-2 text-sm font-semibold text-[#6F5B55] hover:bg-[#F8F3ED]">Cancel</button>
        <button type="submit" disabled={saving} className="rounded-xl bg-[#8D493A] px-4 py-2 text-sm font-bold text-white hover:bg-[#71392E] disabled:opacity-60">
          {saving ? 'Saving…' : 'Save product'}
        </button>
      </div>
    </form>
  );
}

export default function ProductsSection({ toast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode:'add' } | { mode:'edit', product }
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setProducts(await apiJson('/api/admin/products', { headers: authH() })); }
    catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async (form) => {
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        const created = await apiJson('/api/admin/products', {
          method: 'POST', headers: jsonH(), body: JSON.stringify(form),
        });
        setProducts((p) => [created, ...p]);
        toast('Product created');
      } else {
        const updated = await apiJson(`/api/admin/products/${modal.product.id}`, {
          method: 'PUT', headers: jsonH(), body: JSON.stringify(form),
        });
        setProducts((p) => p.map((x) => x.id === updated.id ? updated : x));
        toast('Product updated');
      }
      setModal(null);
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const doDelete = async (product) => {
    try {
      await apiJson(`/api/admin/products/${product.id}`, { method: 'DELETE', headers: authH() });
      setProducts((p) => p.filter((x) => x.id !== product.id));
      toast('Product deleted');
    } catch (e) { toast(e.message, 'error'); }
    finally { setConfirm(null); }
  };

  return (
    <div className="space-y-4">
      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add product' : 'Edit product'} onClose={() => setModal(null)}>
          <ProductForm initial={modal.product} onSave={save} onCancel={() => setModal(null)} saving={saving} />
        </Modal>
      )}
      {confirm && (
        <Confirm
          message={`Delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={() => doDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="flex items-center justify-between gap-3">
        <button onClick={load} className="flex items-center gap-2 rounded-xl border border-[#EADBC8] px-3 py-2.5 text-xs font-semibold text-[#6F5B55] hover:bg-[#F8F3ED]">
          <RefreshCw size={14} /> Refresh
        </button>
        <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-2 rounded-xl bg-[#8D493A] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#71392E]">
          <Plus size={14} /> Add product
        </button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-[#9A877D]">Loading products…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#EADBC8]">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F3ED]">
              <tr>
                {['Name', 'Price', 'Description', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#9A877D]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADBC8] bg-white">
              {products.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-[#9A877D]">No products yet.</td></tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#FDFBF7]">
                  <td className="px-4 py-3 font-semibold text-[#30221E]">{p.name}</td>
                  <td className="px-4 py-3 font-bold text-[#8D493A]">{fmtMoney(p.price)}</td>
                  <td className="max-w-xs px-4 py-3 text-xs text-[#6F5B55] truncate">{p.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal({ mode: 'edit', product: p })}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-[#EADBC8] text-[#6F5B55] hover:bg-[#F5EEE5]">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => setConfirm(p)}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                        <Trash2 size={13} />
                      </button>
                    </div>
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
