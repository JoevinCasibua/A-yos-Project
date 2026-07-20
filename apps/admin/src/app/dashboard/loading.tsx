export default function DashboardLoading() {
  return (
    <section className="card empty" aria-busy="true">
      <strong>Loading live records…</strong>
      <span>Retrieving authorized platform data.</span>
    </section>
  );
}
