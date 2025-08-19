import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import '../LandingPage.css';

const cryptoData = [
  { name: 'AES', speed: 95, keySize: 256, secure: '✅' },
  { name: 'Kyber', speed: 88, keySize: 1536, secure: '✅✅' },
  { name: 'ECC', speed: 70, keySize: 256, secure: '❌' },
  { name: 'RSA', speed: 60, keySize: 2048, secure: '❌' },
];

const cryptoCards = [
  {
    title: "Post-Quantum Safety",
    text: "Kyber uses lattice-based cryptography to withstand quantum decryption algorithms like Shor’s. It’s NIST-selected and built for a post-quantum future."
  },
  {
    title: "High-Speed Encryption",
    text: "AES-256 is fast, reliable, and hardened against quantum attacks via Grover’s algorithm. It secures the actual messages after Kyber handles the key exchange."
  },
  {
    title: "Why Combine Both?",
    text: "Kyber handles the handshake. AES encrypts the message. Together, they offer the perfect balance of future-proof security and blazing performance."
  }
];

const slideVariants = {
  initial: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0, transition: { duration: 0.5 } })
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [hacks, setHacks] = useState([]);
  const [hackCount, setHackCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchHacks = () => {
      fetch('https://api.cybersecurityhub.live/today')
        .then(res => res.json())
        .then(data => {
          const incidents = data.latest || [];
          setHacks(incidents);
          setHackCount(incidents.length);
        })
        .catch(() => {
          setHacks([]);
          setHackCount(0);
        });
    };
    fetchHacks();
    const interval = setInterval(fetchHacks, 30000);
    return () => clearInterval(interval);
  }, []);

  const teamRoles = {
    'Keith': 'Lead Developer',
    'Cadence': 'Assistant Developer',
    'Wunglai': 'Tester & Kahoot',
    'Wanyan': 'Slides & Documentation'
  };

  const renderAnimatedAtom = (colorHex) => (
    <svg width="120" height="120" viewBox="0 0 120 120" className="animated-atom">
      <circle cx="60" cy="60" r="6" fill={colorHex} className="glow-nucleus" />
      <g className="orbit-group">
        <ellipse cx="60" cy="60" rx="40" ry="15" fill="none" stroke={colorHex} strokeWidth="1" />
        <circle cx="100" cy="60" r="5" fill={colorHex} className="electron" />
      </g>
      <g className="orbit-group delay">
        <ellipse cx="60" cy="60" rx="40" ry="15" fill="none" stroke={colorHex} strokeWidth="1" transform="rotate(60 60 60)" />
        <circle cx="100" cy="60" r="5" fill={colorHex} className="electron" />
      </g>
      <g className="orbit-group delay-2">
        <ellipse cx="60" cy="60" rx="40" ry="15" fill="none" stroke={colorHex} strokeWidth="1" transform="rotate(-60 60 60)" />
        <circle cx="100" cy="60" r="5" fill={colorHex} className="electron" />
      </g>
    </svg>
  );

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % cryptoCards.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + cryptoCards.length) % cryptoCards.length);
  };

  return (
    <div className="landing-page dark-theme">
      <div id="particles-js"></div>
      <nav className="sticky-nav">
        {['info', 'chart', 'slides', 'kahoot', 'poster', 'video', 'hacks', 'test', 'faq', 'team'].map(id => {
          const label = (id === 'faq') ? 'FAQ' : id.charAt(0).toUpperCase() + id.slice(1);
          return <a href={`#${id}`} key={id}>{label}</a>;
        })}
      </nav>

      <header className="hero-header animate-fade">
        <h1 className="brand-title">SPECTRALINK</h1>
        <p className="tagline">Quantum-Safe Messaging with Kyber + AES Encryption</p>
        <div className="cta-buttons">
          <button onClick={() => navigate('/login')} className="primary-button">Login</button>
          <button onClick={() => navigate('/register')} className="secondary-button">Register</button>
        </div>
      </header>

      <main className="content">
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

  {/* moved buttons OUTSIDE of slide-container */}
  <div className="slide-buttons">
    <button onClick={prevSlide}>&larr; Prev</button>
    <button onClick={nextSlide}>Next &rarr;</button>
  </div>
</section>

        <section id="slides" className="scroll-animate animate-slide">
          <h2>Download Slides</h2>
          <div className="card-row">
            <a href="/frontend/public/assets/intro.pptx" download className="download-card">
              {renderAnimatedAtom('#00ffe7')}
              <span>Intro to QC</span>
            </a>
            <a href="/frontend/public/assets/PQC.pptx" download className="download-card">
              {renderAnimatedAtom('#d94fff')}
              <span>PQC & Use Cases</span>
            </a>
            <a href="/frontend/public/assets/Algorithms & Encryption.pptx" download className="download-card">
              {renderAnimatedAtom('#00aaff')}
              <span>QC Algorithms</span>
            </a>
            <a href="/frontend/public/assets/models.pptx" download className="download-card">
              {renderAnimatedAtom('#ffaa33')}
              <span>QC Models</span>
            </a>
          </div>
        </section>

           <section id="kahoot" className="scroll-animate animate-slide">
          <h2>Open Kahoot</h2>
          <div className="card-row">
            <a href="/frontend/public/assets/Introduction to Quantum Computing.pdf" download className="download-card">
              {renderAnimatedAtom('#00ffe7')}
              <span>Intro to QC</span>
            </a>
            <a href="/frontend/public/assets/PQC & Cybersecurity Use Cases.pdf" download className="download-card">
              {renderAnimatedAtom('#d94fff')}
              <span>PQC & Use Cases</span>
            </a>
            <a href="/frontend/public/assets/Quantum Algorithms & Cryptographic Impact.pdf" download className="download-card">
              {renderAnimatedAtom('#00aaff')}
              <span>QC Algorithms</span>
            </a>
            <a href="/frontend/public/assets/Quantum Computing Models.pdf" download className="download-card">
              {renderAnimatedAtom('#ffaa33')}
              <span>QC Models</span>
            </a>
          </div>
        </section>

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
        <div
          className="video-wrapper neon-glow"
          style={{ marginTop: "1rem", borderRadius: "8px", overflow: "hidden" }}
        >
          <video
            controls
            playsInline
            poster="/backend/public/assets/demo_thumbnail.jpg"
            onLoadedData={(e) =>
              e.target.parentElement.classList.remove("loading")
            }
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

        <section id="test" className="scroll-animate animate-slide">
          <h2>Benchmark Tests</h2>
          <p className="test-description" style={{marginBottom: '1.5rem'}}>
            Compare encryption performance and simulate brute-force attacks in real-time.
          </p>
          <div className="test-buttons">
            <button onClick={() => navigate('/test1')} className="primary-button no-emoji">Run Encryption Test</button>
            <button onClick={() => navigate('/test2')} className="primary-button no-emoji" style={{marginLeft: '1rem'}}>Simulate Brute Force</button>
          </div>
        </section>

        <section id="faq" className="faq-section scroll-animate animate-fade">
          <h2>FAQ</h2>
          <div className="faq">
            <div className="faq-item">
              <h4>1) Why not RSA or ECC?</h4>
              <p>They are vulnerable to Shor’s algorithm and not safe in a post-quantum era.</p>
            </div>
            <div className="faq-item">
              <h4>2) Is AES Quantum Safe?</h4>
              <p>Yes. AES-256 is resistant to Grover's algorithm due to its key length.</p>
            </div>
            <div className="faq-item">
              <h4>3) What is Hybrid Encryption?</h4>
              <p>It combines Kyber (asymmetric) with AES (symmetric) for speed and quantum safety.</p>
            </div>
          </div>
        </section>

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
          <p>© 2025 Spectralink | Quantum-Safe Messaging Initiative</p>
        </footer>
      </main>
    </div>
  );
}
