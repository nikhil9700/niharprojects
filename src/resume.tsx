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
        <p className="resume-meta">
          {site.city}, {site.region} · {site.phone} · {site.email}
          <br />
          {site.domain} · LinkedIn: Thakur Nihar Singh
        </p>
        <h2>Career objective</h2>
        <p>{site.objective}</p>
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
        <h2>Projects</h2>
        {site.caseStudies.map((item) => (
          <p key={item.title}>
            <strong>{item.title}</strong> — {item.period}
            <br />
            {item.summary}
            <br />
            {item.impact.map((line) => `• ${line}`).join(' ')}
            <br />
            Stack: {item.stack.join(', ')}
          </p>
        ))}
        <h2>Interactive portfolio studios</h2>
        <ul>
          {site.works.map((work) => (
            <li key={work.slug}>
              <strong>{work.title}</strong> — {work.summary}
            </li>
          ))}
        </ul>
        <h2>Technical skills</h2>
        <p>
          <strong>Data:</strong> {site.skills.data.join(', ')}
          <br />
          <strong>Code:</strong> {site.skills.code.join(', ')}
          <br />
          <strong>Commerce:</strong> {site.skills.commerce.join(', ')}
        </p>
        <h2>Core competencies</h2>
        <ul>
          {site.skills.core.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2>Academic highlights</h2>
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
