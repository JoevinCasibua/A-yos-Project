import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const sections = {
  accounts: {
    title: 'Account management',
    description: 'Review user and worker profiles and suspension state.',
    table: 'accounts',
  },
  workers: {
    title: 'Worker verification',
    description: 'Review professional verification submissions.',
    table: 'worker_verifications',
  },
  bookings: {
    title: 'Booking operations',
    description: 'Inspect canonical booking lifecycle records.',
    table: 'bookings',
  },
  finance: {
    title: 'Financial management',
    description: 'Review cash confirmations and refund decisions.',
    table: 'payments',
  },
  support: {
    title: 'Customer support',
    description: 'Triage and resolve support tickets.',
    table: 'support_tickets',
  },
  communication: {
    title: 'Communication',
    description: 'Review scheduled and delivered notifications.',
    table: 'notifications',
  },
  reports: {
    title: 'Business intelligence',
    description: 'Review generated report exports.',
    table: 'report_exports',
  },
  settings: {
    title: 'System settings',
    description: 'Manage content and platform settings through protected RPCs.',
    table: 'content_pages',
  },
  trash: {
    title: 'Trash and restore',
    description: 'Restore records; permanent deletion is blocked.',
    table: 'trash_entries',
  },
} as const;

function display(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? String(value)
    : '—';
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!(section in sections)) notFound();
  const item = sections[section as keyof typeof sections];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from(item.table).select('*').limit(50);
  const rows = (data ?? []) as Record<string, unknown>[];
  return (
    <>
      <header className="topbar">
        <div>
          <span className="eyebrow">Administrator workspace</span>
          <h2>{item.title}</h2>
          <p className="lede">{item.description}</p>
        </div>
      </header>
      <section className="card">
        {error ? (
          <p className="error" role="alert">
            Records could not be loaded.
          </p>
        ) : rows.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Record</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={display(row.id ?? row.key)}>
                  <td className="mono">{display(row.id ?? row.key)}</td>
                  <td>{display(row.status ?? row.role)}</td>
                  <td>{display(row.updated_at ?? row.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty">
            <strong>No records</strong>No matching live records are available.
          </div>
        )}
      </section>
    </>
  );
}
