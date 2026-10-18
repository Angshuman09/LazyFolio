"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "6rem", fontWeight: 700, margin: 0 }}>500</h1>
        <h1 style={{ fontSize: "2rem", fontWeight: 600, margin: 0 }}>
          Something went wrong
        </h1>
        <button
          onClick={reset}
          style={{
            borderRadius: "9999px",
            padding: "28px 24px",
            cursor: "pointer",
            border: "none",
            background: "#111",
            color: "#fff",
            fontSize: "1rem",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
