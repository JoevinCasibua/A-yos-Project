import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="login-shell">
      <section className="login-card">
        <span className="eyebrow">404</span>
        <h2>Page not found</h2>
        <p className="lede">The requested administration route does not exist.</p>
        <Link className="button" href="/dashboard">
          Return to dashboard
        </Link>
      </section>
    </main>
  );
}
