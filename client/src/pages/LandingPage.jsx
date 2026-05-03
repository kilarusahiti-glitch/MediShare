import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600;700;800&display=swap";
const MATERIAL_LINK = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";

const T = {
  bg: "#f0f4fb", bgAlt: "#e8eef8",
  navy: "#0f2240", navyMid: "#1a3a6b",
  blue: "#2e6db4", blueSoft: "#5b9bd5",
  sky: "#a8cef0", white: "#ffffff",
  muted: "rgba(15,34,64,0.52)",
};

const GLOBAL_CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Barlow',sans-serif;font-weight:300;background:${T.bg};color:${T.navy};overflow-x:hidden;min-height:100vh;}

  /* Liquid Glass */
  .lg{background:rgba(255,255,255,0.45);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:inset 0 1.5px 1px rgba(255,255,255,0.85),inset 0 -1px 1px rgba(100,140,210,0.12),0 8px 32px rgba(46,109,180,0.10),0 2px 8px rgba(46,109,180,0.06);position:relative;overflow:hidden;border:1px solid rgba(255,255,255,0.65);}
  .lg::before{content:'';position:absolute;inset:0;border-radius:inherit;padding:1.2px;background:linear-gradient(160deg,rgba(255,255,255,0.85) 0%,rgba(180,210,255,0.35) 40%,rgba(255,255,255,0.10) 65%,rgba(200,220,255,0.55) 100%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;}
  .lg-strong{background:rgba(255,255,255,0.62);backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);box-shadow:inset 0 2px 2px rgba(255,255,255,0.9),inset 0 -1px 1px rgba(100,140,210,0.15),0 20px 60px rgba(46,109,180,0.14),0 4px 12px rgba(46,109,180,0.08);position:relative;overflow:hidden;border:1px solid rgba(255,255,255,0.75);}
  .lg-strong::before{content:'';position:absolute;inset:0;border-radius:inherit;padding:1.4px;background:linear-gradient(160deg,rgba(255,255,255,0.95) 0%,rgba(180,210,255,0.40) 40%,rgba(255,255,255,0.08) 65%,rgba(200,220,255,0.65) 100%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;}

  /* Animations */
  @keyframes fadeSlideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes floatY{0%,100%{transform:translateY(0px)}50%{transform:translateY(-10px)}}
  @keyframes morphBlob{0%{border-radius:60% 40% 55% 45%/50% 60% 40% 50%;transform:translate(0,0) scale(1)}50%{border-radius:40% 60% 45% 55%/60% 40% 60% 40%;transform:translate(18px,12px) scale(1.06)}100%{border-radius:55% 45% 60% 40%/40% 55% 45% 60%;transform:translate(-8px,22px) scale(0.97)}}
  @keyframes morphBlob2{0%{border-radius:50% 50% 60% 40%/40% 60% 50% 50%;transform:translate(0,0) scale(1)}50%{border-radius:60% 40% 50% 50%/55% 45% 65% 35%;transform:translate(-18px,-8px) scale(1.08)}100%{border-radius:40% 60% 40% 60%/60% 40% 45% 55%;transform:translate(8px,-18px) scale(0.95)}}
  @keyframes ringPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:0.35}}
  @keyframes scrollLeft{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

  .fade-up{animation:fadeSlideUp 0.75s cubic-bezier(0.16,1,0.3,1) both}
  .float{animation:floatY 5s ease-in-out infinite}
  .d0{animation-delay:0s}.d1{animation-delay:.12s}.d2{animation-delay:.24s}
  .d3{animation-delay:.36s}.d4{animation-delay:.52s}.d5{animation-delay:.68s}

  /* Hover effects */
  .value-card{transition:transform .3s ease,box-shadow .3s ease}
  .value-card:hover{transform:translateY(-6px);box-shadow:0 28px 60px rgba(46,109,180,0.16)!important}
  .portal-card{transition:transform .35s cubic-bezier(.4,0,.2,1);cursor:pointer}
  .portal-card:hover{transform:translateY(-5px) scale(1.012)}
  .portal-card:hover .portal-img{transform:scale(1.06)}
  .portal-img{transition:transform .55s cubic-bezier(.4,0,.2,1)}
  .btn-primary{transition:all .2s ease}
  .btn-primary:hover{transform:translateY(-1px);box-shadow:0 12px 40px rgba(15,34,64,0.28)!important}
  .btn-secondary{transition:all .2s ease}
  .btn-secondary:hover{background:rgba(255,255,255,0.8)!important;transform:translateY(-1px)}
  .nav-link:hover{color:${T.blue}!important}
  .svc-card{flex-shrink:0;width:360px;border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,0.68);background:rgba(255,255,255,0.50);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 8px 32px rgba(46,109,180,0.09);transition:transform .3s,box-shadow .3s;display:flex;flex-direction:column;}
  .svc-card:hover{transform:translateY(-6px);box-shadow:0 24px 56px rgba(46,109,180,0.16)}
  .svc-card-img{width:100%;height:200px;overflow:hidden;flex-shrink:0;}
  .svc-card-img img{width:100%;height:100%;object-fit:cover;filter:brightness(0.88) saturate(0.88);transition:.45s;}
  .svc-card:hover .svc-card-img img{filter:brightness(0.96) saturate(1);transform:scale(1.05)}
  .svc-card-body{padding:24px 22px 22px;display:flex;flex-direction:column;gap:10px;flex:1}
  .svc-scroll-track{display:flex;gap:18px;animation:scrollLeft 38s linear infinite;width:max-content;align-items:stretch;padding:8px 0 16px;}
  .svc-scroll-track:hover{animation-play-state:paused}

  /* Ticker */
  .ticker-track{display:flex;gap:56px;white-space:nowrap;animation:ticker 32s linear infinite;width:max-content;}
  .ticker-item{font-size:11.5px;font-weight:500;letter-spacing:.08em;color:${T.muted};text-transform:uppercase;display:flex;align-items:center;gap:8px;}
  .ticker-item::before{content:'';width:4px;height:4px;border-radius:50%;background:${T.blue};flex-shrink:0;}

  /* Pill Marquee */
  .pill-track{display:flex;gap:10px;animation:scrollLeft 22s linear infinite;width:max-content}
  .mpill{padding:8px 18px;border-radius:9999px;border:1px solid rgba(46,109,180,0.14);background:rgba(255,255,255,0.55);backdrop-filter:blur(8px);font-size:.8rem;font-weight:500;color:${T.muted};white-space:nowrap;display:flex;align-items:center;gap:6px;}
  .mpill::before{content:'';width:5px;height:5px;border-radius:50%;background:${T.blueSoft};opacity:.7;flex-shrink:0}

  /* Image carousel */
  .car-track{display:flex;gap:14px;align-items:flex-end;padding:24px 28px;height:100%;animation:scrollLeft 36s linear infinite;width:max-content;}
  .car-track:hover{animation-play-state:paused}

  /* HIW steps */
  .hiw-step{display:flex;gap:20px;padding:24px 0;border-bottom:1px solid rgba(46,109,180,0.1);cursor:pointer;transition:.3s;}
  .hiw-step:first-child{border-top:1px solid rgba(46,109,180,0.1)}
  .hiw-step.active .step-icon-wrap{background:${T.blue}!important;border-color:${T.blue}!important}
  .hiw-step.active .step-icon{color:#fff!important}
  .hiw-step.active .step-h{color:${T.navy}!important}
  .step-icon-wrap{width:44px;height:44px;flex-shrink:0;border-radius:12px;border:1px solid rgba(46,109,180,0.18);background:rgba(46,109,180,0.07);display:flex;align-items:center;justify-content:center;transition:.3s;}

  /* Benefits grid */
  .benefit{background:rgba(240,244,251,0.95);backdrop-filter:blur(8px);padding:38px 34px;transition:.3s;}
  .benefit:hover{background:rgba(255,255,255,0.9)}

  /* FAQ */
  .faq-item{border-bottom:1px solid rgba(46,109,180,0.1);padding:18px 0;cursor:pointer;}
  .faq-ico{width:20px;height:20px;flex-shrink:0;transition:.3s;color:${T.muted};}
  .faq-item.open .faq-ico{transform:rotate(45deg);color:${T.blue};}
  .faq-a{font-size:.85rem;color:${T.muted};line-height:1.75;max-height:0;overflow:hidden;transition:.35s;padding-right:28px;}
  .faq-item.open .faq-a{max-height:200px;padding-top:10px;}

  /* Service tag / pills */
  .service-tag{display:inline-flex;align-items:center;gap:6px;font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${T.blue};padding:5px 13px;border-radius:9999px;background:rgba(46,109,180,0.08);border:1px solid rgba(46,109,180,0.18);width:fit-content;}
  .spill{font-size:.72rem;font-weight:400;padding:4px 12px;border-radius:9999px;border:1px solid rgba(46,109,180,0.14);color:${T.muted};background:rgba(46,109,180,0.04);}

  /* Testimonials */
  .testi-scroll{display:flex;gap:16px;margin-top:28px;overflow-x:auto;padding-bottom:8px;scrollbar-width:none;}
  .testi-scroll::-webkit-scrollbar{display:none}

  /* Grain */
  .grain{position:fixed;inset:0;pointer-events:none;z-index:200;opacity:0.018;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:128px;}

  /* Scrollbar */
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:${T.bg}}
  ::-webkit-scrollbar-thumb{background:rgba(46,109,180,0.3);border-radius:3px}

  /* Reveal */
  .reveal{opacity:0;transform:translateY(40px) scale(0.85);transition:all .8s cubic-bezier(0.34, 1.56, 0.64, 1)}
  .reveal.visible{opacity:1;transform:translateY(0) scale(1)}

  /* Section */
  .lp-section{padding:48px 0;position:relative;overflow:hidden;border-top:1px solid rgba(46,109,180,0.07)}

  /* About statement */
  .about-statement{font-family:'Barlow',sans-serif;font-size:clamp(1.7rem,3.5vw,2.8rem);font-weight:800;letter-spacing:-1.5px;line-height:1.1;color:${T.navy};}
  .about-statement em{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;color:${T.blue}}

  /* Bento */
  .bento{display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:240px 240px;gap:14px;margin-top:28px}
  @media(max-width:700px){.bento{grid-template-columns:1fr 1fr;grid-template-rows:auto}}

  /* Responsive nav */
  @media(max-width:640px){.hero-btns{flex-direction:column}.hero-btns button{width:100%;justify-content:center}}
  @media(min-width:900px){.hero-grid{grid-template-columns:1fr 1fr!important}}
