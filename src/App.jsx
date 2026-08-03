import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Instagram,
  Copy,
  CheckCircle2,
  Calendar,
  MapPin,
  Target,
  BookOpen,
  Quote,
  Sparkles,
  Heart,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { label: "Profile", id: "hero" },
  { label: "Biodata", id: "biodata" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

const IDENTITY_ITEMS = [
  { icon: User, label: "Nama Lengkap", value: "Nurdiah Pitaloka" },
  { icon: Calendar, label: "Tanggal Lahir", value: "17 Oktober 2007" },
  { icon: MapPin, label: "Sekolah & Kelas", value: "SMAN 12 Jakarta, Grade 12" },
];

const PASSION_ITEMS = [
  {
    icon: BookOpen,
    label: "Hobi",
    value: "Data Analysis, Reading, Creative Writing",
  },
  {
    icon: Target,
    label: "Cita-Cita",
    value: "Data Scientist / Business Analyst",
  },
  {
    icon: Quote,
    label: "Motto Hidup",
    value: "\u201cSmall steps today lead to big results tomorrow.\u201d",
  },
];

const ABOUT_PARAGRAPHS = [
  "Hello! My name is Nurdiah Pitaloka, and I am a student at SMAN 12 Jakarta. I am currently in Grade 12 and have a strong curiosity for learning, creating, and continuously improving my skills.",
  "I am passionate about data and enjoy organizing, analyzing, and transforming information into meaningful insights. I believe that every dataset tells a story waiting to be discovered, and I am excited by the opportunity to use data to solve problems and support better decision-making.",
  "Beyond academics, I enjoy exploring new ideas, taking on creative challenges, and building projects that allow me to apply what I have learned. This website serves as my personal portfolio, where I share my profile, learning journey, and a collection of my PKWU projects and achievements. I hope it reflects not only the work I have completed but also my growth, creativity, and enthusiasm for learning.",
];

const CONTACT = {
  email: "nurdiahptugas@gmail.com",
  instagramHandle: "@diahpita17_",
  instagramUrl: "https://instagram.com/diahpita17_",
};

/* ------------------------------------------------------------------ */
/*  COLOR TOKENS (Soft Dusty Rose & Feminine Elegant palette)          */
/* ------------------------------------------------------------------ */

const palette = {
  cream: "#FFF8F9",
  blush: "#FDEFF2",
  blushSoft: "#FBE6EA",
  roseBorder: "#F1D8DE",
  roseBorderSoft: "#F6E3E8",
  dustyRose: "#E4B9C4",
  mauve: "#B97D8F",
  mauveDeep: "#8C5A6B",
  textDark: "#4A3238",
  textMuted: "#8A6B72",
  textSoft: "#A9868D",
  gold: "#C9A15A",
};

/* ------------------------------------------------------------------ */
/*  SMALL DECORATIVE COMPONENTS                                        */
/* ------------------------------------------------------------------ */

function PearlDivider() {
  const dots = new Array(9).fill(0);
  return (
    <div
      className="w-full flex items-center justify-center gap-3 my-2"
      aria-hidden="true"
    >
      {dots.map((_, i) => {
        const mid = Math.floor(dots.length / 2);
        const dist = Math.abs(i - mid);
        const size = 6 - dist * 0.9;
        const opacity = 1 - dist * 0.16;
        return (
          <span
            key={i}
            style={{
              width: `${Math.max(size, 2.5)}px`,
              height: `${Math.max(size, 2.5)}px`,
              borderRadius: "9999px",
              backgroundColor: palette.dustyRose,
              opacity: Math.max(opacity, 0.25),
              display: "inline-block",
            }}
          />
        );
      })}
    </div>
  );
}

function SectionEyebrow({ children }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <span
        style={{ backgroundColor: palette.mauve }}
        className="h-[2px] w-8 rounded-full"
      />
      <span
        style={{ color: palette.mauveDeep }}
        className="uppercase tracking-[0.25em] text-xs font-semibold font-body"
      >
        {children}
      </span>
      <span
        style={{ backgroundColor: palette.mauve }}
        className="h-[2px] w-8 rounded-full"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NAVBAR                                                              */
/* ------------------------------------------------------------------ */

function Navbar({ activeId, onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: "rgba(255, 248, 249, 0.85)",
        borderBottom: `1px solid ${palette.roseBorderSoft}`,
      }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate("hero")}
            className="flex items-center gap-3 group"
          >
            <span
              className="flex items-center justify-center w-11 h-11 rounded-2xl font-display text-lg font-semibold shadow-sm transition-transform group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${palette.dustyRose}, ${palette.mauve})`,
                color: "#FFFFFF",
              }}
            >
              NP
            </span>
            <span className="hidden sm:flex flex-col items-start leading-tight">
              <span
                className="font-display text-base"
                style={{ color: palette.textDark }}
              >
                Nurdiah Pitaloka
              </span>
              <span
                className="text-[11px] tracking-wide font-body"
                style={{ color: palette.textSoft }}
              >
                Portfolio &amp; PKWU
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="px-4 py-2 rounded-full text-sm font-medium font-body transition-all"
                  style={{
                    color: isActive ? "#FFFFFF" : palette.mauveDeep,
                    backgroundColor: isActive ? palette.mauve : "transparent",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col items-end gap-1.5 p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation menu"
          >
            <span
              className="block h-[2px] rounded-full transition-all"
              style={{
                backgroundColor: palette.mauveDeep,
                width: open ? "22px" : "22px",
                transform: open ? "translateY(6px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block h-[2px] rounded-full transition-all"
              style={{
                backgroundColor: palette.mauveDeep,
                width: "16px",
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="block h-[2px] rounded-full transition-all"
              style={{
                backgroundColor: palette.mauveDeep,
                width: "22px",
                transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="md:hidden px-6 pb-5"
          style={{ borderTop: `1px solid ${palette.roseBorderSoft}` }}
        >
          <div className="flex flex-col gap-1 pt-3">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-2xl text-sm font-medium font-body transition-all"
                  style={{
                    color: isActive ? "#FFFFFF" : palette.mauveDeep,
                    backgroundColor: isActive ? palette.mauve : palette.blush,
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO SECTION                                                        */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32"
    >
      {/* soft ambient blobs */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-60"
        style={{ backgroundColor: palette.blushSoft }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-60"
        style={{ backgroundColor: palette.blush }}
      />

      <div className="relative max-w-5xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-14 md:gap-10 items-center">
          {/* Text column */}
          <div className="text-center md:text-left">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold font-body mb-6 shadow-sm"
              style={{
                backgroundColor: palette.blush,
                color: palette.mauveDeep,
                border: `1px solid ${palette.roseBorder}`,
              }}
            >
              <Sparkles size={14} strokeWidth={2} />
              Portfolio &amp; PKWU
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl leading-[1.15] mb-6"
              style={{ color: palette.textDark }}
            >
              My Journey Through{" "}
              <span style={{ color: palette.mauve }}>PKWU</span> Starts Here.
            </h1>

            <p
              className="font-body text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto md:mx-0"
              style={{ color: palette.textMuted }}
            >
              Hi, I&apos;m Nurdiah Pitaloka &mdash; a Grade 12 student at SMAN
              12 Jakarta who loves turning data into stories and ideas into
              projects. Welcome to my personal learning space.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-full font-body text-sm font-semibold shadow-sm transition-transform hover:scale-[1.03]"
                style={{
                  background: `linear-gradient(135deg, ${palette.mauve}, ${palette.mauveDeep})`,
                  color: "#FFFFFF",
                }}
              >
                About Me
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-full font-body text-sm font-semibold shadow-sm transition-transform hover:scale-[1.03]"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: palette.mauveDeep,
                  border: `1px solid ${palette.roseBorder}`,
                }}
              >
                Let&apos;s Connect
              </a>
            </div>
          </div>

          {/* Photo frame column */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-3xl"
                style={{
                  border: `1.5px dashed ${palette.dustyRose}`,
                }}
              />
              <div
                className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center"
                style={{
                  background: `linear-gradient(160deg, ${palette.blushSoft}, ${palette.dustyRose})`,
                  border: `4px solid #FFFFFF`,
                  boxShadow: "0 8px 30px rgba(185, 125, 143, 0.18)",
                }}
              >
                <User
                  size={104}
                  strokeWidth={1.2}
                  style={{ color: "#FFFFFF" }}
                />
              </div>
              <div
                className="absolute -bottom-4 -right-4 flex items-center justify-center w-16 h-16 rounded-2xl shadow-sm"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${palette.roseBorder}`,
                }}
              >
                <Heart
                  size={24}
                  strokeWidth={1.6}
                  fill={palette.dustyRose}
                  style={{ color: palette.mauve }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  BIODATA SECTION                                                     */
/* ------------------------------------------------------------------ */

function InfoCard({ title, items, accentIcon: AccentIcon }) {
  return (
    <div
      className="rounded-3xl p-7 sm:p-8 shadow-sm h-full"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${palette.roseBorder}`,
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span
          className="flex items-center justify-center w-11 h-11 rounded-2xl"
          style={{ backgroundColor: palette.blush }}
        >
          <AccentIcon size={20} strokeWidth={1.8} style={{ color: palette.mauveDeep }} />
        </span>
        <h3
          className="font-display text-xl"
          style={{ color: palette.textDark }}
        >
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-5">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-4">
              <span
                className="mt-0.5 flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                style={{ backgroundColor: palette.blush }}
              >
                <Icon size={16} strokeWidth={1.8} style={{ color: palette.mauve }} />
              </span>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wide font-body mb-1"
                  style={{ color: palette.textSoft }}
                >
                  {item.label}
                </p>
                <p
                  className="font-body text-sm sm:text-base leading-snug"
                  style={{ color: palette.textDark }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BiodataSection() {
  return (
    <section
      id="biodata"
      className="py-20 md:py-28"
      style={{ backgroundColor: palette.blush }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="text-center mb-14">
          <SectionEyebrow>Biodata Diri</SectionEyebrow>
          <h2
            className="font-display text-3xl sm:text-4xl"
            style={{ color: palette.textDark }}
          >
            Kartu Identitas Pelajar
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          <InfoCard
            title="Identitas Pelajar"
            items={IDENTITY_ITEMS}
            accentIcon={User}
          />
          <InfoCard
            title="Hobi &amp; Cita-Cita"
            items={PASSION_ITEMS}
            accentIcon={Target}
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ABOUT SECTION                                                       */
/* ------------------------------------------------------------------ */

function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <div className="text-center mb-12">
          <SectionEyebrow>About Me</SectionEyebrow>
          <h2
            className="font-display text-3xl sm:text-4xl mb-4"
            style={{ color: palette.textDark }}
          >
            Getting To Know Me
          </h2>
        </div>

        <div
          className="relative rounded-3xl p-8 sm:p-12 shadow-sm"
          style={{
            backgroundColor: "#FFFFFF",
            border: `1px solid ${palette.roseBorder}`,
          }}
        >
          <Quote
            size={40}
            strokeWidth={1.4}
            className="absolute -top-5 left-8"
            style={{ color: palette.dustyRose, backgroundColor: palette.cream, borderRadius: "9999px", padding: "8px" }}
          />

          <div className="flex flex-col gap-6">
            {ABOUT_PARAGRAPHS.map((para, idx) => (
              <p
                key={idx}
                className="font-body text-sm sm:text-base leading-relaxed sm:leading-loose"
                style={{ color: palette.textMuted }}
              >
                {para}
              </p>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span
              className="h-[1px] flex-1"
              style={{ backgroundColor: palette.roseBorder }}
            />
            <Sparkles size={16} strokeWidth={1.6} style={{ color: palette.mauve }} />
            <span
              className="h-[1px] flex-1"
              style={{ backgroundColor: palette.roseBorder }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER / CONTACT SECTION                                            */
/* ------------------------------------------------------------------ */

function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
    } catch (err) {
      setCopied(false);
    }
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <footer
      id="contact"
      className="py-20 md:py-28"
      style={{ backgroundColor: palette.blush }}
    >
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <div className="text-center mb-12">
          <SectionEyebrow>Contact</SectionEyebrow>
          <h2
            className="font-display text-3xl sm:text-4xl"
            style={{ color: palette.textDark }}
          >
            Let&apos;s Connect
          </h2>
        </div>

        <div
          className="rounded-3xl p-8 sm:p-12 shadow-sm text-center"
          style={{
            background: `linear-gradient(160deg, #FFFFFF, ${palette.blushSoft})`,
            border: `1px solid ${palette.roseBorder}`,
          }}
        >
          <p
            className="font-body text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto"
            style={{ color: palette.textMuted }}
          >
            Feel free to reach out for collaboration, questions about my
            projects, or just to say hello. I would love to connect with you.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            {/* Email copy button */}
            <button
              onClick={handleCopyEmail}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-body text-sm font-semibold shadow-sm transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: copied ? "#F0EFE0" : "#FFFFFF",
                color: palette.mauveDeep,
                border: `1px solid ${palette.roseBorder}`,
              }}
            >
              {copied ? (
                <>
                  <CheckCircle2 size={17} strokeWidth={2} style={{ color: "#5B8266" }} />
                  <span style={{ color: "#5B8266" }}>Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={17} strokeWidth={1.8} />
                  {CONTACT.email}
                </>
              )}
            </button>

            {/* Instagram link */}
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-body text-sm font-semibold shadow-sm transition-transform hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${palette.mauve}, ${palette.mauveDeep})`,
                color: "#FFFFFF",
              }}
            >
              <Instagram size={17} strokeWidth={1.8} />
              {CONTACT.instagramHandle}
            </a>
          </div>
        </div>

        <PearlDivider />

        <div className="flex items-center justify-center gap-1.5 mt-4">
          <p
            className="font-body text-xs"
            style={{ color: palette.textSoft }}
          >
            Made with
          </p>
          <Heart
            size={13}
            strokeWidth={1.6}
            fill={palette.dustyRose}
            style={{ color: palette.mauve }}
          />
          <p
            className="font-body text-xs"
            style={{ color: palette.textSoft }}
          >
            by Nurdiah Pitaloka &middot; SMAN 12 Jakarta &middot; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOT APP                                                            */
/* ------------------------------------------------------------------ */

export default function App() {
  const [activeId, setActiveId] = useState("hero");

  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  }, []);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen w-full font-body"
      style={{ backgroundColor: palette.cream }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Poppins', sans-serif; }
        html { scroll-behavior: smooth; }
      `}</style>

      <Navbar activeId={activeId} onNavigate={scrollToId} />
      <main>
        <HeroSection />
        <BiodataSection />
        <AboutSection />
      </main>
      <ContactSection />
    </div>
  );
}
