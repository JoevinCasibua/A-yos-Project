import Link from 'next/link';

const navigation = [
  ['Overview', '/dashboard'],
  ['Accounts', '/dashboard/accounts'],
  ['Workers', '/dashboard/workers'],
  ['Bookings', '/dashboard/bookings'],
  ['Finance', '/dashboard/finance'],
  ['Reviews', '/dashboard/reviews'],
  ['Support', '/dashboard/support'],
  ['Communication', '/dashboard/communication'],
  ['Services', '/dashboard/services'],
  ['Reports', '/dashboard/reports'],
  ['Audit log', '/dashboard/audit'],
  ['Profile', '/dashboard/profile'],
  ['Settings', '/dashboard/settings'],
  ['Trash', '/dashboard/trash'],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <h1>A-YOS</h1>
            <p>Operations</p>
          </div>
        </div>
        <nav className="nav">
          {navigation.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <form action="/api/auth/sign-out" method="post">
          <button className="button secondary" type="submit">
            Sign out
          </button>
        </form>
      </aside>
      <details className="mobile-navigation">
        <summary>Menu</summary>
        <nav>
          {navigation.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
      </details>
      <main className="main" id="main-content">
        {children}
      </main>
    </div>
  );
}
