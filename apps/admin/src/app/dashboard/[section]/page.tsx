import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  createNotification,
  generateReport,
  moderateReview,
  restoreTrash,
  reviewWorker,
  setWorkerPriority,
  setAccountStatus,
  transitionBooking,
  updateTicket,
  upsertCategory,
} from '../actions';

const sections = {
  accounts: ['Account management', 'Review account roles and suspension state.', 'accounts'],
  workers: [
    'Worker verification',
    'Review identity and professional submissions.',
    'worker_verifications',
  ],
  bookings: ['Booking operations', 'Inspect and intervene in the canonical lifecycle.', 'bookings'],
  finance: ['Financial management', 'Review cash payments and confirmation state.', 'payments'],
  reviews: ['Review moderation', 'Publish or reject eligible customer feedback.', 'reviews'],
  support: ['Customer support', 'Escalate, resolve, or close support tickets.', 'support_tickets'],
  communication: ['Communication', 'Create and review audience notifications.', 'notifications'],
  services: [
    'Service categories',
    'Create, edit, activate, or deactivate categories.',
    'service_categories',
  ],
  reports: [
    'Business intelligence',
    'Generate and retrieve protected CSV exports.',
    'report_exports',
  ],
  audit: ['Audit log', 'Inspect committed administrator and system actions.', 'audit_logs'],
  trash: [
    'Trash and restore',
    'Restore records; permanent deletion is policy-blocked.',
    'trash_entries',
  ],
} as const;

const bookingNext: Record<string, string | undefined> = {
  PENDING: 'ACCEPTED',
  ACCEPTED: 'WORKER_PREPARING',
  WORKER_PREPARING: 'WORKER_EN_ROUTE',
  WORKER_EN_ROUTE: 'WORKER_ARRIVED',
  WORKER_ARRIVED: 'SERVICE_STARTED',
  SERVICE_STARTED: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
};

function text(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return '—';
}

function titleFor(row: Record<string, unknown>): string {
  return text(
    row.display_name ?? row.email ?? row.title ?? row.subject ?? row.name ?? row.action ?? row.id,
  );
}

function subtitleFor(row: Record<string, unknown>): string {
  return text(
    row.role ?? row.audience ?? row.category ?? row.entity_type ?? row.report_type ?? row.worker_id,
  );
}

function statusFor(row: Record<string, unknown>): string {
  return text(row.status ?? row.approval_status ?? row.moderation_status ?? row.is_active);
}

function RowAction({
  section,
  row,
}: {
  section: keyof typeof sections;
  row: Record<string, unknown>;
}) {
  if (section === 'accounts' && row.role !== 'ADMIN') {
    const nextStatus = row.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    return (
      <form action={setAccountStatus}>
        <input type="hidden" name="accountId" value={text(row.id)} />
        <input type="hidden" name="nextStatus" value={nextStatus} />
        <button className="table-action" type="submit">
          {nextStatus === 'ACTIVE' ? 'Reactivate' : 'Suspend'}
        </button>
      </form>
    );
  }
  if (section === 'workers' && ['PENDING', 'NEEDS_DOCUMENTS'].includes(text(row.status))) {
    return (
      <form action={reviewWorker} className="inline-form">
        <input type="hidden" name="verificationId" value={text(row.id)} />
        <select name="decision" aria-label="Verification decision" defaultValue="APPROVED">
          <option value="APPROVED">Approve</option>
          <option value="NEEDS_DOCUMENTS">Request documents</option>
          <option value="REJECTED">Reject</option>
        </select>
        <input name="notes" aria-label="Review notes" placeholder="Notes" maxLength={2000} />
        <button className="table-action" type="submit">
          Apply
        </button>
      </form>
    );
  }
  if (section === 'workers') {
    return (
      <form action={setWorkerPriority} className="inline-form">
        <input type="hidden" name="workerId" value={text(row.worker_id)} />
        <button className="table-action" name="enabled" value="true">
          Prioritize
        </button>
        <button className="table-action danger-action" name="enabled" value="false">
          Remove priority
        </button>
      </form>
    );
  }
  if (section === 'bookings') {
    const next = bookingNext[text(row.status)];
    if (!next) return <span className="muted">Final state</span>;
    return (
      <form action={transitionBooking}>
        <input type="hidden" name="bookingId" value={text(row.id)} />
        <input type="hidden" name="version" value={text(row.version)} />
        <input type="hidden" name="targetStatus" value={next} />
        <button className="table-action" type="submit">
          Move to {next.replaceAll('_', ' ')}
        </button>
      </form>
    );
  }
  if (section === 'reviews' && row.moderation_status === 'PENDING') {
    return (
      <form action={moderateReview} className="inline-form">
        <input type="hidden" name="reviewId" value={text(row.id)} />
        <button className="table-action" name="decision" value="PUBLISHED">
          Publish
        </button>
        <button className="table-action danger-action" name="decision" value="REJECTED">
          Reject
        </button>
      </form>
    );
  }
  if (section === 'support' && !['RESOLVED', 'CLOSED'].includes(text(row.status))) {
    return (
      <form action={updateTicket} className="inline-form">
        <input type="hidden" name="ticketId" value={text(row.id)} />
        <select name="nextStatus" aria-label="Ticket status" defaultValue="ESCALATED">
          <option value="ESCALATED">Escalate</option>
          <option value="RESOLVED">Resolve</option>
          <option value="CLOSED">Close</option>
        </select>
        <input
          name="resolution"
          aria-label="Resolution"
          placeholder="Resolution"
          maxLength={4000}
        />
        <button className="table-action">Apply</button>
      </form>
    );
  }
  if (section === 'trash' && row.restored_at === null) {
    return (
      <form action={restoreTrash}>
        <input type="hidden" name="trashId" value={text(row.id)} />
        <button className="table-action">Restore</button>
      </form>
    );
  }
  if (section === 'services') {
    return (
      <form action={upsertCategory} className="inline-form">
        <input type="hidden" name="categoryId" value={text(row.id)} />
        <input name="name" aria-label="Category name" defaultValue={text(row.name)} required />
        <input
          name="description"
          aria-label="Category description"
          defaultValue={text(row.description) === '—' ? '' : text(row.description)}
        />
        <input type="hidden" name="isActive" value={row.is_active ? 'off' : 'on'} />
        <button className="table-action">{row.is_active ? 'Deactivate' : 'Activate'}</button>
      </form>
    );
  }
  if (section === 'reports' && row.status === 'COMPLETED' && row.storage_path) {
    return (
      <a className="table-action" href={`/api/reports/${text(row.id)}`}>
        Download CSV
      </a>
    );
  }
  return <span className="muted">View only</span>;
}

