'use client';

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="card empty" role="alert">
      <strong>Action unavailable</strong>
      <span>The request failed or your authorization changed.</span>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
