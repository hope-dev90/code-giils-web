import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, Shield, Trash2 } from 'lucide-react';
import { apiJson } from '../../config/api';
import { authH, jsonH, Confirm } from './adminHelpers.jsx';

export default function UsersSection({ toast, currentUserId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setUsers(await apiJson('/api/admin/users', { headers: authH() })); }
    catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const changeRole = async (u, role) => {
    try {
      const updated = await apiJson(`/api/admin/users/${u.id}/role`, {
        method: 'PATCH', headers: jsonH(), body: JSON.stringify({ role }),
      });
      setUsers((p) => p.map((x) => x.id === updated.id ? updated : x));
      toast(`${updated.name} is now ${updated.role}`);
    } catch (e) { toast(e.message, 'error'); }
  };

  const doDelete = async (u) => {
    try {
      await apiJson(`/api/admin/users/${u.id}`, { method: 'DELETE', headers: authH() });
      setUsers((p) => p.filter((x) => x.id !== u.id));
      toast(`${u.name} deleted`);
    } catch (e) { toast(e.message, 'error'); }
    finally { setConfirm(null); }
  };

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) ||
           u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {confirm && (
        <Confirm
          message={`Delete "${confirm.name}" (${confirm.email})? This cannot be undone.`}
          onConfirm={() => doDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A877D]" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-xl border border-[#EADBC8] bg-[#FDFBF7] py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8D493A]/30"
          />
        </div>
        <button onClick={load} className="flex items-center gap-2 rounded-xl border border-[#EADBC8] px-3 py-2.5 text-xs font-semibold text-[#6F5B55] hover:bg-[#F8F3ED]">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-[#9A877D]">Loading users…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#EADBC8]">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F3ED]">
              <tr>
                {['Name', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#9A877D]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADBC8] bg-white">
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#9A877D]">No users found.</td></tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#FDFBF7]">
                  <td className="px-4 py-3 font-semibold text-[#30221E]">{u.name}</td>
                  <td className="px-4 py-3 text-[#6F5B55]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-[#F5EEE5] text-[#8D493A]' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role === 'ADMIN' && <Shield size={10} />} {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#9A877D]">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {String(u.id) !== String(currentUserId) ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => changeRole(u, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                          className="rounded-lg border border-[#EADBC8] px-2.5 py-1.5 text-[11px] font-semibold text-[#6F5B55] hover:bg-[#F5EEE5]"
                        >
                          {u.role === 'ADMIN' ? 'Demote' : 'Make admin'}
                        </button>
                        <button
                          onClick={() => setConfirm(u)}
                          className="grid h-7 w-7 place-items-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#9A877D]">You</span>
                    )}
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
