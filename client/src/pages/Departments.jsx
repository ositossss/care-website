import { useEffect, useState } from 'react'; import api from '../api'; import { Spinner } from '../ui';
export default function Departments() {
  const [d, setD] = useState(null); useEffect(() => { api.get('/departments').then((r) => setD(r.data)); }, []);
  return (<div className="mx-auto max-w-6xl px-4 py-10"><h1 className="mb-6 font-display text-3xl font-bold">Departments & services</h1>{!d ? <Spinner /> :
    <div className="grid gap-4 md:grid-cols-2">{d.map((x) => <section key={x._id} className="card"><h2 className="text-xl font-semibold">{x.name}</h2><p className="text-slate-600">{x.description}</p>
      <ul className="mt-3 list-disc pl-5">{x.services.map((s) => <li key={s}>{s}</li>)}</ul></section>)}</div>}</div>);
}
