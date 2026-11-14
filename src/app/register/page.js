import Link from "next/link";

export default function Register() {
  return (
    <main className="auth">
      <section className="auth-card">
        <Link href="/" className="auth-back">← Back to home</Link>
        <Link href="/" className="brand">ZENTRIX<span>.</span></Link>
        <h2>Customer accounts</h2>
        <p className="muted">Customer accounts are created by an administrator. Please contact the ZENTRIX team to get access.</p>
        <Link className="button" href="/#contact" style={{ marginTop: 20 }}>Contact us</Link>
      </section>
    </main>
  );
}