`;

/* ── Blob background ── */
function BlobBg({ blobs }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: "absolute", width: b.w, height: b.h,
          top: b.top, left: b.left, right: b.right, bottom: b.bottom,
          background: b.color, borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
          filter: `blur(${b.blur ?? 80}px)`, opacity: b.opacity, animation: b.anim,
        }} />
      ))}
    </div>
  );
}

/* ── Medical icon ── */
function MedIcon({ size = 44, color = T.blue }) {
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1.5px solid rgba(91,155,213,0.6)`, animation: "ringPulse 2.4s ease-in-out infinite" }} />
      <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: `1px solid rgba(91,155,213,0.2)`, animation: "ringPulse 2.4s ease-in-out .5s infinite" }} />
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 38 38" fill="none">
        <circle cx="19" cy="19" r="8.5" stroke={color} strokeWidth="1.8" fill="none" />
        <rect x="16.5" y="12.5" width="5" height="13" rx="1.5" fill={color} opacity=".9" />
        <rect x="12.5" y="16.5" width="13" height="5" rx="1.5" fill={color} opacity=".9" />
      </svg>
    </div>
  );
}

/* ── Badge ── */
function Badge({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: ".72rem", fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase",
      color: T.blue, padding: "5px 14px", borderRadius: 9999, marginBottom: "1.1rem",
      background: "rgba(46,109,180,0.09)", border: "1px solid rgba(46,109,180,0.2)",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.blue, animation: "ringPulse 1.8s ease-in-out infinite", display: "inline-block" }} />
      {children}
    </span>
  );
}

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

