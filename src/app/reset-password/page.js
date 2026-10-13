"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  function submit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setMessage("To protect your account, password changes require a verified reset link sent by email. Email delivery has not been configured yet.");
  }

  return (
    <main className="auth">
      <form className="auth-card" onSubmit={submit}>
        <Link href="/forgot-password" className="auth-back">← Back</Link>
        <Link href="/" className="brand">ZENTRIX<span>.</span></Link>
        <h2>Reset your password</h2>
        <p className="muted">Create a new password for {searchParams.get("email") || "your account"}.</p>
        {message && <p className="notice">{message}</p>}
        <div className="field"><label>New password</label><input required minLength="8" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
        <div className="field"><label>Confirm new password</label><input required minLength="8" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div>
        <button className="button" style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>Reset password</button>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="auth"><div className="auth-card">Loading password reset…</div></main>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
