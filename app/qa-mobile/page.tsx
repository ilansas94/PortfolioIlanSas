export default function MobileQaPage({ searchParams }: { searchParams: { raw?: string; case?: string } }) {
  const source = searchParams.case ? `/?qaCase=${encodeURIComponent(searchParams.case)}` : `/?qaRaw=${encodeURIComponent(searchParams.raw || "1.96")}`;

  return (
    <main style={{ minHeight: "100vh", margin: 0, display: "grid", placeItems: "center", background: "#1b1e24", overflow: "auto", padding: 24 }}>
      <div style={{ width: 390, height: 844, flex: "0 0 auto", boxShadow: "0 30px 90px rgba(0,0,0,.65)", background: "#030508" }}>
        <iframe
          title="390 by 844 cinematic portfolio QA"
          src={source}
          width="390"
          height="844"
          style={{ display: "block", border: 0, width: 390, height: 844 }}
        />
      </div>
    </main>
  );
}
