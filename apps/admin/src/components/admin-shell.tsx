import Link from 'next/link';

const navigation = [
  ['Overview', '/dashboard'],
  ['Accounts', '/dashboard/accounts'],
  ['Workers', '/dashboard/workers'],
  ['Bookings', '/dashboard/bookings'],
  ['Finance', '/dashboard/finance'],
  ['Support', '/dashboard/support'],
  ['Communication', '/dashboard/communication'],
  ['Reports', '/dashboard/reports'],
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
      <main className="main">{children}</main>
    </div>
  );
}
