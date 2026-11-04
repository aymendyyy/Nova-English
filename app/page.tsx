'use client'

import { useState } from 'react'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'

const logo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-withe-gonbUAVmX8WtMaXi5354P97gGGsGw0.png'
const rocket = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/start-upo-lPdHDBlC6RxYBI4R4Rc8wdjJCXByx4.png'
const social = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/start-upo-1-LY3mR4LDvyyufC8eoNas7rBRc2claT.png'
const commerce = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/start-upo-2-xtJR0sj4ZO66RuHGHRJmjBGQOvm23i.png'
const robot = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/start-upo6-Ts9OEgePe3yeWd9JQinKhEB2CMrjQa.png'

export default function Page() {
  const [open, setOpen] = useState(false)
  return <main className="nova-page">
    <header className="site-header"><a href="#home" className="wordmark"><img src={logo} alt="NOVA English Club" /></a><nav className={open ? 'open' : ''}><a className="active" href="#home" onClick={() => setOpen(false)}>Home</a><a href="#programs" onClick={() => setOpen(false)}>Programs</a><a href="#events" onClick={() => setOpen(false)}>Events</a><a href="#contact" onClick={() => setOpen(false)}>Contact</a><a className="header-button" href="#join" onClick={() => setOpen(false)}>Join NOVA <ArrowUpRight size={15} /></a></nav><button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button></header>

    <section id="home" className="hero-minimal"><div className="hero-content"><p className="micro-label">UNIVERSITY OF GHARDAÏA</p><h1>Speak.<br /><span>Learn.</span><br />Grow.</h1><p className="hero-subtitle">NOVA English Club is where language becomes confidence, connection, and new opportunities.</p><a href="#join" className="red-button">Join the Club <ArrowUpRight size={18} /></a></div><div className="hero-visual"><img src={rocket} alt="3D rocket representing new possibilities" /><div className="hero-caption">Your next chapter<br /><strong>starts here.</strong></div></div><a className="scroll-cue" href="#programs"><span>Scroll to explore</span><ChevronDown size={15} /></a></section>

    <section id="programs" className="programs"><p className="micro-label blue-label">OUR PROGRAMS</p><h2>Develop your<br /><span>English skills.</span></h2><div className="program-grid"><article><img src={social} alt="3D social media cards illustration" /><h3>Speaking<br />Sessions</h3><p>Find your voice in welcoming conversation circles.</p></article><article><img src={robot} alt="3D laptop assistant illustration" /><h3>Workshops<br />&amp; Training</h3><p>Build practical skills with hands-on learning.</p></article><article><img src={commerce} alt="3D phone and shop illustration" /><h3>Discussion<br />&amp; Activities</h3><p>Connect, share ideas, and learn together.</p></article></div><a href="#join" className="red-button">Explore Programs <ArrowUpRight size={18} /></a></section>

    <section className="numbers"><p className="micro-label">KEY NUMBERS</p><div className="number-grid"><div><strong>100<span>+</span></strong><small>Members</small></div><div><strong>10<span>+</span></strong><small>Activities</small></div><div><strong>01</strong><small>Academic Year</small></div></div></section>

    <section id="join" className="community"><img className="community-robot" src={robot} alt="" aria-hidden="true" /><div className="community-content"><p className="micro-label blue-label">NOVA ENGLISH CLUB</p><h2>Be part of<br />the <span>NOVA</span> community.</h2><p>A space to practise, connect, and grow your English with other motivated students.</p><a href="mailto:nova.englishclub@univ-ghardaia.dz" className="red-button">Join Now — It&apos;s Free! <ArrowUpRight size={18} /></a></div></section>

    <footer id="contact"><img src={logo} alt="NOVA English Club" /><span>© 2026 NOVA English Club. All rights reserved.</span><div><a href="#contact">in</a><a href="#contact">ig</a><a href="#contact">yt</a></div></footer>
  </main>
}
