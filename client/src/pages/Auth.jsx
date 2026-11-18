import { useState } from 'react'; import { Link, useNavigate } from 'react-router-dom'; import toast from 'react-hot-toast'; import api, { errMsg } from '../api'; import { useAuth, Field } from '../ui';
export default function Auth({ register }) {
  const { login } = useAuth(); const nav = useNavigate(); const [f, setF] = useState({ name: '', email: '', phone: '', password: '' }); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => { e.preventDefault(); setBusy(true);
    try { const { data } = await api.post(register ? '/auth/register' : '/auth/login', f); login(data); toast.success('Welcome, ' + data.user.name); nav(data.user.role === 'admin' ? '/admin' : '/dashboard'); }
    catch (er) { toast.error(errMsg(er)); } setBusy(false); };
  return (<form onSubmit={submit} className="card mx-auto my-12 max-w-md space-y-4"><h1 className="font-display text-2xl font-bold">{register ? 'Create your account' : 'Log in'}</h1>
    {register && <><Field label="Full name *" required value={f.name} onChange={set('name')} /><Field label="Phone" value={f.phone} onChange={set('phone')} /></>}
    <Field label="Email *" type="email" required value={f.email} onChange={set('email')} /><Field label="Password *" type="password" minLength={6} required value={f.password} onChange={set('password')} />
    <button className="btn w-full" disabled={busy}>{busy ? 'Please wait…' : register ? 'Sign up' : 'Log in'}</button>
    <p className="text-center text-sm">{register ? <>Have an account? <Link className="text-teal-800 underline" to="/login">Log in</Link></> : <>New here? <Link className="text-teal-800 underline" to="/register">Create an account</Link></>}</p></form>);
}
