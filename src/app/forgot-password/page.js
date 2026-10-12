"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestReset(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.forgotPassword({ email });
      router.push(`/reset-password?email=${encodeURIComponent(response.data.email)}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth">
      <form className="auth-card" onSubmit={requestReset}>
        <Link href="/login" className="auth-back">← Back to sign in</Link>
        <Link href="/" className="brand">ZENTRIX<span>.</span></Link>
        <h2>Forgot your password?</h2>
        <p className="muted">Enter your email to continue to the password-reset screen.</p>
        {error && <p className="notice">{error}</p>}
        <div className="field">
          <label>Email address</label>
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <button className="button" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} disabled={loading}>
          {loading ? "Checking email..." : "Request password reset"}
        </button>
      </form>
    </main>
  );
}