/* ─────────────────────── SERVICE CARDS DATA ──────────────────────── */
const svcCards = [
  { tag: "Appointments", title: "Seamless scheduling", desc: "Search for trusted doctors and book your visits instantly. Manage your appointments and get automated reminders before every check-up.", pills: ["Instant booking", "Doctor search", "Automated alerts", "Calendar sync"], img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=760&q=80&auto=format&fit=crop" },
  { tag: "Prescriptions", title: "Digital prescription management", desc: "Doctors issue e-prescriptions directly to your MediShare profile. No paper, no loss, no fraud. Instant, verified, and shareable with any pharmacy.", pills: ["E-Prescription", "Digital signature", "Secure storage", "Refill tracking"], img: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=760&q=80&auto=format&fit=crop" },
  { tag: "Records", title: "Unified health records", desc: "All your lab reports, imaging, and clinical notes stored securely in one place. Share with any provider in a single tap. Always with you.", pills: ["Lab reports", "Imaging results", "Clinical notes", "Shareable link"], img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=760&q=80&auto=format&fit=crop" },
  { tag: "Family Care", title: "Family health profiles", desc: "Manage health records, track prescriptions, and book appointments for your kids and aging parents right from your primary dashboard.", pills: ["Multi-profile", "Dependents access", "Centralized care", "Shared dashboard"], img: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=760&q=80&auto=format&fit=crop" },
  { tag: "Diagnostics", title: "Lab test booking & results", desc: "Book diagnostic tests easily through the platform. Results automatically sync to your health profile — ready to share with any doctor.", pills: ["Instant results", "Auto-sync", "Doctor sharing", "Historical trends"], img: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=760&q=80&auto=format&fit=crop" },
  { tag: "Security", title: "Privacy-first architecture", desc: "Your sensitive medical data is encrypted and guarded with state-of-the-art security. You control exactly who views your records.", pills: ["End-to-end encryption", "Access control", "HIPAA compliant", "Audit-ready"], img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=760&q=80&auto=format&fit=crop" },
];

/* ── Single service card ── */
function SvcCard({ card }) {
  return (
    <div className="svc-card">
      <div className="svc-card-img"><img src={card.img} alt={card.title} loading="lazy" /></div>
      <div className="svc-card-body">
        <span className="service-tag">{card.tag}</span>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-.4px", color: T.navy, lineHeight: 1.25 }}>{card.title}</h3>
        <p style={{ fontSize: ".84rem", lineHeight: 1.75, color: T.muted, fontWeight: 300 }}>{card.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
          {card.pills.map(p => <span key={p} className="spill">{p}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ── FAQ data ── */
const FAQS = [
  { q: "What is MediShare and how does it connect patients, doctors, and diagnostic centers?", a: "MediShare is an all-in-one healthcare platform that seamlessly connects patients, doctors, and diagnostic centers. It allows patients to consult doctors, book tests, and share reports, while doctors and labs can manage patients and data efficiently in one place." },
  { q: "How can I book appointments, tests, and consultations in one place?", a: "With MediShare, you can easily search for doctors or diagnostic centers, view availability, and book appointments or tests instantly. Online consultations can also be scheduled with just a few clicks." },
  { q: "Can I securely upload, access, and share medical reports with doctors and labs?", a: "Yes, MediShare allows you to upload your medical reports securely and access them anytime. You can also share them directly with doctors and diagnostic centers for faster and more accurate treatment." },
  { q: "How does MediShare ensure privacy and safety of my health data?", a: "MediShare uses advanced encryption and secure systems to protect your data. Your medical information is only accessible to authorized users, ensuring complete privacy and confidentiality." },
  { q: "How can doctors and diagnostic centers manage appointments, reports, and patients efficiently on MediShare?", a: "Doctors and labs get a dedicated dashboard to manage appointments, access patient records, upload reports, and streamline their workflow, saving time and improving service quality." },
];

/* ── Animated Stat Component ── */
function AnimatedStat({ valueString, trigger }) {
  const [count, setCount] = useState(0);

  const multiplier = valueString.match(/m/i) ? 1000000 : valueString.match(/k/i) ? 1000 : 1;
  const numMatch = valueString.match(/^[0-9.]+/);
  const targetNum = numMatch ? parseFloat(numMatch[0]) * multiplier : 0;
  const suffix = valueString.replace(/^[0-9.]+[mk]?/i, '');

  useEffect(() => {
    if (!trigger || targetNum === 0) return;

    let frame = 0;
    const totalFrames = 60; // 60 frames * 33ms = ~2.0 seconds

    const timer = setInterval(() => {
      frame++;
      // Quadratic ease-out so it finishes boldly without slowing down too heavily at the end
      const easeOut = 1 - Math.pow(1 - frame / totalFrames, 2);
      setCount(Math.floor(targetNum * easeOut));

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(targetNum);
      }
    }, 33);

    return () => clearInterval(timer);
  }, [trigger, targetNum]);

  if (!numMatch || targetNum === 0) return <span>{valueString}</span>;
  if (!trigger) return <span>0{suffix}</span>;
  if (count === targetNum) return <span>{valueString}</span>;

  return <span>{count.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  /* reveal refs */
  const [heroRef, heroVis] = useReveal();
  const [tickerRef, tickerVis] = useReveal();
  const [aboutRef, aboutVis] = useReveal();
  const [valRef, valVis] = useReveal();
  const [statRef, statVis] = useReveal();
  const [svcRef, svcVis] = useReveal();
  const [portRef, portVis] = useReveal();
  const [testiRef, testiVis] = useReveal();
  const [faqRef, faqVis] = useReveal();
  const [ctaRef, ctaVis] = useReveal();

  /* Testimonials */
  const testis = [
    { q: "Managing my father's prescriptions across three doctors was a nightmare. MediShare solved it in one day.", av: "RK", name: "Riya Kapoor", role: "Patient · Hyderabad" },
    { q: "As a cardiologist, I now share post-visit notes and prescriptions instantly. Patient compliance has doubled since we joined MediShare.", av: "DS", name: "Dr. Divya Sharma", role: "Cardiologist · Mumbai" },
    { q: "The interface is so clean. I can see all my reports, upcoming appointments, and medicines in one view. Exactly what healthcare needed.", av: "PV", name: "Preethi Venkat", role: "Plus plan · Chennai" },
  ];

  /* Portal cards */
  const portals = [
    { title: "Patients", text: "Manage records, book appointments, and connect with doctors.", img: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=700&q=80&auto=format&fit=crop" },
    { title: "Doctors", text: "Manage your practice, schedule, and patient history seamlessly.", img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=700&q=80&auto=format&fit=crop" },
    { title: "Diagnostic Centers", text: "Update test results and manage appointments efficiently.", img: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=700&q=80&auto=format&fit=crop" },
  ];

  /* nav style helpers */
  const navBtn = { background: "none", border: "none", cursor: "pointer", fontSize: ".85rem", color: T.muted, fontFamily: "'Barlow',sans-serif", padding: "6px 11px" };

  /* Image carousel items */
  const carImgs = [
    { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=480&h=680&q=75&auto=format&fit=crop", cls: "t" },
    { src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=540&q=75&auto=format&fit=crop", cls: "m" },
    { src: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=640&h=480&q=75&auto=format&fit=crop", cls: "w" },
    { src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=480&h=680&q=75&auto=format&fit=crop", cls: "t" },
    { src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=540&q=75&auto=format&fit=crop", cls: "m" },
    { src: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=640&h=480&q=75&auto=format&fit=crop", cls: "w" },
    { src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=480&h=680&q=75&auto=format&fit=crop", cls: "t" },
    { src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=540&q=75&auto=format&fit=crop", cls: "m" },
  ];
  const carDims = { t: { height: 340, width: 240 }, m: { height: 270, width: 200 }, w: { height: 240, width: 320 } };

  const heroBlobs = [
    { w: 520, h: 520, top: "-160px", left: "-120px", color: "#c3daf5", opacity: .7, anim: "morphBlob 16s ease-in-out infinite alternate" },
    { w: 400, h: 400, bottom: "-100px", right: "-80px", color: "#d6eaf8", opacity: .65, anim: "morphBlob2 20s ease-in-out infinite alternate" },
    { w: 280, h: 280, top: "45%", left: "55%", color: "#b8d4f0", opacity: .45, anim: "morphBlob 12s 3s ease-in-out infinite alternate" },
  ];
  const softBlobs = [
    { w: 360, h: 360, top: "-60px", left: "-80px", color: "#d0e6fa", opacity: .6, anim: "morphBlob 18s ease-in-out infinite alternate" },
    { w: 300, h: 300, bottom: "-60px", right: "-60px", color: "#bdd6f2", opacity: .55, anim: "morphBlob2 22s ease-in-out infinite alternate" },
  ];

  /* Ticker items */
  const tickerItems = ["1M+ prescriptions shared", "HIPAA & DPDP compliant", "24/7 telehealth access", "80,000+ active patients", "Instant lab sharing", "Available across India", "ISO 27001 certified"];
  const pillItems = ["E-prescriptions", "Lab report sharing", "HIPAA & DPDP compliant", "Multi-doctor access", "Family health profiles", "Insurance integration", "Medication reminders", "Specialist referrals", "Emergency SOS", "Hindi & regional languages", "Secure cloud storage", "Doctor notes"];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: T.bg, color: T.navy, fontFamily: "'Barlow',sans-serif", fontWeight: 300, overflowX: "hidden" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href={FONT_LINK} />
      <link rel="stylesheet" href={MATERIAL_LINK} />
      <style>{GLOBAL_CSS}</style>

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{ position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 100, animation: "fadeSlideUp .9s cubic-bezier(.16,1,.3,1) both", width: "fit-content" }}>
        <div className="lg" style={{
          borderRadius: 9999, padding: "0 24px", height: 56,
          display: "flex", alignItems: "center", gap: 24,
          boxShadow: scrolled
            ? "inset 0 1.5px 1px rgba(255,255,255,0.85),0 16px 48px rgba(46,109,180,0.18)"
            : "inset 0 1.5px 1px rgba(255,255,255,0.85),0 8px 32px rgba(46,109,180,0.10)",
          transition: "box-shadow .4s ease",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
            <MedIcon size={30} />
            <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontSize: "1.1rem", color: T.navy }}>
              Medi<span style={{ color: T.blue }}>Share</span>
            </span>
          </div>
          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button className="nav-link" style={navBtn} onClick={() => scrollTo("about")}>About</button>
            <button className="nav-link" style={navBtn} onClick={() => scrollTo("services")}>Services</button>
            <button className="nav-link" style={navBtn} onClick={() => scrollTo("faq")}>FAQ</button>
          </div>
          {/* Auth */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <button onClick={() => navigate("/login")} style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(46,109,180,0.25)", borderRadius: 9999, padding: "6px 16px", fontSize: ".8rem", color: T.navy, cursor: "pointer", fontFamily: "'Barlow',sans-serif", transition: "all .2s" }}>Sign In</button>
            <button onClick={() => navigate("/register")} style={{ background: T.navy, border: "none", borderRadius: 9999, padding: "7px 18px", fontSize: ".8rem", color: "#fff", cursor: "pointer", fontFamily: "'Barlow',sans-serif", transition: "all .2s" }}>Get Started</button>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1 }}>

        {/* ══════════ HERO ══════════ */}
        <section style={{ position: "relative", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 0 }}>
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1140, margin: "0 auto", padding: "72px 28px 56px", width: "100%" }}>
            <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 56, alignItems: "center" }}>
              {/* LEFT */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <div className="fade-up d1">
                  <Badge>Now available in India &amp; 15+ countries</Badge>
                </div>
                <div className="fade-up d2">
                  <h1 style={{ fontSize: "clamp(2.6rem,5.5vw,4rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em", color: T.navy, marginBottom: 18, fontFamily: "'Barlow',sans-serif" }}>
                    Unified Healthcare<br />
                    <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", color: T.blue, fontWeight: 400 }}>Experience</span> for Everyone
                  </h1>
                  <p style={{ fontSize: "clamp(1rem,1.8vw,1.1rem)", lineHeight: 1.75, color: T.muted, maxWidth: 480, fontWeight: 300 }}>
                    Seamless healthcare with secure records, expert consultations, and effortless scheduling — all in one beautifully unified platform.
                  </p>
                </div>
                <div className="hero-btns fade-up d2" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                  <button onClick={() => navigate("/register")} className="lg-strong" style={{ borderRadius: 9999, padding: "14px 32px", fontSize: "1rem", fontWeight: 600, color: T.navy, cursor: "pointer", background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 7, fontFamily: "'Barlow',sans-serif", boxShadow: "0 8px 32px rgba(46,109,180,0.14)", border: "none", transition: "all .2s" }}>
                    Get Started Now
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="#0f2240" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <button onClick={() => scrollTo("services")} style={{ background: "rgba(255,255,255,0.38)", border: "1px solid rgba(46,109,180,0.22)", borderRadius: 9999, padding: "14px 32px", fontSize: "1rem", fontWeight: 400, color: T.muted, cursor: "pointer", backdropFilter: "blur(10px)", fontFamily: "'Barlow',sans-serif", transition: "all .2s" }}>View Solutions</button>
                </div>
                <div className="fade-up d3" style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 32 }}>
                  {[["2M+", "Patients"], ["10k+", "Partners"], ["24/7", "Support"], ["98%", "Satisfaction"]].map(([v, l]) => (
                    <div key={l}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: T.navy, letterSpacing: "-.02em", lineHeight: 1.1 }}>{v}</div>
                      <div style={{ fontSize: ".68rem", color: T.muted, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 500, marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT */}
              <div className="fade-up d3 float" style={{ position: "relative" }}>
                <div className="lg-strong" style={{ borderRadius: 28, overflow: "hidden", aspectRatio: "4/3", boxShadow: "0 40px 80px rgba(46,109,180,0.15)" }}>
                  <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=80&auto=format&fit=crop" alt="Doctor with tablet" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 60%)", pointerEvents: "none" }} />
                </div>
                {/* HIPAA chip */}
                <div className="lg-strong" style={{ position: "absolute", bottom: -20, left: -22, borderRadius: 18, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, animation: "floatY 5s 1s ease-in-out infinite" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(46,109,180,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ color: T.blue, fontSize: 19 }}>verified_user</span>
                  </div>
                  <div>
                    <div style={{ fontSize: ".75rem", fontWeight: 700, color: T.navy }}>HIPAA Compliant</div>
                    <div style={{ fontSize: ".65rem", color: T.muted, letterSpacing: ".06em" }}>Certified Security</div>
                  </div>
                </div>
                {/* Active users chip */}
                <div className="lg-strong" style={{ position: "absolute", top: 20, right: -20, borderRadius: 16, padding: "10px 16px", display: "flex", alignItems: "center", gap: 9, animation: "floatY 6s .3s ease-in-out infinite" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "ringPulse 1.5s ease-in-out infinite" }} />
                  <span style={{ fontSize: ".72rem", fontWeight: 600, color: T.navy }}>2M+ Active Users</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ SERVICES (heading + carousel together) ══════════ */}
        <section id="services" style={{ position: "relative", overflow: "hidden", borderTop: "1px solid rgba(46,109,180,0.08)", paddingTop: 36, paddingBottom: 8 }}>
          {/* Heading row */}
          <div ref={svcRef} style={{ maxWidth: 1140, margin: "0 auto", padding: "0 28px 20px" }} className={`reveal ${svcVis ? "visible" : ""}`}>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <Badge>Services</Badge>
              <h2 style={{ fontSize: "clamp(1.3rem,2.5vw,1.9rem)", fontWeight: 800, color: T.navy, letterSpacing: "-.03em", margin: 0, fontFamily: "'Barlow',sans-serif" }}>
                Everything healthcare, <em style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400, color: T.blue }}>under one roof.</em>
              </h2>
              <p style={{ color: T.muted, lineHeight: 1.6, fontSize: ".85rem", margin: 0 }}>From prescriptions to second opinions — MediShare covers every step of the patient journey.</p>
            </div>
          </div>
          {/* Auto-scrolling service card carousel */}
          <div style={{ overflow: "hidden", position: "relative", paddingBottom: 28 }}>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, zIndex: 2, pointerEvents: "none", width: 80, background: `linear-gradient(to right,${T.bg},transparent)` }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, zIndex: 2, pointerEvents: "none", width: 80, background: `linear-gradient(to left,${T.bg},transparent)` }} />
            <div className="svc-scroll-track" style={{ paddingLeft: 28 }}>
              {[...svcCards, ...svcCards].map((c, i) => <SvcCard key={i} card={c} />)}
            </div>
          </div>
        </section>

        {/* ══════════ PILL MARQUEE ══════════ */}
        <div style={{ overflow: "hidden", padding: "20px 0", borderTop: "1px solid rgba(46,109,180,0.08)", borderBottom: "1px solid rgba(46,109,180,0.08)" }}>
          <div className="pill-track">
            {[...pillItems, ...pillItems].map((p, i) => <span key={i} className="mpill">{p}</span>)}
          </div>
        </div>

        {/* ══════════ VALUE PROPS ══════════ */}
        <section id="solutions" className="lp-section">
          <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1 }}>
            <div ref={valRef} style={{ textAlign: "center", marginBottom: 32 }} className={`reveal ${valVis ? "visible" : ""}`}>
              <Badge>Why MediShare</Badge>
              <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontWeight: 800, color: T.navy, letterSpacing: "-.03em", marginBottom: 14, fontFamily: "'Barlow',sans-serif" }}>
                Our <em style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400, color: T.blue }}>Value</em> Propositions
              </h2>
              <p style={{ color: T.muted, maxWidth: 500, margin: "0 auto", lineHeight: 1.75, fontSize: ".95rem" }}>Designed to deliver the best healthcare management experience with modern technology and human-centric design.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
              {[
                { icon: "shield_person", title: "Secure Records", text: "Your data is encrypted and stored following the highest security standards — HIPAA-compliant and audit-ready at all times." },
                { icon: "calendar_month", title: "Easy Scheduling", text: "Book appointments with top-rated medical experts in just a few clicks, anytime and from anywhere in the world." },
                { icon: "medical_services", title: "Expert Consultations", text: "Connect with specialized doctors via seamless video or in-person appointments — entirely on your schedule." },
              ].map((v, i) => (
                <div key={v.title} className={`reveal ${valVis ? "visible" : ""}`} style={{ transitionDelay: `${i * 150}ms`, height: "100%" }}>
                  <div className="value-card lg-strong" style={{ borderRadius: 24, padding: "36px 30px", borderTop: `3px solid ${T.sky}`, height: "100%" }}>
                    <div style={{ width: 50, height: 50, borderRadius: 14, marginBottom: 20, background: "rgba(46,109,180,0.08)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(46,109,180,0.14)" }}>
                      <span className="material-symbols-outlined" style={{ color: T.blue, fontSize: 24 }}>{v.icon}</span>
                    </div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: T.navy, marginBottom: 10 }}>{v.title}</h3>
                    <p style={{ fontSize: ".87rem", lineHeight: 1.75, color: T.muted }}>{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ STATS BAND ══════════ */}
        <section className="lp-section" style={{ padding: "32px 0" }}>
          <div ref={statRef} style={{ maxWidth: 1140, margin: "0 auto", padding: "0 28px" }} className={`reveal ${statVis ? "visible" : ""}`}>
            <div style={{ borderRadius: 28, padding: "36px 40px", background: "linear-gradient(135deg,rgba(15,34,64,0.9) 0%,rgba(46,109,180,0.85) 100%)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", boxShadow: "inset 0 2px 2px rgba(255,255,255,0.12),0 20px 60px rgba(46,109,180,0.18)", border: "1px solid rgba(255,255,255,0.12)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 60, right: 60, height: 1, background: "linear-gradient(to right,transparent,rgba(255,255,255,0.35),transparent)" }} />
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: 40, textAlign: "center", position: "relative", zIndex: 1 }}>
                {[["10k+", "Medical Partners"], ["2M+", "Satisfied Patients"], ["15+", "Countries Served"], ["24/7", "Support System"]].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: "clamp(2.2rem,5vw,3.2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.03em", lineHeight: 1.05 }}>
                      <AnimatedStat valueString={v} trigger={statVis} />
                    </div>
                    <div style={{ fontSize: ".7rem", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", color: T.sky, opacity: .85, marginTop: 6 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ PILL MARQUEE ══════════ */}
        <div style={{ overflow: "hidden", padding: "20px 0", borderTop: "1px solid rgba(46,109,180,0.08)", borderBottom: "1px solid rgba(46,109,180,0.08)" }}>
          <div className="pill-track">
            {[...pillItems, ...pillItems].map((p, i) => <span key={i} className="mpill">{p}</span>)}
          </div>
        </div>

        {/* ══════════ PORTALS ══════════ */}
        <section id="portals" className="lp-section">
          <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 28px" }}>
            <div ref={portRef} style={{ textAlign: "center", marginBottom: 24 }} className={`reveal ${portVis ? "visible" : ""}`}>
              <Badge>Portals</Badge>
              <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontWeight: 800, color: T.navy, letterSpacing: "-.03em", marginBottom: 14, fontFamily: "'Barlow',sans-serif" }}>
                Choose Your <em style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400, color: T.blue }}>Portal</em>
              </h2>
              <p style={{ color: T.muted, fontSize: ".95rem", lineHeight: 1.75, maxWidth: 460, margin: "0 auto" }}>Tailored experiences for every member of the healthcare ecosystem.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
              {portals.map((p, i) => {
                const initialTx = i === 0 ? "translate(105%, 80px) rotate(-18deg) scale(0.65)" :
                  i === 1 ? "translate(0, 80px) rotate(2deg) scale(0.65)" :
                    "translate(-105%, 80px) rotate(18deg) scale(0.65)";
                return (
                  <div key={p.title} className={`reveal ${portVis ? "visible" : ""}`} style={{
                    transitionDelay: `${i * 140}ms`,
                    height: "100%",
                    transform: portVis ? "translate(0,0) rotate(0) scale(1)" : initialTx,
                    opacity: portVis ? 1 : 0
                  }}>
                    <div className="portal-card lg-strong" onClick={() => navigate("/login")} style={{ borderRadius: 24, overflow: "hidden", position: "relative", height: "100%" }}>
                      <div style={{ height: 240, overflow: "hidden" }}>
                        <img className="portal-img" src={p.img} alt={p.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .82 }} />
                      </div>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "linear-gradient(to top,rgba(15,34,64,0.75) 0%,rgba(15,34,64,0.15) 55%,transparent 100%)", padding: 24 }}>
                        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginBottom: 5 }}>{p.title}</h3>
                        <p style={{ fontSize: ".82rem", color: "rgba(200,225,248,.85)", marginBottom: 14, lineHeight: 1.6 }}>{p.text}</p>
                        <div className="lg" style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 9999, padding: "6px 14px", width: "fit-content", background: "rgba(255,255,255,0.18)" }}>
                          <span style={{ fontSize: ".78rem", fontWeight: 600, color: "#fff" }}>Access Portal</span>
                          <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#fff" }}>arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════ TESTIMONIALS ══════════ */}
        <section className="lp-section">
          <div ref={testiRef} style={{ maxWidth: 1140, margin: "0 auto", padding: "0 28px" }} className={`reveal ${testiVis ? "visible" : ""}`}>
            <Badge>Testimonials</Badge>
            <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontWeight: 800, color: T.navy, letterSpacing: "-.03em", marginBottom: 0, fontFamily: "'Barlow',sans-serif" }}>
              Patients who switched,<br />
              <em style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400, color: T.blue }}>never looked back.</em>
            </h2>
          </div>
          <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 28px" }}>
            <div className="testi-scroll">
              {testis.map((t) => (
                <div key={t.name} style={{ flexShrink: 0, width: 330, borderRadius: 22, padding: 28, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "0 8px 28px rgba(46,109,180,0.08)" }}>
                  <div style={{ fontSize: ".88rem", lineHeight: 1.8, color: T.navy, marginBottom: 20, fontStyle: "italic", fontWeight: 300 }}>
                    <span style={{ color: T.blue, fontSize: "1.3rem", fontStyle: "normal", fontWeight: 600 }}>"</span>{t.q}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "rgba(46,109,180,0.12)", border: "1px solid rgba(46,109,180,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".72rem", fontWeight: 700, color: T.blue }}>{t.av}</div>
                    <div>
                      <div style={{ fontSize: ".82rem", fontWeight: 700, color: T.navy }}>{t.name}</div>
                      <div style={{ fontSize: ".72rem", color: T.muted }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ FAQ ══════════ */}
        <section id="faq" className="lp-section">
          <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 28px" }}>
            <div ref={faqRef} className={`reveal ${faqVis ? "visible" : ""}`}>
              <Badge>FAQ</Badge>
              <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontWeight: 800, color: T.navy, letterSpacing: "-.03em", marginBottom: 0, fontFamily: "'Barlow',sans-serif" }}>
                Common questions,<br />
                <em style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400, color: T.blue }}>clear answers.</em>
              </h2>
            </div>
            <div style={{ marginTop: 44, maxWidth: 700 }}>
              {FAQS.map((f, i) => (
                <div key={i} className={`reveal ${faqVis ? "visible" : ""}`} style={{ transitionDelay: `${i * 150}ms` }}>
                  <div className={`faq-item ${openFaq === i ? "open" : ""}`} onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: ".95rem", fontWeight: 600, color: T.navy }}>
                      <span>{f.q}</span>
                      <span className="material-symbols-outlined faq-ico">add</span>
                    </div>
                    <div className="faq-a">{f.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ CTA ══════════ */}
        <section className="lp-section" style={{ padding: "88px 0 100px" }}>
          <div ref={ctaRef} style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1, padding: "0 28px" }} className={`reveal ${ctaVis ? "visible" : ""}`}>
            <div style={{ margin: "0 auto 24px" }}><MedIcon size={52} /></div>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-.03em", color: T.navy, marginBottom: 16, lineHeight: 1.1, fontFamily: "'Barlow',sans-serif" }}>
              Ready to <em style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400, color: T.blue }}>transform</em><br />your healthcare experience?
            </h2>
            <p style={{ color: T.muted, fontSize: "1rem", lineHeight: 1.75, margin: "0 auto 36px", maxWidth: 500 }}>Join millions of patients and providers connecting care, wherever it's needed.</p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/register")} style={{ background: T.navy, border: "none", borderRadius: 9999, padding: "15px 38px", fontSize: "1rem", fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 10px 36px rgba(15,34,64,0.22)", fontFamily: "'Barlow',sans-serif", transition: "all .2s" }}>Get Started Free</button>
              <button onClick={() => navigate("/login")} className="lg" style={{ borderRadius: 9999, padding: "15px 38px", fontSize: "1rem", fontWeight: 400, color: T.navy, cursor: "pointer", fontFamily: "'Barlow',sans-serif", border: "1px solid rgba(46,109,180,0.25)", background: "rgba(255,255,255,0.5)", transition: "all .2s" }}>Sign In</button>
            </div>
          </div>
        </section>

      </main>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ borderRadius: "28px 28px 0 0", margin: "0 16px", background: "rgba(15,34,64,0.93)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", border: "1px solid rgba(168,206,240,0.1)", borderBottom: "none", padding: "64px 40px 32px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 48, marginBottom: 56 }}>
              {/* Brand */}
              <div id="about">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <MedIcon size={34} color="#a8cef0" />
                  <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontSize: "1.15rem", color: "#fff" }}>Medi<span style={{ color: T.sky }}>Share</span></span>
                </div>
                <p style={{ fontSize: ".82rem", lineHeight: 1.85, color: "rgba(168,206,240,0.62)", maxWidth: 240 }}>The unified platform for modern healthcare management, connecting patients with providers across the globe.</p>
              </div>
              {/* Platform */}
              <div>
                <h4 style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: T.sky, marginBottom: 20 }}>Platform</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Solutions", "Integrations", "API Docs"].map(l => <li key={l} style={{ fontSize: ".87rem", color: "rgba(168,206,240,0.68)", cursor: "pointer" }}>{l}</li>)}
                </ul>
              </div>
              {/* Support */}
              <div>
                <h4 style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: T.sky, marginBottom: 20 }}>Support</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Help Center", "Security", "HIPAA Compliance", "Contact Us"].map(l => <li key={l} style={{ fontSize: ".87rem", color: "rgba(168,206,240,0.68)" }}>{l}</li>)}
                </ul>
              </div>
              {/* Trust */}
              <div>
                <h4 style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: T.sky, marginBottom: 20 }}>Trust &amp; Standards</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[{ icon: "verified_user", title: "HIPAA Compliant", sub: "Certified Security" }, { icon: "lock", title: "ISO 27001", sub: "Data Protection" }].map(b => (
                    <div key={b.title} className="lg" style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 14, padding: "11px 14px", background: "rgba(168,206,240,0.06)", border: "1px solid rgba(168,206,240,0.14)" }}>
                      <span className="material-symbols-outlined" style={{ color: T.blueSoft, fontSize: 20 }}>{b.icon}</span>
                      <div>
                        <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#fff" }}>{b.title}</div>
                        <div style={{ fontSize: ".62rem", letterSpacing: ".08em", textTransform: "uppercase", color: T.sky, opacity: .65 }}>{b.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Bottom bar */}
            <div style={{ borderTop: "1px solid rgba(168,206,240,0.12)", paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <p style={{ fontSize: ".72rem", color: "rgba(168,206,240,0.4)", margin: 0 }}>© 2026 MediShare Technologies Pvt. Ltd. All rights reserved.</p>
              <div style={{ display: "flex", gap: 24 }}>
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => <span key={l} style={{ fontSize: ".72rem", color: "rgba(168,206,240,0.4)", cursor: "pointer" }}>{l}</span>)}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}