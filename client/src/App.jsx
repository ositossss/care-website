import { useEffect, useState } from 'react'; import { Routes, Route, Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { Phone, Menu, X, HeartPulse } from 'lucide-react';
import api from './api'; import { AuthCtx, useAuth, Spinner } from './ui';
import Home from './pages/Home'; import Departments from './pages/Departments'; import Doctors from './pages/Doctors'; import Book from './pages/Book';
import Contact from './pages/Contact'; import Auth from './pages/Auth'; import Dashboard from './pages/Dashboard'; import Admin from './pages/Admin';
const HOTLINE = '+1 (800) 555-0199';
function Guard({ role, children }) {
  const { user, ready } = useAuth();
  if (!ready) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
function Layout({ children }) {
  const { user, logout } = useAuth(); const [open, setOpen] = useState(false);
  const links = [['/', 'Home'], ['/departments', 'Departments'], ['/doctors', 'Doctors'], ['/contact', 'About & Contact']];
  const cls = ({ isActive }) => `px-2 py-1 font-medium ${isActive ? 'text-teal-800 underline underline-offset-8' : 'text-slate-700 hover:text-teal-800'}`;
  return (<div className="flex min-h-screen flex-col">
    <div className="bg-red-700 px-4 py-2 text-center text-sm font-semibold text-white"><Phone className="mr-1 inline h-4 w-4" />24/7 Emergency Hotline: <a href="tel:+18005550199" className="underline">{HOTLINE}</a></div>
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"><nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-teal-800"><HeartPulse /> CareFirst</Link>
      <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <div className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-3 border-b bg-white p-4 md:static md:flex md:flex-row md:items-center md:border-0 md:p-0`} onClick={() => setOpen(false)}>
        {links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}
        {user ? <>{<NavLink className={cls} to={user.role === 'admin' ? '/admin' : '/dashboard'}>{user.role === 'admin' ? 'Admin' : 'My Portal'}</NavLink>}<button className="btn-ghost" onClick={logout}>Log out</button></>
          : <Link className="btn-ghost" to="/login">Log in</Link>}
        <Link className="btn" to="/book">Book Appointment</Link>
      </div></nav></header>
    <main className="flex-1">{children}</main>
    <footer className="bg-slate-800 px-4 py-8 text-center text-sm text-slate-300"><p className="font-display text-lg text-white">CareFirst General Hospital</p><p>Compassionate Care, Advanced Medicine</p><p className="mt-2">Emergency: {HOTLINE} · © {new Date().getFullYear()} CareFirst</p></footer>
  </div>);
}
export default function App() {
  const [user, setUser] = useState(null); const [ready, setReady] = useState(false); const nav = useNavigate();
  useEffect(() => { if (!localStorage.getItem('token')) return setReady(true);
    api.get('/auth/me').then((r) => setUser(r.data)).catch(() => localStorage.removeItem('token')).finally(() => setReady(true)); }, []);
  const login = ({ token, user }) => { localStorage.setItem('token', token); setUser(user); };
  const logout = () => { localStorage.removeItem('token'); setUser(null); nav('/'); };
  return (<AuthCtx.Provider value={{ user, setUser, ready, login, logout }}><Layout><Routes>
    <Route path="/" element={<Home />} /><Route path="/departments" element={<Departments />} /><Route path="/doctors" element={<Doctors />} />
    <Route path="/book" element={<Book />} /><Route path="/contact" element={<Contact />} /><Route path="/login" element={<Auth />} /><Route path="/register" element={<Auth register />} />
    <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} /><Route path="/admin" element={<Guard role="admin"><Admin /></Guard>} />
    <Route path="*" element={<p className="p-16 text-center">Page not found.</p>} /></Routes></Layout></AuthCtx.Provider>);
}
