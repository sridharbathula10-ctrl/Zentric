"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function AuthForm({ mode }) {
  const login = mode === "login";
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!login && form.password !== form.confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const response = login ? await api.login(form) : await api.register(form);
      if (login) {
        router.replace(response.data.user.role === "ADMIN" ? "/admin/dashboard" : "/customer/tickets");
      } else {
        router.replace("/login?registered=1");
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth">
      <form className="auth-card" onSubmit={submit}>
        <Link href="/" className="auth-back">← Back to home</Link>
        <Link href="/" className="brand">ZENTRIX<span>.</span></Link>
        <h2>{login ? "Welcome back" : "Create your account"}</h2>
        <p className="muted">{login ? "Sign in to manage your support requests." : "Start a conversation with the Zentrix team."}</p>
        {error && <p className="notice">{error}</p>}
        {!login && <>
          <div className="field"><label>Full name</label><input required name="name" value={form.name} onChange={change} /></div>
          <div className="field"><label>Mobile number</label><input required name="mobile" inputMode="numeric" value={form.mobile} onChange={change} /></div>
        </>}
        <div className="field"><label>Email address</label><input required type="email" name="email" value={form.email} onChange={change} /></div>
        <div className="field password">
          <label>Password</label>
          <input required minLength="8" type={show ? "text" : "password"} name="password" value={form.password} onChange={change} />
          <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
        </div>
        {login && <Link className="auth-forgot" href="/forgot-password">Forgot password?</Link>}
        {!login && <div className="field"><label>Confirm password</label><input required minLength="8" type={show ? "text" : "password"} name="confirm" value={form.confirm} onChange={change} /></div>}
        <button className="button" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} disabled={loading}>
          {loading ? "Please wait..." : login ? "Sign in" : "Create account"}
        </button>
        <p className="muted" style={{ textAlign: "center", marginTop: 22 }}>
          {login ? <>New to Zentrix? <Link className="text-link" href="/register">Create an account</Link></> : <>Already have an account? <Link className="text-link" href="/login">Sign in</Link></>}
        </p>
      </form>
    </main>
  );
}
