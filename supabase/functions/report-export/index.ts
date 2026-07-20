import { adminClient, requireAccount } from '../_shared/auth.ts';
import { json, options } from '../_shared/http.ts';

const reportTables = {
  bookings: 'bookings',
  transactions: 'payments',
  users: 'accounts',
  workers: 'worker_profiles',
} as const;
function csv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return '';
  const columns = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const raw = String(value ?? '');
    const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return [
    columns.map(escape).join(','),
    ...rows.map((row) => columns.map((column) => escape(row[column])).join(',')),
  ].join('\n');
}

Deno.serve(async (request) => {
  const preflight = options(request);
  if (preflight) return preflight;
  let exportId: string | undefined;
  try {
    const { account } = await requireAccount(request, 'ADMIN', true);
    const body = (await request.json()) as { reportType?: keyof typeof reportTables };
    if (!body.reportType || !reportTables[body.reportType])
      return json({ error: { code: 'VALIDATION_FAILED', message: 'Invalid report type.' } }, 400);
    const admin = adminClient();
    const { data: exportRow, error: createError } = await admin
      .from('report_exports')
      .insert({ report_type: body.reportType, requested_by: account.id, status: 'PROCESSING' })
      .select()
      .single();
    if (createError) throw createError;
    exportId = exportRow.id;
    const { data, error } = await admin
      .from(reportTables[body.reportType])
      .select('*')
      .limit(10000);
    if (error) throw error;
    const path = `admin/${account.id}/${exportRow.id}.csv`;
    const { error: uploadError } = await admin.storage
      .from('report-exports')
      .upload(path, csv((data ?? []) as Record<string, unknown>[]), {
        contentType: 'text/csv',
        upsert: false,
      });
    if (uploadError) throw uploadError;
    const { error: completionError } = await admin
      .from('report_exports')
      .update({ status: 'COMPLETED', storage_path: path, completed_at: new Date().toISOString() })
      .eq('id', exportRow.id);
    if (completionError) throw completionError;
    return json({ id: exportRow.id, status: 'COMPLETED', storagePath: path }, 201);
  } catch (error) {
    const code = error instanceof Error ? error.message : 'INTERNAL_ERROR';
    if (exportId) {
      await adminClient()
        .from('report_exports')
        .update({ status: 'FAILED', failure_reason: 'Report generation failed.' })
        .eq('id', exportId);
    }
    const status =
      code === 'UNAUTHENTICATED'
        ? 401
        : code === 'FORBIDDEN' || code === 'MFA_REQUIRED'
          ? 403
          : 500;
    return json(
      {
        error: {
          code,
          message:
            status === 500
              ? 'Report generation failed.'
              : 'Administrator authorization is required.',
        },
      },
      status,
    );
  }
});
