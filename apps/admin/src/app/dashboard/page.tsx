import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const queries = [
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .not('status', 'in', '(COMPLETED,CANCELLED)'),
    supabase
      .from('worker_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('approval_status', 'PENDING'),
    supabase
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .in('status', ['OPEN', 'ESCALATED']),
    supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'AWAITING_CONFIRMATIONS'),
  ] as const;
  const results = await Promise.all(queries);
  const metrics = [
    ['Open bookings', results[0].count ?? 0],
    ['Pending workers', results[1].count ?? 0],
    ['Open tickets', results[2].count ?? 0],
    ['Cash awaiting confirmation', results[3].count ?? 0],
  ] as const;
  const error = results.find((result) => result.error)?.error;
  return (
    <>
      <header className="topbar">
        <div>
          <span className="eyebrow">Administration</span>
          <h2>Platform overview</h2>
          <p className="lede">Live operational totals from Supabase.</p>
        </div>
        <span className="status">Supabase RLS protected</span>
      </header>
      {error ? (
        <p className="error" role="alert">
          Operational totals could not be loaded.
        </p>
      ) : null}
      <section className="grid">
        {metrics.map(([label, value]) => (
          <article className="card" key={label}>
            <div className="label">{label}</div>
            <div className="metric mono">{value}</div>
            <div className="label">Live records</div>
          </article>
        ))}
      </section>
    </>
  );
}
