"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

const initialForm = { customerId: "", subject: "", category: "TECHNICAL", priority: "MEDIUM", description: "" };

export default function AdminCreateTicket() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const first = await api.customers({ limit: 50, page: 1, status: "ACTIVE" });
        let all = first.data;
        for (let page = 2; page <= first.pagination.pages; page += 1) {
          const next = await api.customers({ limit: 50, page, status: "ACTIVE" });
          all = all.concat(next.data);
        }
        setCustomers(all);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingCustomers(false);
      }
    }
    loadCustomers();
  }, []);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const result = await api.createAdminTicket(form);
      router.push(`/admin/tickets/${result.data.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return <section className="panel" style={{ maxWidth: 850 }}>
    <p className="muted">Create a ticket on behalf of an active customer.</p>
    {error && <p className="notice">{error}</p>}
    <form onSubmit={submit} className="form-grid">
      <div className="field full"><label htmlFor="ticket-customer">Customer</label><select id="ticket-customer" name="customerId" required value={form.customerId} onChange={update} disabled={loadingCustomers || customers.length === 0}><option value="">{loadingCustomers ? "Loading customers…" : "Select a customer"}</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.email}</option>)}</select>{!loadingCustomers && customers.length === 0 && <small className="muted">No active customers are available.</small>}</div>
      <div className="field full"><label htmlFor="ticket-subject">Subject</label><input id="ticket-subject" name="subject" required maxLength={255} value={form.subject} onChange={update} placeholder="What can we help with?" /></div>
      <div className="field"><label htmlFor="ticket-category">Category</label><select id="ticket-category" name="category" value={form.category} onChange={update}>{["TECHNICAL", "BILLING", "ACCOUNT", "PRODUCT", "GENERAL", "OTHER"].map((value) => <option key={value}>{value}</option>)}</select></div>
      <div className="field"><label htmlFor="ticket-priority">Priority</label><select id="ticket-priority" name="priority" value={form.priority} onChange={update}>{["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((value) => <option key={value}>{value}</option>)}</select></div>
      <div className="field full"><label htmlFor="ticket-description">Description</label><textarea id="ticket-description" name="description" required maxLength={5000} value={form.description} onChange={update} placeholder="Describe the request or issue." /></div>
      <button className="button" disabled={saving || loadingCustomers || customers.length === 0}>{saving ? "Creating…" : "Create ticket"}</button>
    </form>
  </section>;
}
