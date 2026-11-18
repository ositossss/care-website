import { useEffect, useState } from 'react'; import { Link } from 'react-router-dom'; import { User } from 'lucide-react'; import api from '../api'; import { Spinner } from '../ui';
export default function Doctors() {
  const [docs, setDocs] = useState(null); const [deps, setDeps] = useState([]); const [search, setSearch] = useState(''); const [dep, setDep] = useState('');
  useEffect(() => { api.get('/departments').then((r) => setDeps(r.data)); }, []);
  useEffect(() => { const t = setTimeout(() => api.get('/doctors', { params: { search, department: dep } }).then((r) => setDocs(r.data)), 250); return () => clearTimeout(t); }, [search, dep]);
  return (<div className="mx-auto max-w-6xl px-4 py-10"><h1 className="mb-6 font-display text-3xl font-bold">Find a doctor</h1>
    <div className="mb-6 flex flex-col gap-3 sm:flex-row"><input className="input" placeholder="Search by name" aria-label="Search doctors" value={search} onChange={(e) => setSearch(e.target.value)} />
      <select className="input sm:w-64" aria-label="Department" value={dep} onChange={(e) => setDep(e.target.value)}><option value="">All departments</option>{deps.map((x) => <option key={x._id} value={x._id}>{x.name}</option>)}</select></div>
    {!docs ? <Spinner /> : !docs.length ? <p>No doctors match your search. Try a different name or department.</p> :
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{docs.map((x) => <div key={x._id} className="card"><div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100"><User className="text-teal-800" /></div>
        <h2 className="font-semibold">{x.name}</h2><p className="text-teal-800">{x.specialty}</p><p className="text-sm text-slate-600">{x.qualifications} · {x.experienceYears} yrs experience</p>
        <p className="mt-1 text-sm">Available: {x.availableDays.join(', ')}</p><Link to={`/book?doctor=${x._id}`} className="btn mt-3">Book with doctor</Link></div>)}</div>}</div>);
}
