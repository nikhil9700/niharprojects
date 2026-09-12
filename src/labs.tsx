import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { cgpa, gradeTone, site } from './data'

function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)))
}

function computeNewRegime(gross: number) {
  const standardDeduction = 75000
  const taxable = Math.max(0, gross - standardDeduction)
  const slabs = [
    { upTo: 400000, rate: 0 },
    { upTo: 800000, rate: 0.05 },
    { upTo: 1200000, rate: 0.1 },
    { upTo: 1600000, rate: 0.15 },
    { upTo: 2000000, rate: 0.2 },
    { upTo: 2400000, rate: 0.25 },
    { upTo: Infinity, rate: 0.3 },
  ]
  const breakdown: { label: string; tax: number; rate: number }[] = []
  let remaining = taxable
  let lower = 0
  let tax = 0
  for (const slab of slabs) {
    const width = slab.upTo - lower
    const chunk = Math.min(remaining, width)
    const slice = chunk * slab.rate
    if (chunk > 0 && slab.rate > 0) {
      breakdown.push({
        label: `${formatINR(lower + 1)} – ${slab.upTo === Infinity ? '∞' : formatINR(slab.upTo)}`,
        tax: slice,
        rate: slab.rate * 100,
      })
    }
    tax += slice
    remaining -= chunk
    lower = slab.upTo
    if (remaining <= 0) break
  }
  if (gross <= 1275000) tax = 0
  const cess = tax * 0.04
  const total = tax + cess
  return {
    standardDeduction,
    taxable,
    tax,
    cess,
    total,
    effective: gross ? (total / gross) * 100 : 0,
    breakdown,
  }
}

function mean(n: number[]) {
  return n.reduce((a, b) => a + b, 0) / n.length
}
function median(n: number[]) {
  const s = [...n].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}
function variance(n: number[]) {
  const m = mean(n)
  return mean(n.map((x) => (x - m) ** 2))
}

export function TaxStudio() {
  const [income, setIncome] = useState(900000)
  const result = computeNewRegime(income)
  return (
    <div className="panel">
      <div className="field">
        <label>Annual income (₹)</label>
        <input
          type="range"
          min={300000}
          max={4000000}
          step={10000}
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
        />
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value) || 0)}
        />
      </div>
      <div className="kpi-grid">
        <div className="kpi">
          <b>{formatINR(result.taxable)}</b>
          <span>Taxable</span>
        </div>
        <div className="kpi">
          <b>{formatINR(result.tax)}</b>
          <span>Income tax</span>
        </div>
        <div className="kpi">
          <b>{formatINR(result.cess)}</b>
          <span>Cess 4%</span>
        </div>
        <div className="kpi">
          <b>{result.effective.toFixed(2)}%</b>
          <span>Effective rate</span>
        </div>
      </div>
      <div className="heat" style={{ marginTop: 20 }}>
        {result.breakdown.length === 0 ? (
          <article>
            <h4>Zero tax</h4>
            <p>Rebate under 87A applied for this income band.</p>
          </article>
        ) : (
          result.breakdown.map((row) => (
            <article key={row.label}>
              <small>{row.rate}% slab</small>
              <h4>{row.label}</h4>
              <span className="grade">{formatINR(row.tax)}</span>
            </article>
          ))
        )}
      </div>
      <p className="disclaimer">
        Educational model of the new regime with ₹75,000 standard deduction and a simplified
        87A rebate. Not a tax filing. Confirm slabs with a CA before using real money.
      </p>
    </div>
  )
}

