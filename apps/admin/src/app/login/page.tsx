import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <h1>A-YOS</h1>
            <p>Administrator access</p>
          </div>
        </div>
        <h2 style={{ fontSize: 30 }}>Welcome back</h2>
        <p className="lede">
          Sign in with the protected administrator account configured during deployment.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
