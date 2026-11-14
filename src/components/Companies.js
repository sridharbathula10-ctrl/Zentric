"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
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

  function startEditing(company) {
    setError("");
    setNotice("");
    setEditingId(company.id);
    setEditName(company.name);
  }

  async function saveEdit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    try {
      await api.updateCompany(editingId, { name: editName });
      setEditingId(null);
      setNotice("Company updated successfully.");
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeCompany(company) {
    if (!window.confirm(`Delete ${company.name}?`)) return;
    setError("");
    setNotice("");
    setSaving(true);
    try {
      await api.deleteCompany(company.id);
      setNotice("Company deleted successfully.");
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
      <p className="muted">Added companies are available when creating customer accounts.</p>
      {error && <p className="notice">{error}</p>}
      {notice && <p className="notice success">{notice}</p>}
      <form onSubmit={submit} className="form-grid">
        <div className="field full"><label htmlFor="company-name">Company name</label><input id="company-name" required maxLength={150} value={name} onChange={(event) => setName(event.target.value)} /></div>
        <button className="button" disabled={saving}>{saving ? "Adding…" : "Add company"}</button>
      </form>
    </section>
    <section className="panel">
      <h3>Companies</h3>
      <div className="table-wrap"><table><thead><tr><th>Company</th><th>Added</th><th>Actions</th></tr></thead><tbody>
        {companies.length ? companies.map((company) => <tr key={company.id}>
          <td>{editingId === company.id ? <form id={`edit-company-${company.id}`} onSubmit={saveEdit}><input aria-label="Company name" required maxLength={150} value={editName} onChange={(event) => setEditName(event.target.value)} /></form> : company.name}</td>
          <td>{new Date(company.createdAt).toLocaleDateString()}</td>
          <td>{editingId === company.id ? <><button className="text-link" type="submit" form={`edit-company-${company.id}`} disabled={saving}>Save</button> <button className="text-link" type="button" onClick={() => setEditingId(null)} disabled={saving}>Cancel</button></> : <><button className="text-link" type="button" onClick={() => startEditing(company)} disabled={saving}>Edit</button> <button className="text-link" type="button" onClick={() => removeCompany(company)} disabled={saving}>Delete</button></>}</td>
        </tr>) : <tr><td colSpan="3" className="muted">No companies yet.</td></tr>}
      </tbody></table></div>
    </section>
  </>;
}
