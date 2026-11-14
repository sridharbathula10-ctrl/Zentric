"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

const receivedAt = (value) => new Date(value).toLocaleString();
const categoryLabel = (value) => value.replaceAll("_", " ").toLowerCase().replace(/^./, (letter) => letter.toUpperCase());

export function ContactSubmissionList() {
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    api.contactSubmissions({ page }).then((result) => {
      setSubmissions(result.data);
      setPagination(result.pagination);
      setError("");
    }).catch((e) => setError(e.message));
  }, [page]);

  if (error) return <p className="notice">{error}</p>;

  return <section className="panel">
    <h3>Contact submissions</h3>
    <p className="muted">Messages sent through the public contact form.</p>
    <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Category</th><th>Received</th><th></th></tr></thead><tbody>
      {submissions.length ? submissions.map((submission) => <tr key={submission.id}>
        <td>{submission.name}</td><td>{submission.email}</td><td>{categoryLabel(submission.category)}</td><td>{receivedAt(submission.createdAt)}</td>
        <td><Link className="text-link" href={`/admin/contacts/${submission.id}`}>View</Link></td>
      </tr>) : <tr><td colSpan="5" className="muted">No contact submissions yet.</td></tr>}
    </tbody></table></div>
    {pagination && <div className="pagination"><button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>{page} / {Math.max(pagination.pages, 1)}</span><button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next</button></div>}
  </section>;
}

export function ContactSubmissionDetails({ id }) {
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.contactSubmission(id).then((result) => setSubmission(result.data.submission)).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <section className="panel"><p className="notice">{error}</p><Link className="text-link" href="/admin/contacts">Back to contact submissions</Link></section>;
  if (!submission) return <p className="muted">Loading contact submission…</p>;

  return <section className="panel" style={{ maxWidth: 900 }}>
    <div className="panel-head"><div><p className="eyebrow">{categoryLabel(submission.category)}</p><h3>{submission.name}</h3></div><Link className="text-link" href="/admin/contacts">All contact submissions</Link></div>
    <div className="ticket-meta">
      <div><small>Email</small><a className="text-link" href={`mailto:${submission.email}`}>{submission.email}</a></div>
      <div><small>Phone</small>{submission.mobile || "Not provided"}</div>
      <div><small>Received</small>{receivedAt(submission.createdAt)}</div>
    </div>
    <div className="contact-submission-message"><h4>Message</h4><p>{submission.message}</p></div>
  </section>;
}
