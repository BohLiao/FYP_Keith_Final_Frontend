import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../LandingPage.css";

const cryptoCards = [
  {
    title: "Post-Quantum Safety",
    text:
      "Kyber (lattice-based) resists quantum factoring attacks like Shor’s. Selected by NIST for standardization and designed for a post-quantum world.",
  },
  {
    title: "High-Speed Encryption",
    text:
      "AES-256 is battle-tested and efficient. With Grover’s algorithm in mind, its key length keeps it robust while delivering excellent performance.",
  },
  {
    title: "Why Combine Both?",
    text:
      "Kyber secures the handshake (key exchange). AES encrypts all data in motion. Together: future-proof security with real-world speed.",
  },
];

const slideVariants = {
  initial: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  animate: { x: 0, opacity: 1, transition: { duration: 0.45 } },
  exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0, transition: { duration: 0.45 } }),
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".scroll-animate").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setIndex((p) => (p + 1) % cryptoCards.length);
  };
  const prevSlide = () => {
    setDirection(-1);
    setIndex((p) => (p - 1 + cryptoCards.length) % cryptoCards.length);
  };

  const teamRoles = {
    Keith: "Lead Developer",
    Cadence: "Assistant Developer",
    Wunglai: "Tester & Kahoot",
    Wanyan: "Slides & Documentation",
  };

  const renderAtom = (color) => (
    <svg width="108" height="108" viewBox="0 0 120 120" className="animated-atom" aria-hidden="true">
      <circle cx="60" cy="60" r="6" fill={color} className="glow-nucleus" />
      <g className="orbit-group">
        <ellipse cx="60" cy="60" rx="40" ry="15" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="100" cy="60" r="5" fill={color} className="electron" />
      </g>
      <g className="orbit-group delay">
        <ellipse cx="60" cy="60" rx="40" ry="15" fill="none" stroke={color} strokeWidth="1" transform="rotate(60 60 60)" />
        <circle cx="100" cy="60" r="5" fill={color} className="electron" />
      </g>
      <g className="orbit-group delay-2">
        <ellipse cx="60" cy="60" rx="40" ry="15" fill="none" stroke={color} strokeWidth="1" transform="rotate(-60 60 60)" />
        <circle cx="100" cy="60" r="5" fill={color} className="electron" />
      </g>
    </svg>
  );

  return (
    <div className="landing-page dark-theme">
      <nav className="sticky-nav">
        {["what", "why", "flow", "info", "slides", "kahoot", "media", "test", "faq", "team"].map((id) => {
          const labels = { what: "What", why: "Why", flow: "AES + Kyber Flow", media: "Poster & Video", faq: "FAQ" };
          return (
            <a href={`#${id}`} key={id}>
              {labels[id] || id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          );
        })}
      </nav>

      <header className="hero-header animate-fade">
        <h1 className="brand-title">SPECTRALINK</h1>
        <p className="tagline">Quantum-Safe Messaging with Kyber + AES</p>
        <div className="cta-buttons">
          <button onClick={() => navigate("/login")} className="primary-button">
            Login
          </button>
          <button onClick={() => navigate("/register")} className="secondary-button">
            Register
          </button>
        </div>
      </header>

      <main className="content">
        {/* What */}
        <section id="what" className="scroll-animate animate-fade">
          <h2>What Is Quantum Computing?</h2>
          <div className="neon-box">
            <div className="info-grid">
              <div className="info-card">
                <h3>Qubits & Superposition</h3>
                <p>Qubits can be 0 and 1 at once, exploring many possibilities in parallel for certain problems.</p>
              </div>
              <div className="info-card">
                <h3>Entanglement</h3>
                <p>Entangled qubits behave as one system. Correlations enable algorithmic speedups classical systems can’t match.</p>
              </div>
              <div className="info-card">
                <h3>Interference</h3>
                <p>Algorithms amplify correct paths and cancel wrong ones—core to quantum advantage.</p>
              </div>
            </div>
          </div>
          <div className="mini-cta">
            <a href="#why" className="link-button">Why this matters →</a>
          </div>
        </section>

        {/* Why */}
        <section id="why" className="scroll-animate animate-fade">
          <h2>Why Quantum Computing Matters</h2>
          <ul className="key-benefits">
            <li><strong>Cryptography Impact:</strong> Shor’s threatens RSA/ECC; Grover’s speeds search. We must upgrade crypto.</li>
            <li><strong>Harvest-Now, Decrypt-Later:</strong> Adversaries can store traffic today and decrypt when quantum scales.</li>
            <li><strong>Migration Path:</strong> NIST-selected PQC (like Kyber) lets systems harden now—without waiting for future hardware.</li>
          </ul>
          <div className="mini-cta">
            <a href="#flow" className="link-button">See AES + Kyber flow →</a>
          </div>
        </section>

        {/* Flow */}
        <section id="flow" className="scroll-animate animate-fade">
          <h2>AES + Kyber: From Handshake to Fast Messaging</h2>
          <div className="flow-wrap">
            <div className="flow-step">
              <h4>1) Kyber KEM (Handshake)</h4>
              <p>The client encapsulates to the server’s Kyber public key. Both sides derive a shared secret (quantum-resistant).</p>
              <a className="mini-link" href="#info">Why combine both?</a>
            </div>
            <div className="flow-arrow">➜</div>
            <div className="flow-step">
              <h4>2) Key Derivation</h4>
              <p>The shared secret is turned into a session key via a KDF. No long-term secret is exposed on the wire.</p>
              <a className="mini-link" href="#slides">View slides</a>
            </div>
            <div className="flow-arrow">➜</div>
            <div className="flow-step">
              <h4>3) AES-256 (Data Channel)</h4>
              <p>Payloads are encrypted efficiently (e.g., AES-GCM). AES-256 remains robust against Grover’s due to key size.</p>
              <a className="mini-link" href="#test">Run tests</a>
            </div>
          </div>
        </section>

        {/* Slideshow */}
        <section id="info" className="crypto-section slideshow">
          <h2 className="section-title">Why Kyber + AES?</h2>
          <div className="slide-container">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={index}
                className="crypto-card"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h3>{cryptoCards[index].title}</h3>
                <p>{cryptoCards[index].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="slide-buttons">
            <button onClick={prevSlide}>&larr; Prev</button>
            <button onClick={nextSlide}>Next &rarr;</button>
          </div>
        </section>

        {/* Slides */}
        <section id="slides" className="scroll-animate animate-slide">
          <h2>Download Slides</h2>
          <div className="card-row">
            <a href="/frontend/public/assets/intro.pptx" download className="download-card">
              {renderAtom("#00ffe7")}
              <span>Intro to QC</span>
            </a>
            <a href="/frontend/public/assets/PQC.pptx" download className="download-card">
              {renderAtom("#d94fff")}
              <span>PQC & Use Cases</span>
            </a>
            <a href="/frontend/public/assets/Algorithms & Encryption.pptx" download className="download-card">
              {renderAtom("#00aaff")}
              <span>QC Algorithms</span>
            </a>
            <a href="/frontend/public/assets/models.pptx" download className="download-card">
              {renderAtom("#ffaa33")}
              <span>QC Models</span>
            </a>
          </div>
        </section>

        {/* Kahoot */}
        <section id="kahoot" className="scroll-animate animate-slide">
          <h2>Open Kahoot</h2>
          <div className="card-row">
            <a href="/backend/public/assets/Introduction to Quantum Computing.pdf" download className="download-card">
              {renderAtom("#00ffe7")}
              <span>Intro to QC</span>
            </a>
            <a href="/backend/public/assets/PQC & Cybersecurity Use Cases.pdf" download className="download-card">
              {renderAtom("#d94fff")}
              <span>PQC & Use Cases</span>
            </a>
            <a href="/backend/public/assets/Quantum Algorithms & Cryptographic Impact.pdf" download className="download-card">
              {renderAtom("#00aaff")}
              <span>QC Algorithms</span>
            </a>
            <a href="/backend/public/assets/Quantum Computing Models.pdf" download className="download-card">
              {renderAtom("#ffaa33")}
              <span>QC Models</span>
            </a>
          </div>
        </section>

        {/* Poster & Video */}
        <section id="media" className="scroll-animate animate-slide">
          <h2>Poster & Demo Video</h2>
          <div className="media-grid">
            <div className="media-card">
              <details className="dropdown">
                <summary className="dropdown-title">📌 View Project Poster</summary>
                <img
                  src="/backend/public/assets/poster.jpg"
                  alt="Quantum Poster"
                  className="portrait-image neon-glow"
                  style={{ marginTop: "1rem", maxWidth: "100%", borderRadius: "8px" }}
                />
              </details>
            </div>
            <div className="media-card">
              <details className="dropdown">
                <summary className="dropdown-title">🎬 Watch Demo Video</summary>
                <div className="video-wrapper neon-glow" style={{ marginTop: "1rem", borderRadius: "8px", overflow: "hidden" }}>
                  <video
                    controls
                    playsInline
                    poster="/backend/public/assets/demo_thumbnail.jpg"
                    onLoadedData={(e) => e.target.parentElement.classList.remove("loading")}
                    style={{ width: "100%" }}
                  >
                    <source src="/backend/public/assets/demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Tests + Labs */}
        <section id="test" className="scroll-animate animate-slide">
          <h2>Benchmark Tests</h2>
          <p className="test-description" style={{ marginBottom: "1.25rem" }}>
            Compare encryption performance and simulate brute-force behavior in real time.
          </p>
          <div className="test-buttons" style={{ marginBottom: "1rem" }}>
            <button onClick={() => navigate("/test1")} className="primary-button no-emoji">
              Run Encryption Test
            </button>
            <button onClick={() => navigate("/test2")} className="primary-button no-emoji" style={{ marginLeft: "1rem" }}>
              Simulate Brute Force
            </button>
          </div>

          {/* ✅ NEW: Lab downloads linked to the benchmarking topic */}
          <div className="card-row" style={{ marginTop: "1rem" }}>
            <a href="/backend/public/assets/Lab1_Benchmark_Setup.pdf" download className="download-card" title="Download Lab 1 (Benchmark Setup)">
              {renderAtom("#00ffe7")}
              <span>Download Lab 1</span>
            </a>
            <a href="/backend/public/assets/Lab2_Performance_Analysis.pdf" download className="download-card" title="Download Lab 2 (Performance Analysis)">
              {renderAtom("#d94fff")}
              <span>Download Lab 2</span>
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="faq-section scroll-animate animate-fade">
          <h2>FAQ</h2>
          <div className="faq">
            <div className="faq-item">
              <h4>1) Why not RSA or ECC?</h4>
              <p>They’re vulnerable to Shor’s algorithm and no longer safe long-term in a quantum era.</p>
            </div>
            <div className="faq-item">
              <h4>2) Is AES Quantum-Safe?</h4>
              <p>AES-256 remains strong; Grover’s algorithm is mitigated by its key length.</p>
            </div>
            <div className="faq-item">
              <h4>3) What is Hybrid Encryption?</h4>
              <p>Kyber protects the key exchange; AES protects the data. Security + speed.</p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="team-section scroll-animate animate-fade">
          <h2>Meet the Developers</h2>
          <div className="team-cards">
            {Object.entries(teamRoles).map(([name, role]) => (
              <div className="card" key={name}>
                <img src="/backend/public/assets/OIP.jpeg" alt={name} />
                <h3>{name}</h3>
                <p>{role}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer scroll-animate animate-fade">
          <p>© 2025 Spectralink · Quantum-Safe Messaging</p>
        </footer>
      </main>
    </div>
  );
}
