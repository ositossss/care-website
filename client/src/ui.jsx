import { createContext, useContext } from 'react'; import { Loader2 } from 'lucide-react';
export const AuthCtx = createContext(null); export const useAuth = () => useContext(AuthCtx);
export const Spinner = () => <div className="flex justify-center py-16" role="status" aria-label="Loading"><Loader2 className="h-8 w-8 animate-spin text-teal-700" /></div>;
export const badge = { pending: 'bg-amber-100 text-amber-900', confirmed: 'bg-teal-100 text-teal-900', completed: 'bg-slate-200 text-slate-800', cancelled: 'bg-slate-100 text-slate-500 line-through' };
export const Badge = ({ s }) => <span className={`rounded-full px-2.5 py-0.5 text-sm font-medium capitalize ${badge[s]}`}>{s}</span>;
export const Field = ({ label, ...p }) => <label className="block text-sm font-medium">{label}<input className="input mt-1" {...p} /></label>;
