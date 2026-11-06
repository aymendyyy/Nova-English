"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";

const logo =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-withe-gonbUAVmX8WtMaXi5354P97gGGsGw0.png";
const rocket =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/start-upo-lPdHDBlC6RxYBI4R4Rc8wdjJCXByx4.png";
const social =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/start-upo-1-LY3mR4LDvyyufC8eoNas7rBRc2claT.png";
const commerce =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/start-upo-2-xtJR0sj4ZO66RuHGHRJmjBGQOvm23i.png";
const robot =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/start-upo6-Ts9OEgePe3yeWd9JQinKhEB2CMrjQa.png";

export default function Page() {
  const [open, setOpen] = useState(false);
  return (
    <main className="nova-page">
      <header className="site-header">
        <a href="#home" className="wordmark">
          <img src={logo} alt="NOVA English Club" />
        </a>
        <nav className={open ? "open" : ""}>
          <a className="active" href="#home" onClick={() => setOpen(false)}>
            Home
          </a>
          <a href="#programs" onClick={() => setOpen(false)}>
            Programs
          </a>
          <a href="#events" onClick={() => setOpen(false)}>
            Events
          </a>
          <a href="#contact" onClick={() => setOpen(false)}>
            Contact
          </a>
        </nav>
        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>

      <section id="home" className="hero-minimal">
        <div className="hero-content">
          <p className="micro-label">UNIVERSITY OF GHARDAÏA</p>
          <h1>
            Speak.
            <br />
            <span>Learn.</span>
            <br />
            Grow.
          </h1>
          <p className="hero-subtitle">
            NOVA English Club is where language becomes confidence, connection,
            and new opportunities.
          </p>
          <a href="#join" className="red-button">
            Join the Club <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="hero-visual">
          <img src={rocket} alt="3D rocket representing new possibilities" />
          <div className="hero-caption">
            Your next chapter
            <br />
            <strong>starts here.</strong>
          </div>
        </div>
      </section>

      <section id="programs" className="programs">
        <p className="micro-label blue-label">OUR PROGRAMS</p>
        <h2>
          Develop your
          <br />
          <span>English skills.</span>
        </h2>
        <div className="program-grid">
          <article>
            <img src={social} alt="3D social media cards illustration" />
            <h3>
              Speaking
              <br />
              Sessions
            </h3>
            <p>Find your voice in welcoming conversation circles.</p>
          </article>
          <article>
            <img src={robot} alt="3D laptop assistant illustration" />
            <h3>
              Workshops
              <br />
              &amp; Training
            </h3>
            <p>Build practical skills with hands-on learning.</p>
          </article>
          <article>
            <img src={commerce} alt="3D phone and shop illustration" />
            <h3>
              Discussion
              <br />
              &amp; Activities
            </h3>
            <p>Connect, share ideas, and learn together.</p>
          </article>
        </div>
        <a href="#join" className="red-button">
          Explore Programs <ArrowUpRight size={18} />
        </a>
      </section>

      <section className="relative w-full min-h-[340px] overflow-hidden">
        {/* Blue curved background */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 340"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="novaStatsGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1035A8" />
              <stop offset="100%" stopColor="#0874E9" />
            </linearGradient>
          </defs>

          <path
            d="
        M 0 20
        C 400 70, 1040 70, 1440 20
        L 1440 305
        C 1040 245, 400 245, 0 305
        Z
      "
            fill="url(#novaStatsGradient)"
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 min-h-[340px] flex flex-col justify-center items-center text-white py-16">
          <span className="text-xs font-bold tracking-[0.2em] mb-8">
            KEY NUMBERS
          </span>

          <div className="grid grid-cols-3 w-full max-w-3xl text-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold">100+</h2>
              <p className="mt-3 text-sm">Members</p>
            </div>

            <div className="border-x border-white/30">
              <h2 className="text-4xl md:text-5xl font-bold">10+</h2>
              <p className="mt-3 text-sm">Activities</p>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-bold">01</h2>
              <p className="mt-3 text-sm">Academic Year</p>
            </div>
          </div>
        </div>
      </section>
      <section id="join" className="community">
        <img
          className="community-robot"
          src={robot}
          alt=""
          aria-hidden="true"
        />
        <div className="community-content">
          <p className="micro-label blue-label">NOVA ENGLISH CLUB</p>
          <h2>
            Be part of
            <br />
            the <span>NOVA</span> community.
          </h2>
          <p>
            A space to practise, connect, and grow your English with other
            motivated students.
          </p>
          <a
            href="mailto:nova.englishclub@univ-ghardaia.dz"
            className="red-button"
          >
            Join Now — It&apos;s Free! <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      <footer id="contact">
        <img src={logo} alt="NOVA English Club" />
        <span>© 2026 NOVA English Club. All rights reserved.</span>
        <div>
          <a href="#contact">in</a>
          <a href="#contact">ig</a>
          <a href="#contact">yt</a>
        </div>
      </footer>
    </main>
  );
}
