import { useEffect, useState } from 'react'; import toast from 'react-hot-toast'; import api, { errMsg } from '../api'; import { useAuth, Spinner, Badge, Field } from '../ui';
export default function Dashboard() {
  const { user, setUser } = useAuth(); const [list, setList] = useState(null); const [p, setP] = useState({ name: user.name, phone: user.phone || '', ecName: user.emergencyContact?.name || '', ecPhone: user.emergencyContact?.phone || '' });
  const load = () => api.get('/appointments/my').then((r) => setList(r.data)); useEffect(() => { load(); }, []);
  const cancel = async (id) => { if (!confirm('Cancel this appointment?')) return; try { await api.patch(`/appointments/${id}/status`, { status: 'cancelled' }); toast.success('Appointment cancelled'); load(); } catch (e) { toast.error(errMsg(e)); } };
  const save = async (e) => { e.preventDefault(); try { const { data } = await api.put('/auth/me', { name: p.name, phone: p.phone, emergencyContact: { name: p.ecName, phone: p.ecPhone } }); setUser(data); toast.success('Profile saved'); } catch (er) { toast.error(errMsg(er)); } };
  const today = new Date().toISOString().slice(0, 10);
  const Row = ({ a }) => <li className="card flex flex-wrap items-center justify-between gap-2"><div><p className="font-semibold">{a.doctor?.name} · {a.department?.name}</p><p className="text-sm text-slate-600">{a.date} at {a.timeSlot} · Ref {a.referenceId}</p></div>
    <div className="flex items-center gap-3"><Badge s={a.status} />{a.date >= today && ['pending', 'confirmed'].includes(a.status) && <button className="btn-ghost" onClick={() => cancel(a._id)}>Cancel</button>}</div></li>;
  return (<div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-3"><div className="lg:col-span-2"><h1 className="mb-4 font-display text-3xl font-bold">My appointments</h1>
    {!list ? <Spinner /> : !list.length ? <p>No appointments yet. Book your first visit from the Doctors page.</p> : <>
      <h2 className="mb-2 font-semibold">Upcoming</h2><ul className="mb-6 space-y-3">{list.filter((a) => a.date >= today && a.status !== 'cancelled' && a.status !== 'completed').map((a) => <Row key={a._id} a={a} />)}</ul>
      <h2 className="mb-2 font-semibold">Past & cancelled</h2><ul className="space-y-3">{list.filter((a) => !(a.date >= today && a.status !== 'cancelled' && a.status !== 'completed')).map((a) => <Row key={a._id} a={a} />)}</ul></>}</div>
    <form onSubmit={save} className="card h-fit space-y-3"><h2 className="text-xl font-semibold">Profile</h2><Field label="Name" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /><Field label="Phone" value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} />
      <Field label="Emergency contact name" value={p.ecName} onChange={(e) => setP({ ...p, ecName: e.target.value })} /><Field label="Emergency contact phone" value={p.ecPhone} onChange={(e) => setP({ ...p, ecPhone: e.target.value })} /><button className="btn w-full">Save changes</button></form></div>);
}
