import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { gradeTone, site } from './data'
import { WorkPage } from './labs'
import { ResumePage } from './resume'

function useClock() {
  const [now, setNow] = useState('')
  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat('en-IN', {
          timeZone: site.timezone,
          hour: '2-digit',
          minute: '2-digit',
          weekday: 'short',
        }).format(new Date()),
      )
    tick()
    const id = window.setInterval(tick, 30000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

function Cursor() {
  const [pos, setPos] = useState({ x: -40, y: -40, hot: false })
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const hot = Boolean(target.closest('a, button, input, textarea, .work-row'))
      setPos({ x: e.clientX, y: e.clientY, hot })
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return <div className={`cursor${pos.hot ? ' hot' : ''}`} style={{ left: pos.x, top: pos.y }} />
}

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className={`nav${open ? ' open' : ''}`}>
      <Link className="nav-brand" to="/" onClick={() => setOpen(false)}>
        {site.monogram}
      </Link>
      <button className="menu-btn" type="button" onClick={() => setOpen((v) => !v)}>
        Menu
      </button>
      <nav className="nav-links">
        <a href="/#about" onClick={() => setOpen(false)}>
          About
        </a>
        <a href="/#academics" onClick={() => setOpen(false)}>
          Academics
        </a>
        <a href="/#work" onClick={() => setOpen(false)}>
          Studios
        </a>
        <a href="/#projects" onClick={() => setOpen(false)}>
          Projects
        </a>
        <Link to="/resume" onClick={() => setOpen(false)}>
          Resume
        </Link>
        <a className="nav-cta" href="/#contact" onClick={() => setOpen(false)}>
          Contact
        </a>
      </nav>
    </header>
  )
}

