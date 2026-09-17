export default function HomePage({ onStart }) {
  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          zIndex: 0
        }}
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        background: "rgba(0,0,0,0.65)",
        zIndex: 1
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
        padding: "2rem"
      }}>
        <div style={{
          fontSize: "0.85rem",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: "#e94560",
          marginBottom: "1rem",
          fontWeight: "600"
        }}>
          AI-Powered Construction Intelligence
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: "800",
          margin: "0 0 1rem",
          lineHeight: 1.1,
          letterSpacing: "-1px"
        }}>
          Site<span style={{ color: "#e94560" }}>Sentry</span>
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 2vw, 1.3rem)",
          color: "rgba(255,255,255,0.75)",
          maxWidth: "600px",
          lineHeight: 1.6,
          marginBottom: "2.5rem"
        }}>
          Analyze construction project reports with 6 specialist AI agents.
          Get risk scores, compliance checks, and cost benchmarking in under 2 minutes.
        </p>

        <button
          onClick={onStart}
          style={{
            padding: "1rem 2.5rem",
            fontSize: "1rem",
            fontWeight: "700",
            background: "#e94560",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            letterSpacing: "1px",
            textTransform: "uppercase",
            transition: "transform 0.2s",
          }}
          onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        >
          Analyze a Report →
        </button>

        {/* Feature pills */}
        <div style={{
          display: "flex",
          gap: "1rem",
          marginTop: "3rem",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          {["6 AI Agents", "Monte Carlo Simulation", "PDF Annotation", "Cost Benchmarking", "Compliance Check"].map(f => (
            <span key={f} style={{
              padding: "0.4rem 1rem",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "20px",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}