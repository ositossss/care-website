import { useEffect, useState } from 'react'; import { useSearchParams, Link } from 'react-router-dom'; import toast from 'react-hot-toast'; import { CheckCircle2 } from 'lucide-react';
import api, { errMsg } from '../api'; import { useAuth, Field, Spinner } from '../ui';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export default function Book() {
  const { user } = useAuth(); const [sp] = useSearchParams(); const today = new Date().toISOString().slice(0, 10);
  const [deps, setDeps] = useState([]); const [docs, setDocs] = useState([]); const [booked, setBooked] = useState([]);
  const [f, setF] = useState({ department: '', doctor: sp.get('doctor') || '', date: '', timeSlot: '', patientName: '', patientEmail: '', patientPhone: '', reason: '' });
  const [busy, setBusy] = useState(false); const [done, setDone] = useState(null);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value, ...(k === 'department' && { doctor: '' }), ...(k !== 'timeSlot' && k !== 'reason' && k !== 'patientName' && k !== 'patientEmail' && k !== 'patientPhone' && { timeSlot: '' }) }));
  useEffect(() => { api.get('/departments').then((r) => setDeps(r.data)); }, []);
  useEffect(() => { api.get('/doctors', { params: { department: f.department } }).then((r) => setDocs(r.data)); }, [f.department]);
  useEffect(() => { if (user) setF((p) => ({ ...p, patientName: p.patientName || user.name, patientEmail: p.patientEmail || user.email, patientPhone: p.patientPhone || user.phone || '' })); }, [user]);
  const doc = docs.find((d) => d._id === f.doctor); const dayOk = doc && f.date && doc.availableDays.includes(DAYS[new Date(f.date + 'T12:00:00').getDay()]);
  useEffect(() => { if (doc && f.date) api.get('/appointments/booked', { params: { doctor: doc._id, date: f.date } }).then((r) => setBooked(r.data)); }, [doc?._id, f.date]);
  const submit = async (e) => { e.preventDefault();
    if (!doc || !f.date || !f.timeSlot) return toast.error('Please choose a doctor, date and time slot');
    setBusy(true); try { const { department, ...body } = f; setDone((await api.post('/appointments', body)).data); toast.success('Appointment booked'); } catch (er) { toast.error(errMsg(er)); } setBusy(false); };
  if (done) return (<div className="mx-auto max-w-lg px-4 py-16 text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-teal-700" /><h1 className="mt-3 font-display text-3xl font-bold">You’re booked</h1>
    <p className="mt-2">Reference ID</p><p className="font-mono text-2xl font-bold">{done.referenceId}</p><p className="mt-2 text-slate-600">{doc.name} · {done.date} at {done.timeSlot}. We will confirm shortly.</p>
    <Link to="/" className="btn mt-6">Back to home</Link></div>);
  return (<form onSubmit={submit} className="mx-auto max-w-2xl space-y-4 px-4 py-10"><h1 className="font-display text-3xl font-bold">Book an appointment</h1>
    <label className="block text-sm font-medium">Department<select className="input mt-1" value={f.department} onChange={set('department')}><option value="">All departments</option>{deps.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}</select></label>
    <label className="block text-sm font-medium">Doctor *<select className="input mt-1" required value={f.doctor} onChange={set('doctor')}><option value="">Select a doctor</option>{docs.map((d) => <option key={d._id} value={d._id}>{d.name} – {d.specialty}</option>)}</select></label>
    {doc && <Field label="Date *" type="date" min={today} required value={f.date} onChange={set('date')} />}
    {doc && f.date && (dayOk ? <fieldset><legend className="text-sm font-medium">Time slot *</legend><div className="mt-1 flex flex-wrap gap-2">{doc.timeSlots.map((s) => { const taken = booked.includes(s);
      return <button type="button" key={s} disabled={taken} aria-pressed={f.timeSlot === s} onClick={() => setF({ ...f, timeSlot: s })} className={`rounded-lg border px-3 py-2 ${f.timeSlot === s ? 'border-teal-700 bg-teal-700 text-white' : 'bg-white'} disabled:bg-slate-100 disabled:text-slate-400 disabled:line-through`}>{s}</button>; })}</div></fieldset>
      : <p className="text-amber-800">This doctor is available on {doc.availableDays.join(', ')}. Please pick one of those days.</p>)}
    <Field label="Full name *" required value={f.patientName} onChange={set('patientName')} /><Field label="Email *" type="email" required value={f.patientEmail} onChange={set('patientEmail')} />
    <Field label="Phone *" type="tel" required value={f.patientPhone} onChange={set('patientPhone')} />
    <label className="block text-sm font-medium">Reason for visit<textarea className="input mt-1" rows="3" value={f.reason} onChange={set('reason')} /></label>
    <button className="btn w-full" disabled={busy}>{busy ? 'Booking…' : 'Confirm booking'}</button></form>);
}