function SgpaChart() {
  const max = 10
  const pts = site.semesters.map((row, i) => {
    const x = 48 + (i * 704) / (site.semesters.length - 1)
    const y = 220 - (row.sgpa / max) * 170
    return { ...row, x, y }
  })
  return (
    <div className="chart">
      <svg viewBox="0 0 800 260">
        {[6, 7, 8, 9, 10].map((n) => {
          const y = 220 - (n / max) * 170
          return (
            <g key={n}>
              <line x1="48" x2="780" y1={y} y2={y} stroke="rgba(244,234,216,.08)" />
              <text x="8" y={y + 4} fill="#8f877b" fontSize="11">
                {n}
              </text>
            </g>
          )
        })}
        <polyline
          fill="none"
          stroke="#d4b483"
          strokeWidth="3"
          points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
        />
        {pts.map((p) => (
          <g key={p.sem}>
            <circle cx={p.x} cy={p.y} r="7" fill="#f0d7a3" />
            <text x={p.x} y={p.y - 16} textAnchor="middle" fill="#f4ead8" fontSize="14">
              {p.sgpa.toFixed(2)}
            </text>
            <text x={p.x} y="248" textAnchor="middle" fill="#8f877b" fontSize="12">
              Sem {p.sem} · {p.term}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function HomePage() {
  const clock = useClock()
  const ticker = useMemo(
    () =>
      [
        ...site.skills.data,
        ...site.skills.code,
        ...site.skills.commerce,
        ...site.skills.data,
        ...site.skills.code,
        ...site.skills.commerce,
      ].join('  ·  '),
    [],
  )
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">
            {site.city} · {clock} IST
          </p>
          <h1>
            Thakur
            <span>Nihar Singh</span>
          </h1>
          <p className="lede">{site.tagline}</p>
          <div className="hero-actions">
            <a className="btn" href="#work">
              Enter the studios
            </a>
            <a className="btn ghost" href={`mailto:${site.email}`}>
              Email Nihar
            </a>
          </div>
        </div>
        <div className="hero-photo">
          <img src="/portrait.png" alt="Thakur Nihar Singh" />
          <p className="photo-meta">
            IIMC · Osmania University
            <br />
            {site.availability}
          </p>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee">
          <span>{ticker}</span>
          <span>{ticker}</span>
        </div>
      </div>

      <section className="section" id="about">
        <div className="section-head">
          <h2>The dual ledger.</h2>
          <span className="idx">01 — About</span>
        </div>
        <div className="about-grid">
          <img src="/lifestyle.jpg" alt="Nihar in Hyderabad" />
          <div className="about-copy">
            {site.about.map((para) => (
              <p key={para}>{para}</p>
            ))}
            <p>{site.objective}</p>
            <div className="chips">
              {site.languages.map((item) => (
                <span className="chip" key={item.name}>
                  {item.name} · {item.level}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="stats">
          {site.stats.map((item) => (
            <div className="stat" key={item.label}>
              <b>{item.value}</b>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt" id="academics">
        <div className="section-head">
          <h2>Four semesters. One line.</h2>
          <span className="idx">02 — Academics</span>
        </div>
        <SgpaChart />
        <div className="edu-list">
          {site.education.map((item) => (
            <article className="edu-card" key={item.id}>
              <span className="idx">{item.period}</span>
              <div>
                <h3>{item.program}</h3>
                <p>
                  {item.school}
                  {item.affiliation ? ` · ${item.affiliation}` : ''}
                  <br />
                  {item.note}
                </p>
              </div>
              <div className="result">{item.result}</div>
            </article>
          ))}
        </div>
        <div className="heat">
          {site.courses.map((course) => (
            <article key={`${course.sem}-${course.code}`}>
              <small>
                SEM {course.sem} · {course.code}
              </small>
              <h4>{course.name}</h4>
              <span className={`grade ${gradeTone(course.grade)}`}>{course.grade}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="skills">
        <div className="section-head">
          <h2>Tools I actually use.</h2>
          <span className="idx">03 — Skills</span>
        </div>
        <div className="skill-grid">
          <div className="skill-col">
            <h3>Data</h3>
            <ul>
              {site.skills.data.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="skill-col">
            <h3>Code</h3>
            <ul>
              {site.skills.code.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="skill-col">
            <h3>Commerce</h3>
            <ul>
              {site.skills.commerce.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="skill-col">
            <h3>Core</h3>
            <ul>
              {site.skills.core.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section alt" id="highlights">
        <div className="section-head">
          <h2>Signals that stick.</h2>
          <span className="idx">04 — Highlights</span>
        </div>
        <div className="heat">
          {site.highlights.map((item) => (
            <article key={item.title}>
              <small>HIGHLIGHT</small>
              <h4>{item.title}</h4>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="work">
        <div className="section-head">
          <h2>Ten live studios.</h2>
          <span className="idx">05 — Studios</span>
        </div>
        <div className="work-list">
          {site.works.map((work) => (
            <Link className="work-row" to={`/work/${work.slug}`} key={work.slug}>
              <span className="roman">{work.roman}</span>
              <div>
                <p className="kicker" style={{ marginBottom: 8 }}>
                  {work.eyebrow}
                </p>
                <h3>{work.title}</h3>
                <div className="tags">
                  {work.stack.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <p>{work.summary}</p>
              <span className="btn ghost">Open</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section alt" id="projects">
        <div className="section-head">
          <h2>Case studies.</h2>
          <span className="idx">06 — Projects</span>
        </div>
        <div className="case-grid">
          {site.caseStudies.map((item) => (
            <article className="case-card" key={item.title}>
              <small>
                {item.period} · {item.role}
              </small>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <ul className="bullet-list">
                {item.impact.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="tags">
                {item.stack.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="contact">
        <div className="section-head">
          <h2>Make the first move.</h2>
          <span className="idx">07 — Contact</span>
        </div>
        <div className="contact">
          <div className="contact-intro">
            <p className="lede" style={{ marginTop: 0 }}>
              {site.availability}. Hyderabad, with remote-ready work.
            </p>
            <p className="contact-note">
              Portfolio, resume, and ten interactive studios live at niharprojects.com — ready for
              internship conversations.
            </p>
            <div className="contact-actions">
              <a className="btn" href={`mailto:${site.email}`}>
                Email Nihar
              </a>
              <a className="btn ghost" href={site.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
          <div className="contact-list">
            <a className="contact-row" href={`mailto:${site.email}`}>
              <span className="contact-label">Email</span>
              <span className="contact-value">{site.email}</span>
            </a>
            <a className="contact-row" href={site.phoneHref}>
              <span className="contact-label">Phone</span>
              <span className="contact-value">{site.phone}</span>
            </a>
            <a className="contact-row" href={site.whatsapp} target="_blank" rel="noreferrer">
              <span className="contact-label">WhatsApp</span>
              <span className="contact-value">Chat now</span>
            </a>
            <a className="contact-row" href={site.linkedin} target="_blank" rel="noreferrer">
              <span className="contact-label">LinkedIn</span>
              <span className="contact-value">Thakur Nihar Singh</span>
            </a>
            <a className="contact-row" href={site.github} target="_blank" rel="noreferrer">
              <span className="contact-label">GitHub</span>
              <span className="contact-value">niharproject/niharprojects</span>
            </a>
            <a className="contact-row" href={site.domain} target="_blank" rel="noreferrer">
              <span className="contact-label">Website</span>
              <span className="contact-value">niharprojects.com</span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

function Intro() {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setGone(true), 1800)
    return () => window.clearTimeout(id)
  }, [])
  if (gone) return null
  return (
    <div className="intro">
      <b>NS</b>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Intro />
      <Cursor />
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work/:slug" element={<WorkPage />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>
      <footer className="footer">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>niharprojects.com</span>
      </footer>
    </>
  )
}
