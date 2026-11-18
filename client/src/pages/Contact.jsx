import { useState } from 'react'; import toast from 'react-hot-toast'; import { MapPin, Clock, Phone } from 'lucide-react'; import api, { errMsg } from '../api'; import { Field } from '../ui';
export default function Contact() {
  const empty = { name: '', email: '', phone: '', subject: '', message: '' }; const [f, setF] = useState(empty); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => { e.preventDefault(); setBusy(true); try { toast.success((await api.post('/contact', f)).data.message); setF(empty); } catch (er) { toast.error(errMsg(er)); } setBusy(false); };
  return (<div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2"><div><h1 className="font-display text-3xl font-bold">About CareFirst</h1>
    <p className="mt-3 text-slate-700">Our mission is to deliver compassionate, evidence-based care to every patient, supported by advanced medicine and a team that listens.</p>
    <ul className="mt-6 space-y-3"><li className="flex gap-2"><Clock className="text-teal-700" />Visiting hours: daily 10 AM – 8 PM</li><li className="flex gap-2"><MapPin className="text-teal-700" />100 Health Avenue, Springfield (main entrance on Oak Street)</li>
      <li className="flex gap-2"><Phone className="text-red-700" />Emergency: +1 (800) 555-0199</li></ul></div>
    <form onSubmit={submit} className="card space-y-3"><h2 className="text-xl font-semibold">Contact us</h2><Field label="Name *" required value={f.name} onChange={set('name')} /><Field label="Email *" type="email" required value={f.email} onChange={set('email')} />
      <Field label="Phone" value={f.phone} onChange={set('phone')} /><Field label="Subject" value={f.subject} onChange={set('subject')} />
      <label className="block text-sm font-medium">Message *<textarea className="input mt-1" rows="4" required value={f.message} onChange={set('message')} /></label><button className="btn w-full" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button></form></div>);
}
