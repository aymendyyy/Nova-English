'use client'

import { useState } from 'react'
import { ArrowUpRight, Check, ChevronDown, Instagram, Linkedin, Menu, Mic2, MoveRight, Play, Sparkles, Users, X, Youtube } from 'lucide-react'

const logo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-withe-gonbUAVmX8WtMaXi5354P97gGGsGw0.png'

const activities = [
  { number: '01', title: 'English Learning Sessions', text: 'Build a practical vocabulary and sharpen your grammar through lively, student-led sessions.', color: 'yellow', icon: Sparkles },
  { number: '02', title: 'Speaking & Conversation', text: 'Find your voice in relaxed conversation circles that make every word feel easier.', color: 'pink', icon: Mic2 },
  { number: '03', title: 'Public Speaking', text: 'Turn nerves into presence with workshops for presenting, pitching, and storytelling.', color: 'blue', icon: MoveRight },
  { number: '04', title: 'Workshops & Training', text: 'Learn with invited speakers and hands-on experiences that connect English to your future.', color: 'green', icon: Users },
]

const events = [
  { date: 'OCT 18', title: 'Speak Up Session', tag: 'Conversation club', bg: 'event-yellow', sticker: 'Bring your voice' },
  { date: 'NOV 02', title: 'NOVA Talk: Future Ready', tag: 'Public speaking', bg: 'event-blue', sticker: 'New perspectives' },
  { date: 'NOV 16', title: 'Culture Connect', tag: 'Cultural exchange', bg: 'event-pink', sticker: 'Meet. Share. Grow.' },
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <main className="site-shell">
      <header className="nav-wrap">
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label="NOVA English Club home">
            <img src={logo} alt="NOVA English Club" />
          </a>
          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About us</a>
            <a href="#activities" onClick={() => setMenuOpen(false)}>Activities</a>
            <a href="#team" onClick={() => setMenuOpen(false)}>Our team</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <a className="nav-cta" href="#join" onClick={() => setMenuOpen(false)}>Join NOVA <ArrowUpRight size={16} /></a>
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
        </nav>
      </header>

      <section id="home" className="hero section-pad">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> University of Ghardaïa <span className="slash">/</span> Est. 2024</p>
          <h1>Speak.<br /><em>Learn.</em><br />Grow<span className="period">.</span></h1>
          <p className="hero-intro">Your space to learn English, build confidence, connect with others, and unlock new opportunities.</p>
          <div className="hero-actions"><a className="button button-dark" href="#join">Join the club <ArrowUpRight size={18} /></a><a className="text-link" href="#about">Discover NOVA <MoveRight size={18} /></a></div>
        </div>
        <div className="hero-art" aria-label="NOVA communication illustration">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="bubble bubble-top">hello<span>!</span></div>
          <div className="speech-card"><span className="tiny-label">YOUR VOICE</span><strong>has<br /><i>power.</i></strong><div className="wave"><b /><b /><b /><b /><b /><b /><b /></div></div>
          <div className="circle-mark"><span /><span /><span /><span /><span /></div>
          <div className="bubble bubble-bottom">let&apos;s<br />talk<span>.</span></div>
          <div className="scribble">&amp; more</div>
        </div>
        <div className="hero-scroll"><span>Scroll to explore</span><ChevronDown size={16} /></div>
      </section>

      <section id="about" className="about section-pad">
        <div className="section-kicker">01 / WHO WE ARE</div>
        <div className="about-grid"><h2>More than<br /><span>English.</span></h2><div className="about-text"><p className="lead">NOVA is a scientific, cultural, and educational university club built around one idea: <strong>when you find your voice, you find new possibilities.</strong></p><p>Based at the University of Ghardaïa, we create a welcoming space where students learn together, practise without pressure, and grow into confident communicators.</p><a href="#join" className="round-link">Meet the NOVA community <ArrowUpRight size={18} /></a></div></div>
        <div className="stat-row"><div><strong>100<span>%</span></strong><small>FREE TO JOIN</small></div><div><strong>01</strong><small>SHARED COMMUNITY</small></div><div><strong>∞</strong><small>WAYS TO GROW</small></div></div>
      </section>

      <section id="activities" className="offer section-pad">
        <div className="section-kicker">02 / WHAT WE DO</div><div className="offer-heading"><h2>Find your<br /><span>next word.</span></h2><p>From first introductions to fearless presentations, there is a place for every stage of your English journey.</p></div>
        <div className="activity-grid">{activities.map(({ number, title, text, color, icon: Icon }) => <article className={`activity-card card-${color}`} key={number}><div className="card-top"><span>{number}</span><Icon size={24} strokeWidth={1.6} /></div><h3>{title}</h3><p>{text}</p><a href="#join" aria-label={`Learn more about ${title}`}><ArrowUpRight size={19} /></a></article>)}</div>
      </section>

      <section className="join-strip"><div className="join-inner"><p className="eyebrow">NO EXPERIENCE NEEDED</p><h2>Curious minds<br /><em>welcome.</em></h2><div className="join-note"><Check size={20} /><span>Membership &amp; learning sessions<br /><strong>completely free.</strong></span></div></div></section>

      <section className="events section-pad"><div className="section-kicker">03 / ON THE CALENDAR</div><div className="events-heading"><h2>Come as you<br /><span>are.</span></h2><a className="text-link" href="#join">See all activities <MoveRight size={18} /></a></div><div className="event-grid">{events.map(event => <article className={`event-card ${event.bg}`} key={event.title}><div className="event-date">{event.date}</div><div className="event-visual"><div className="event-sticker">{event.sticker}</div><div className="event-symbol">N</div></div><div className="event-info"><small>{event.tag}</small><h3>{event.title}</h3><ArrowUpRight size={20} /></div></article>)}</div></section>

      <section id="team" className="team section-pad"><div className="section-kicker">04 / THE PEOPLE</div><div className="team-grid"><div><h2>Good things<br /><span>grow together.</span></h2><p>We are students, mentors, dreamers, and doers making room for one another to get better every day.</p></div><div className="team-collage"><div className="team-orb">NOVA<br /><small>community</small></div><div className="team-caption">Built by students<br />for students.</div></div></div></section>

      <section id="join" className="final-cta section-pad"><div className="cta-shape shape-one" /><div className="cta-shape shape-two" /><div className="section-kicker">05 / YOUR TURN</div><h2>Your English<br />journey <em>starts here.</em></h2><p>Join a community that helps you speak with confidence and grow together.</p><a className="button button-light" href="mailto:nova.englishclub@univ-ghardaia.dz">Join NOVA — It&apos;s FREE! <ArrowUpRight size={19} /></a></section>

      <footer id="contact" className="footer"><div className="footer-top"><img src={logo} alt="NOVA English Club" /><p>Scientific, cultural &amp; educational club<br />University of Ghardaïa</p><div className="socials"><a href="#contact" aria-label="Instagram"><Instagram size={19} /></a><a href="#contact" aria-label="LinkedIn"><Linkedin size={19} /></a><a href="#contact" aria-label="YouTube"><Youtube size={19} /></a></div></div><div className="footer-bottom"><span>© 2024 NOVA English Club</span><span>Made with curiosity in Ghardaïa, Algeria</span><a href="#home">Back to top ↑</a></div></footer>
    </main>
  )
}