export function LedgerStudio() {
  const [desc, setDesc] = useState('Received cash from debtor')
  const [debit, setDebit] = useState('Cash A/c')
  const [credit, setCredit] = useState('Sundry Debtors A/c')
  const [amount, setAmount] = useState(25000)
  const [posted, setPosted] = useState(true)
  return (
    <div className="panel">
      <div className="field">
        <label>Narration</label>
        <input value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>
      <div className="field">
        <label>Debit account</label>
        <input value={debit} onChange={(e) => setDebit(e.target.value)} />
      </div>
      <div className="field">
        <label>Credit account</label>
        <input value={credit} onChange={(e) => setCredit(e.target.value)} />
      </div>
      <div className="field">
        <label>Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
        />
      </div>
      <button className="btn" type="button" onClick={() => setPosted(true)}>
        Post entry
      </button>
      {posted && (
        <>
          <p className="books" style={{ marginTop: 22 }}>
            {debit} .......... Dr {formatINR(amount)}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;To {credit} .......... {formatINR(amount)}
            <br />
            ({desc})
          </p>
          <div className="t-accounts">
            <div className="t-box">
              <h4>{debit}</h4>
              <div className="t-cols">
                <div>
                  Dr
                  <br />
                  {formatINR(amount)}
                </div>
                <div>Cr</div>
              </div>
            </div>
            <div className="t-box">
              <h4>{credit}</h4>
              <div className="t-cols">
                <div>Dr</div>
                <div>
                  Cr
                  <br />
                  {formatINR(amount)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function StatsStudio() {
  const [raw, setRaw] = useState('88, 91, 76, 95, 84, 90, 79, 86, 92, 81')
  const nums = useMemo(
    () =>
      raw
        .split(/[,\s]+/)
        .map((n) => Number(n))
        .filter((n) => Number.isFinite(n)),
    [raw],
  )
  const ready = nums.length > 1
  const sd = ready ? Math.sqrt(variance(nums)) : 0
  const m = ready ? mean(nums) : 0
  const sorted = [...nums].sort((a, b) => a - b)
  const q = (p: number) => {
    if (!ready) return 0
    const i = (sorted.length - 1) * p
    const lo = Math.floor(i)
    const hi = Math.ceil(i)
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo)
  }
  return (
    <div className="panel">
      <div className="field">
        <label>Series</label>
        <textarea rows={4} value={raw} onChange={(e) => setRaw(e.target.value)} />
      </div>
      <div className="kpi-grid">
        <div className="kpi">
          <b>{ready ? m.toFixed(2) : '—'}</b>
          <span>Mean</span>
        </div>
        <div className="kpi">
          <b>{ready ? median(nums).toFixed(2) : '—'}</b>
          <span>Median</span>
        </div>
        <div className="kpi">
          <b>{ready ? sd.toFixed(2) : '—'}</b>
          <span>σ</span>
        </div>
        <div className="kpi">
          <b>{ready && m ? ((sd / m) * 100).toFixed(1) + '%' : '—'}</b>
          <span>CV</span>
        </div>
      </div>
      <div className="kpi-grid">
        <div className="kpi">
          <b>{ready ? q(0.25).toFixed(2) : '—'}</b>
          <span>Q1</span>
        </div>
        <div className="kpi">
          <b>{ready ? q(0.5).toFixed(2) : '—'}</b>
          <span>Q2</span>
        </div>
        <div className="kpi">
          <b>{ready ? q(0.75).toFixed(2) : '—'}</b>
          <span>Q3</span>
        </div>
        <div className="kpi">
          <b>{ready ? nums.length : 0}</b>
          <span>n</span>
        </div>
      </div>
      <svg viewBox="0 0 400 90" style={{ width: '100%', marginTop: 18 }}>
        {ready &&
          nums.map((n, i) => {
            const max = Math.max(...nums)
            const h = (n / max) * 80
            const w = 400 / nums.length - 4
            return (
              <rect
                key={i}
                x={i * (400 / nums.length) + 2}
                y={85 - h}
                width={w}
                height={h}
                fill="#d4b483"
                opacity={0.85}
              />
            )
          })}
      </svg>
    </div>
  )
}

export function BoardStudio() {
  const max = 10
  const points = site.semesters
    .map((row, i) => {
      const x = 40 + (i * 320) / (site.semesters.length - 1)
      const y = 220 - (row.sgpa / max) * 180
      return `${x},${y}`
    })
    .join(' ')
  const honors = site.courses.filter((c) => c.grade === 'O' || c.grade === 'A+').length
  const credits = site.courses.reduce((sum, course) => sum + course.credits, 0)
  return (
    <div className="panel">
      <div className="kpi-grid">
        <div className="kpi">
          <b>{cgpa.toFixed(2)}</b>
          <span>CGPA</span>
        </div>
        <div className="kpi">
          <b>9.04</b>
          <span>Peak SGPA</span>
        </div>
        <div className="kpi">
          <b>{honors}</b>
          <span>O / A+ papers</span>
        </div>
        <div className="kpi">
          <b>{credits}</b>
          <span>Credits so far</span>
        </div>
      </div>
      <svg viewBox="0 0 400 260" style={{ width: '100%', marginTop: 24 }}>
        <polyline fill="none" stroke="#d4b483" strokeWidth="3" points={points} />
        {site.semesters.map((row, i) => {
          const x = 40 + (i * 320) / (site.semesters.length - 1)
          const y = 220 - (row.sgpa / max) * 180
          return (
            <g key={row.sem}>
              <circle cx={x} cy={y} r="6" fill="#f0d7a3" />
              <text x={x} y={y - 14} textAnchor="middle" fill="#f4ead8" fontSize="12">
                {row.sgpa.toFixed(2)}
              </text>
              <text x={x} y={244} textAnchor="middle" fill="#8f877b" fontSize="11">
                S{row.sem}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="heat">
        {site.courses.map((course) => (
          <article key={course.code + course.name}>
            <small>
              SEM {course.sem} · {course.credits} CR
            </small>
            <h4>{course.name}</h4>
            <span className={`grade ${gradeTone(course.grade)}`}>{course.grade}</span>
          </article>
        ))}
      </div>
    </div>
  )
}

const studios = {
  tax: { title: 'Tax Atelier', el: <TaxStudio /> },
  ledger: { title: 'Ledger Theatre', el: <LedgerStudio /> },
  stats: { title: 'Statforge', el: <StatsStudio /> },
  board: { title: 'Insight Board', el: <BoardStudio /> },
}

export function WorkPage() {
  const { slug } = useParams()
  const work = site.works.find((item) => item.slug === slug)
  const studio = slug && slug in studios ? studios[slug as keyof typeof studios] : null
  if (!work || !studio) {
    return (
      <section className="studio">
        <h1>Studio not found.</h1>
        <Link className="btn ghost" to="/">
          Back home
        </Link>
      </section>
    )
  }
  return (
    <section className="studio">
      <div className="studio-top">
        <div>
          <p className="kicker">{work.eyebrow}</p>
          <h1>{work.title}</h1>
          <p className="lede">{work.summary}</p>
        </div>
        <Link className="btn ghost" to="/#work">
          Close studio
        </Link>
      </div>
      {studio.el}
    </section>
  )
}
