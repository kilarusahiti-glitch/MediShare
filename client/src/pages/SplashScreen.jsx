import { useEffect, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;600&family=Playfair+Display:wght@400;500&display=swap');

  .splash-root {
    position: fixed; inset: 0; z-index: 9999;
    background: #f7fafd;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif;
    overflow: hidden;
  }

  .splash-blob-stage { position: absolute; inset: 0; overflow: hidden; }

  .splash-blob {
    position: absolute; border-radius: 50%; filter: blur(72px); opacity: 0;
    animation: splashBlobAppear 1.8s ease forwards;
  }
  .splash-blob-1 {
    width: 520px; height: 520px; background: #c8dff5; top: -120px; left: -100px;
    animation: splashBlobAppear 1.8s ease 0s forwards, splashMorph1 9s ease-in-out 1.8s infinite alternate;
  }
  .splash-blob-2 {
    width: 420px; height: 420px; background: #d6eaf8; bottom: -100px; right: -80px;
    animation: splashBlobAppear 1.8s ease 0.3s forwards, splashMorph2 11s ease-in-out 2.1s infinite alternate;
  }
  .splash-blob-3 {
    width: 300px; height: 300px; background: #b8d4f0; top: 40%; left: 58%;
    animation: splashBlobAppear 1.8s ease 0.6s forwards, splashMorph3 7s ease-in-out 2.4s infinite alternate;
  }

  @keyframes splashBlobAppear {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes splashMorph1 {
    0%   { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; transform: translate(0,0) scale(1); }
    33%  { border-radius: 40% 60% 45% 55% / 60% 40% 60% 40%; transform: translate(30px,20px) scale(1.06); }
    66%  { border-radius: 55% 45% 60% 40% / 40% 55% 45% 60%; transform: translate(-20px,40px) scale(0.97); }
    100% { border-radius: 45% 55% 40% 60% / 55% 45% 55% 45%; transform: translate(10px,-10px) scale(1.03); }
  }
  @keyframes splashMorph2 {
    0%   { border-radius: 50% 50% 60% 40% / 40% 60% 50% 50%; transform: translate(0,0) scale(1); }
    40%  { border-radius: 60% 40% 50% 50% / 55% 45% 65% 35%; transform: translate(-25px,-15px) scale(1.08); }
    80%  { border-radius: 40% 60% 40% 60% / 60% 40% 45% 55%; transform: translate(15px,-30px) scale(0.94); }
    100% { border-radius: 55% 45% 55% 45% / 45% 55% 40% 60%; transform: translate(-10px,10px) scale(1.04); }
  }
  @keyframes splashMorph3 {
    0%   { border-radius: 55% 45% 50% 50% / 50% 55% 45% 50%; transform: translate(0,0) scale(1); }
    50%  { border-radius: 40% 60% 60% 40% / 60% 40% 55% 45%; transform: translate(-20px,25px) scale(1.1); }
    100% { border-radius: 60% 40% 45% 55% / 45% 60% 40% 55%; transform: translate(20px,-20px) scale(0.92); }
  }

  .splash-noise {
    position: absolute; inset: 0; z-index: 1; opacity: 0.025; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  .splash-content {
    position: relative; z-index: 10;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }

  .splash-icon-wrap {
    width: 72px; height: 72px; margin-bottom: 28px;
    opacity: 0; position: relative;
    display: flex; align-items: center; justify-content: center;
    animation: splashIconIn 0.9s cubic-bezier(0.16,1,0.3,1) 1.2s forwards;
  }
  .splash-icon-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 1.5px solid #5b9bd5;
    animation: splashRingPulse 2.4s ease-in-out 2.2s infinite;
  }
  .splash-icon-ring-2 {
    position: absolute; inset: -10px; border-radius: 50%;
    border: 1px solid rgba(91,155,213,0.3);
    animation: splashRingPulse 2.4s ease-in-out 2.6s infinite;
  }
  @keyframes splashRingPulse {
    0%,100% { transform: scale(1); opacity: 1; }
    50%     { transform: scale(1.14); opacity: 0.4; }
  }
  @keyframes splashIconIn {
    from { opacity: 0; transform: scale(0.6) rotate(-15deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }

  .splash-logo-row { display: flex; align-items: baseline; line-height: 1; overflow: hidden; }
  .splash-logo-medi {
    font-family: 'Outfit', sans-serif; font-weight: 600;
    font-size: clamp(3.8rem, 10vw, 8rem); color: #0f2240;
    letter-spacing: -0.02em; opacity: 0; transform: translateX(-30px);
    animation: splashSlideRight 0.85s cubic-bezier(0.16,1,0.3,1) 1.6s forwards;
  }
  .splash-logo-share {
    font-family: 'Outfit', sans-serif; font-weight: 200;
    font-size: clamp(3.8rem, 10vw, 8rem); color: #2e6db4;
    letter-spacing: -0.02em; opacity: 0; transform: translateX(30px);
    animation: splashSlideLeft 0.85s cubic-bezier(0.16,1,0.3,1) 1.8s forwards;
  }
  @keyframes splashSlideRight {
    from { opacity: 0; transform: translateX(-30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes splashSlideLeft {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .splash-tagline {
    font-family: 'Playfair Display', serif; font-weight: 400; font-style: italic;
    font-size: clamp(0.75rem, 1.6vw, 1rem); color: rgba(15,34,64,0.38);
    letter-spacing: 0.06em; margin-top: 14px;
    opacity: 0; animation: splashFadeUp 0.8s ease 2.6s forwards;
  }

  .splash-loader-wrap {
    margin-top: 44px; width: clamp(200px, 30vw, 320px);
    opacity: 0; animation: splashFadeUp 0.6s ease 3.0s forwards;
  }
  .splash-loader-meta {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
  }
  .splash-loader-label {
    font-size: 0.6rem; font-weight: 300; letter-spacing: 0.22em;
    text-transform: uppercase; color: rgba(15,34,64,0.38);
  }
  .splash-loader-pct {
    font-size: 0.65rem; font-weight: 400; letter-spacing: 0.1em; color: #2e6db4;
    font-variant-numeric: tabular-nums;
  }
  .splash-loader-track {
    width: 100%; height: 2px; background: rgba(46,109,180,0.12);
    border-radius: 999px; overflow: hidden;
  }
  .splash-loader-fill {
    height: 100%; width: 0; border-radius: 999px;
    background: linear-gradient(90deg, #1a3a6b, #5b9bd5);
    animation: splashLoadFill 2.4s cubic-bezier(0.4,0,0.2,1) 3.1s forwards;
    box-shadow: 0 0 10px rgba(91,155,213,0.5);
  }
  @keyframes splashLoadFill { to { width: 100%; } }

  .splash-loader-dots { display: flex; justify-content: center; gap: 6px; margin-top: 12px; }
  .splash-loader-dots span {
    width: 4px; height: 4px; border-radius: 50%; background: #a8cef0; opacity: 0.3;
    animation: splashDotBlink 1.2s ease-in-out infinite;
  }
  .splash-loader-dots span:nth-child(1) { animation-delay: 0s; }
  .splash-loader-dots span:nth-child(2) { animation-delay: 0.2s; }
  .splash-loader-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes splashDotBlink {
    0%,100% { opacity: 0.3; transform: scale(1); }
    50%     { opacity: 1;   transform: scale(1.4); }
  }

  @keyframes splashFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .splash-btn {
    margin-top: 36px;
    opacity: 0;
    animation: splashFadeUp 0.7s ease 5.6s forwards;
    padding: 13px 40px;
    font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 600;
    color: #fff; background: #0f2240;
    border: none; border-radius: 999px; cursor: pointer;
    letter-spacing: 0.04em;
    box-shadow: 0 8px 28px rgba(15,34,64,0.18);
    display: inline-flex; align-items: center; gap: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .splash-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 36px rgba(15,34,64,0.26);
  }
  .splash-btn svg { transition: transform 0.2s ease; }
  .splash-btn:hover svg { transform: translateX(3px); }

  .splash-exit {
    animation: splashFadeOut 0.6s ease forwards;
  }
  @keyframes splashFadeOut {
    from { opacity: 1; }
    to   { opacity: 0; pointer-events: none; }
  }
`;

export default function SplashScreen({ onDone }) {
  const pctRef = useRef(null);
  const rootRef = useRef(null);

  const dismiss = () => {
    rootRef.current?.classList.add("splash-exit");
    setTimeout(() => onDone(), 600);
  };

  useEffect(() => {
    const START = 3100, DUR = 2400;
    let t0 = null, rafId;

    const tick = (ts) => {
      if (!t0) t0 = ts;
      const elapsed = ts - t0;
      if (elapsed < START) { rafId = requestAnimationFrame(tick); return; }
      const p = Math.min((elapsed - START) / DUR, 1);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      if (pctRef.current) pctRef.current.textContent = Math.round(e * 100) + "%";
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(rafId); };
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="splash-root" ref={rootRef}>
        <div className="splash-blob-stage">
          <div className="splash-blob splash-blob-1" />
          <div className="splash-blob splash-blob-2" />
          <div className="splash-blob splash-blob-3" />
        </div>
        <div className="splash-noise" />

        <div className="splash-content">
          <div className="splash-icon-wrap">
            <div className="splash-icon-ring" />
            <div className="splash-icon-ring-2" />
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <circle cx="19" cy="19" r="8.5" stroke="#2e6db4" strokeWidth="1.8" fill="none" />
              <rect x="16.5" y="12.5" width="5" height="13" rx="1.5" fill="#2e6db4" opacity="0.9" />
              <rect x="12.5" y="16.5" width="13" height="5" rx="1.5" fill="#2e6db4" opacity="0.9" />
              <line x1="19" y1="2" x2="19" y2="5.5" stroke="#5b9bd5" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <line x1="19" y1="32.5" x2="19" y2="36" stroke="#5b9bd5" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <line x1="2" y1="19" x2="5.5" y2="19" stroke="#5b9bd5" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <line x1="32.5" y1="19" x2="36" y2="19" stroke="#5b9bd5" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>

          <div className="splash-logo-row">
            <span className="splash-logo-medi">Medi</span>
            <span className="splash-logo-share">Share</span>
          </div>

          <p className="splash-tagline">Connecting care, wherever it's needed</p>

          <div className="splash-loader-wrap">
            <div className="splash-loader-meta">
              <span className="splash-loader-label">Loading</span>
              <span className="splash-loader-pct" ref={pctRef}>0%</span>
            </div>
            <div className="splash-loader-track">
              <div className="splash-loader-fill" />
            </div>
            <div className="splash-loader-dots">
              <span /><span /><span />
            </div>
          </div>

          <button className="splash-btn" onClick={() => dismiss()}>
            Get Started
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
