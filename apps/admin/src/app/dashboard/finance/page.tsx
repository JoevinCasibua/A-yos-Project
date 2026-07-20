import { createSupabaseServerClient } from '@/lib/supabase/server';
import { decideRefund } from '../actions';

export default async function FinancePage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: payments, error: paymentError }, { data: refunds, error: refundError }] =
    await Promise.all([
      supabase
        .from('payments')
        .select('*,cash_confirmations(*),receipts(*)')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase.from('refunds').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
  const error = paymentError ?? refundError;
  return (
    <>
      <header className="topbar">
        <div>
          <span className="eyebrow">Financial management</span>
          <h2>Cash transactions</h2>
          <p className="lede">
            Inspect dual Cash confirmations, commission values, receipts, and protected refund
            decisions.
          </p>
        </div>
        <span className="status">Cash only</span>
      </header>
      {error ? <p className="error">Financial records could not be loaded.</p> : null}
      <section className="card table-card">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Payment</th>
                <th>Status</th>
                <th>Service</th>
                <th>Commission</th>
                <th>Confirmations</th>
              </tr>
            </thead>
            <tbody>
              {(payments ?? []).map((payment) => (
                <tr key={payment.id}>
                  <td className="mono">{payment.id}</td>
                  <td>
                    <span className="badge">{payment.status}</span>
                  </td>
                  <td>₱{payment.service_amount.toLocaleString()}</td>
                  <td>
                    ₱{payment.commission_amount.toLocaleString()} ({payment.commission_rate * 100}%)
                  </td>
                  <td>{payment.cash_confirmations.length}/2</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card table-card">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Refund</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(refunds ?? []).map((refund) => (
                <tr key={refund.id}>
                  <td className="mono">{refund.id}</td>
                  <td>
                    <span className="badge">{refund.status}</span>
                  </td>
                  <td>{refund.reason}</td>
                  <td>
                    {refund.status === 'PENDING' ? (
                      <form action={decideRefund} className="inline-form">
                        <input type="hidden" name="refundId" value={refund.id} />
                        <input name="reason" required minLength={3} placeholder="Decision reason" />
                        <button className="table-action" name="decision" value="PROCESSED">
                          Process
                        </button>
                        <button
                          className="table-action danger-action"
                          name="decision"
                          value="REJECTED"
                        >
                          Reject
                        </button>
                      </form>
                    ) : (
                      'Decided'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
