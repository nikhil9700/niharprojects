import { Link } from 'react-router-dom'
import { site } from './data'

export function ResumePage() {
  return (
    <div className="resume-page">
      <div className="resume-actions">
        <Link className="btn ghost" to="/" style={{ color: '#1a1714', borderColor: '#1a1714' }}>
          Back
        </Link>
        <button className="btn" type="button" onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </div>
      <article className="resume-sheet">
        <h1>{site.name}</h1>
        <div className="resume-header">
          <p className="resume-location">
            {site.city}, {site.region}
          </p>
          <div className="resume-contact-grid">
            <div>
              <span>Phone</span>
              <a href={site.phoneHref}>{site.phone}</a>
            </div>
            <div>
              <span>Email</span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <div>
              <span>Website</span>
              <a href={site.domain} target="_blank" rel="noreferrer">
                niharprojects.com
              </a>
            </div>
            <div>
              <span>LinkedIn</span>
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                thakur-nihar-singh
              </a>
            </div>
            <div>
              <span>GitHub</span>
              <a href={site.github} target="_blank" rel="noreferrer">
                niharproject/niharprojects
              </a>
            </div>
          </div>
        </div>
        <h2>Career objective</h2>
        <p>{site.objective}</p>
        <h2>Core tools</h2>
        <p>
          <strong>{site.skills.coreTools.join(' · ')}</strong>
        </p>
        <h2>Education</h2>
        {site.education.map((item) => (
          <p key={item.id}>
            <strong>{item.program}</strong>
            <br />
            {item.school}
            {item.affiliation ? ` · ${item.affiliation}` : ''} · {item.period}
            <br />
            {item.result}
            <br />
            {item.note}
          </p>
        ))}
        <h2>Semester performance</h2>
        <p>
          {site.semesters.map((row) => `Semester ${row.sem}: SGPA ${row.sgpa.toFixed(2)}`).join(' · ')}
        </p>
        <h2>Projects (Easy → Hard)</h2>
        {site.works.map((work) => (
          <p key={work.slug}>
            <strong>
              {work.title} ({work.level} · {work.tool})
            </strong>
            <br />
            {work.summary}
            <br />
            {work.bullets.map((b) => `• ${b}`).join(' ')}
          </p>
        ))}
        <h2>Technical skills</h2>
        <p>
          <strong>Excel:</strong> {site.skills.excel.join(', ')}
          <br />
          <strong>SQL:</strong> {site.skills.sql.join(', ')}
          <br />
          <strong>Power BI:</strong> {site.skills.powerbi.join(', ')}
          <br />
          <strong>Python:</strong> {site.skills.python.join(', ')}
          <br />
          <strong>Web:</strong> {site.skills.web.join(', ')}
          <br />
          <strong>Commerce base:</strong> {site.skills.commerce.join(', ')}
        </p>
        <h2>Soft skills</h2>
        <ul>
          {site.skills.soft.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2>Highlights</h2>
        <ul>
          {site.highlights.map((item) => (
            <li key={item.title}>
              <strong>{item.title}:</strong> {item.detail}
            </li>
          ))}
        </ul>
        <h2>Languages</h2>
        <p>{site.languages.map((item) => `${item.name} (${item.level})`).join(' · ')}</p>
      </article>
    </div>
  )
}
