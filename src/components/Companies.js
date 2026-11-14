"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const result = await api.companies();
    setCompanies(result.data.companies);
  }

  useEffect(() => { load().catch((e) => setError(e.message)); }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    try {
      await api.createCompany({ name });
      setName("");
      setNotice("Company added successfully.");
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return <>
    <section className="panel" style={{ maxWidth: 760 }}>
      <h3>Add company</h3>
      <p className="muted">Add a company here to make it available when creating customer accounts.</p>
      {error && <p className="notice">{error}</p>}
      {notice && <p className="notice success">{notice}</p>}
      <form onSubmit={submit} className="form-grid">
        <div className="field full"><label htmlFor="company-name">Company name</label><input id="company-name" required maxLength={150} value={name} onChange={(event) => setName(event.target.value)} /></div>
        <button className="button" disabled={saving}>{saving ? "Adding…" : "Add company"}</button>
      </form>
    </section>
    <section className="panel">
      <h3>Companies</h3>
      <div className="table-wrap"><table><thead><tr><th>Company</th><th>Added</th></tr></thead><tbody>
        {companies.length ? companies.map((company) => <tr key={company.id}><td>{company.name}</td><td>{new Date(company.createdAt).toLocaleDateString()}</td></tr>) : <tr><td colSpan="2" className="muted">No companies yet.</td></tr>}
      </tbody></table></div>
    </section>
  </>;
}