function CreatePanel({ section }: { section: keyof typeof sections }) {
  if (section === 'communication') {
    return (
      <section className="card form-card">
        <div>
          <span className="eyebrow">New notification</span>
          <h3>Send or schedule an update</h3>
        </div>
        <form action={createNotification} className="form-grid">
          <label>
            Audience
            <select name="audience" defaultValue="USERS">
              <option>USERS</option>
              <option>WORKERS</option>
              <option>EVERYONE</option>
            </select>
          </label>
          <label>
            Category
            <input name="category" required maxLength={80} placeholder="BOOKING" />
          </label>
          <label className="wide">
            Title
            <input name="title" required maxLength={160} />
          </label>
          <label className="wide">
            Message
            <textarea name="body" required maxLength={4000} rows={4} />
          </label>
          <label>
            Schedule (optional)
            <input name="scheduledAt" type="datetime-local" />
          </label>
          <button className="button" type="submit">
            Create notification
          </button>
        </form>
      </section>
    );
  }
  if (section === 'services') {
    return (
      <section className="card form-card">
        <div>
          <span className="eyebrow">Service catalog</span>
          <h3>Add a category</h3>
        </div>
        <form action={upsertCategory} className="form-grid">
          <label>
            Name
            <input name="name" required minLength={2} maxLength={120} />
          </label>
          <label className="wide">
            Description
            <textarea name="description" maxLength={1000} rows={3} />
          </label>
          <label className="check">
            <input name="isActive" type="checkbox" defaultChecked /> Active
          </label>
          <button className="button" type="submit">
            Add category
          </button>
        </form>
      </section>
    );
  }
  if (section === 'reports') {
    return (
      <section className="card form-card">
        <div>
          <span className="eyebrow">Export</span>
          <h3>Generate a protected CSV report</h3>
        </div>
        <form action={generateReport} className="inline-form">
          <select name="reportType" defaultValue="bookings" aria-label="Report type">
            <option value="bookings">Bookings</option>
            <option value="transactions">Transactions</option>
            <option value="users">Users</option>
            <option value="workers">Workers</option>
          </select>
          <button className="button">Generate report</button>
        </form>
      </section>
    );
  }
  return null;
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: requested } = await params;
  if (!(requested in sections)) notFound();
  const section = requested as keyof typeof sections;
  const [title, description, table] = sections[section];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from(table).select('*').limit(50);
  const rows = (data ?? []) as Record<string, unknown>[];
  return (
    <>
      <header className="topbar">
        <div>
          <span className="eyebrow">Administrator workspace</span>
          <h2>{title}</h2>
          <p className="lede">{description}</p>
        </div>
        <span className="status">Live · RLS protected</span>
      </header>
      <CreatePanel section={section} />
      <section className="card table-card">
        {error ? (
          <p className="error" role="alert">
            Records could not be loaded.
          </p>
        ) : rows.length ? (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Record</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={text(row.id ?? row.key)}>
                    <td>
                      <strong>{titleFor(row)}</strong>
                      <small className="mono">{text(row.id ?? row.key)}</small>
                    </td>
                    <td>{subtitleFor(row)}</td>
                    <td>
                      <span className="badge">{statusFor(row)}</span>
                    </td>
                    <td>{text(row.updated_at ?? row.created_at ?? row.deleted_at)}</td>
                    <td>
                      <RowAction section={section} row={row} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <strong>No records</strong>
            <span>No matching live records are available.</span>
          </div>
        )}
      </section>
      {section === 'trash' ? (
        <p className="policy-note">
          Permanent deletion is disabled until an approved retention policy exists.
        </p>
      ) : null}
    </>
  );
}
