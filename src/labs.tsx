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
  const rebateApplied = gross <= 1275000
  if (rebateApplied) tax = 0
  const cess = tax * 0.04
  const total = tax + cess
  return {
    standardDeduction,
    taxable,
    tax,
    cess,
    total,
    rebateApplied,
    effective: gross ? (total / gross) * 100 : 0,
    breakdown: rebateApplied ? [] : breakdown,
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
            <h4>Zero tax payable</h4>
            <p>
              {result.rebateApplied
                ? 'Section 87A rebate clears this band after the standard deduction.'
                : 'No tax in this slab.'}
            </p>
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

export function RatioStudio() {
  const [ca, setCa] = useState(450000)
  const [cl, setCl] = useState(180000)
  const [inventory, setInventory] = useState(90000)
  const [debt, setDebt] = useState(220000)
  const [equity, setEquity] = useState(500000)
  const [sales, setSales] = useState(1200000)
  const [netProfit, setNetProfit] = useState(96000)
  const [assets, setAssets] = useState(820000)
  const current = cl ? ca / cl : 0
  const quick = cl ? (ca - inventory) / cl : 0
  const de = equity ? debt / equity : 0
  const npm = sales ? (netProfit / sales) * 100 : 0
  const roa = assets ? (netProfit / assets) * 100 : 0
  return (
    <div className="panel">
      <div className="lab-grid">
        <div className="field"><label>Current assets</label><input type="number" value={ca} onChange={(e) => setCa(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Current liabilities</label><input type="number" value={cl} onChange={(e) => setCl(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Inventory</label><input type="number" value={inventory} onChange={(e) => setInventory(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Debt</label><input type="number" value={debt} onChange={(e) => setDebt(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Equity</label><input type="number" value={equity} onChange={(e) => setEquity(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Sales</label><input type="number" value={sales} onChange={(e) => setSales(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Net profit</label><input type="number" value={netProfit} onChange={(e) => setNetProfit(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Total assets</label><input type="number" value={assets} onChange={(e) => setAssets(Number(e.target.value) || 0)} /></div>
      </div>
      <div className="kpi-grid">
        <div className="kpi"><b>{current.toFixed(2)}</b><span>Current ratio</span></div>
        <div className="kpi"><b>{quick.toFixed(2)}</b><span>Quick ratio</span></div>
        <div className="kpi"><b>{de.toFixed(2)}</b><span>Debt / Equity</span></div>
        <div className="kpi"><b>{npm.toFixed(1)}%</b><span>Net margin</span></div>
      </div>
      <div className="kpi-grid">
        <div className="kpi"><b>{roa.toFixed(1)}%</b><span>ROA</span></div>
        <div className="kpi"><b>{formatINR(ca - cl)}</b><span>Working capital</span></div>
        <div className="kpi"><b>{formatINR(netProfit)}</b><span>Bottom line</span></div>
        <div className="kpi"><b>{formatINR(sales)}</b><span>Top line</span></div>
      </div>
    </div>
  )
}

export function BreakevenStudio() {
  const [price, setPrice] = useState(499)
  const [variable, setVariable] = useState(280)
  const [fixed, setFixed] = useState(180000)
  const [units, setUnits] = useState(900)
  const contrib = price - variable
  const beUnits = contrib > 0 ? fixed / contrib : 0
  const beSales = beUnits * price
  const profit = units * contrib - fixed
  const mos = beSales ? ((units * price - beSales) / (units * price)) * 100 : 0
  return (
    <div className="panel">
      <div className="lab-grid">
        <div className="field"><label>Selling price / unit</label><input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Variable cost / unit</label><input type="number" value={variable} onChange={(e) => setVariable(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Fixed costs</label><input type="number" value={fixed} onChange={(e) => setFixed(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Expected units</label><input type="number" value={units} onChange={(e) => setUnits(Number(e.target.value) || 0)} /></div>
      </div>
      <div className="kpi-grid">
        <div className="kpi"><b>{formatINR(contrib)}</b><span>Contribution / unit</span></div>
        <div className="kpi"><b>{Math.ceil(beUnits)}</b><span>Break-even units</span></div>
        <div className="kpi"><b>{formatINR(beSales)}</b><span>Break-even sales</span></div>
        <div className="kpi"><b>{mos.toFixed(1)}%</b><span>Margin of safety</span></div>
      </div>
      <div className="kpi-grid">
        <div className="kpi"><b>{formatINR(profit)}</b><span>Expected profit</span></div>
        <div className="kpi"><b>{price ? ((contrib / price) * 100).toFixed(1) : 0}%</b><span>CM ratio</span></div>
        <div className="kpi"><b>{formatINR(units * price)}</b><span>Revenue</span></div>
        <div className="kpi"><b>{formatINR(units * variable + fixed)}</b><span>Total cost</span></div>
      </div>
    </div>
  )
}

export function CashflowStudio() {
  const [inflow, setInflow] = useState(85000)
  const [outflow, setOutflow] = useState(62000)
  const [cash, setCash] = useState(140000)
  const net = inflow - outflow
  const runway = outflow > 0 && net < 0 ? cash / Math.abs(net) : net >= 0 ? 99 : 0
  return (
    <div className="panel">
      <div className="lab-grid">
        <div className="field"><label>Monthly inflow</label><input type="number" value={inflow} onChange={(e) => setInflow(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Monthly outflow</label><input type="number" value={outflow} onChange={(e) => setOutflow(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Opening cash</label><input type="number" value={cash} onChange={(e) => setCash(Number(e.target.value) || 0)} /></div>
      </div>
      <div className="kpi-grid">
        <div className="kpi"><b>{formatINR(net)}</b><span>Net cash / month</span></div>
        <div className="kpi"><b>{formatINR(cash + net)}</b><span>Closing cash</span></div>
        <div className="kpi"><b>{net >= 0 ? 'Surplus' : 'Deficit'}</b><span>Signal</span></div>
        <div className="kpi"><b>{runway >= 99 ? 'Healthy' : runway.toFixed(1) + ' mo'}</b><span>Runway</span></div>
      </div>
      <svg viewBox="0 0 400 120" style={{ width: '100%', marginTop: 18 }}>
        <rect x="40" y={110 - (inflow / Math.max(inflow, outflow, 1)) * 90} width="60" height={(inflow / Math.max(inflow, outflow, 1)) * 90} fill="#d4b483" />
        <rect x="140" y={110 - (outflow / Math.max(inflow, outflow, 1)) * 90} width="60" height={(outflow / Math.max(inflow, outflow, 1)) * 90} fill="#d98462" />
        <text x="70" y="118" textAnchor="middle" fill="#8f877b" fontSize="11">In</text>
        <text x="170" y="118" textAnchor="middle" fill="#8f877b" fontSize="11">Out</text>
      </svg>
    </div>
  )
}

export function EmiStudio() {
  const [principal, setPrincipal] = useState(500000)
  const [rate, setRate] = useState(10.5)
  const [years, setYears] = useState(5)
  const n = years * 12
  const r = rate / 12 / 100
  const emi = r ? (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1) : principal / n
  const total = emi * n
  const interest = total - principal
  const firstInterest = principal * r
  const firstPrincipal = emi - firstInterest
  return (
    <div className="panel">
      <div className="lab-grid">
        <div className="field"><label>Loan amount</label><input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Annual rate %</label><input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Tenure (years)</label><input type="number" value={years} onChange={(e) => setYears(Number(e.target.value) || 0)} /></div>
      </div>
      <div className="kpi-grid">
        <div className="kpi"><b>{formatINR(emi)}</b><span>EMI</span></div>
        <div className="kpi"><b>{formatINR(interest)}</b><span>Total interest</span></div>
        <div className="kpi"><b>{formatINR(total)}</b><span>Total payable</span></div>
        <div className="kpi"><b>{n}</b><span>Installments</span></div>
      </div>
      <p className="books" style={{ marginTop: 18 }}>
        Month 1 split ≈ Principal {formatINR(firstPrincipal)} · Interest {formatINR(firstInterest)}
      </p>
    </div>
  )
}

export function InsuranceStudio() {
  const [cover, setCover] = useState(2500000)
  const [age, setAge] = useState(22)
  const [term, setTerm] = useState(20)
  const [type, setType] = useState<'life' | 'general'>('life')
  const base = type === 'life' ? 0.00035 : 0.0011
  const ageFactor = 1 + Math.max(0, age - 25) * 0.018
  const termFactor = type === 'life' ? 1 + (term - 10) * 0.012 : 1
  const annual = cover * base * ageFactor * termFactor
  return (
    <div className="panel">
      <div className="lab-grid">
        <div className="field">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as 'life' | 'general')}>
            <option value="life">Life (term sketch)</option>
            <option value="general">General (asset sketch)</option>
          </select>
        </div>
        <div className="field"><label>Sum assured / cover</label><input type="number" value={cover} onChange={(e) => setCover(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Age</label><input type="number" value={age} onChange={(e) => setAge(Number(e.target.value) || 0)} /></div>
        <div className="field"><label>Term (years)</label><input type="number" value={term} onChange={(e) => setTerm(Number(e.target.value) || 0)} /></div>
      </div>
      <div className="kpi-grid">
        <div className="kpi"><b>{formatINR(annual)}</b><span>Est. annual premium</span></div>
        <div className="kpi"><b>{formatINR(annual / 12)}</b><span>Est. monthly</span></div>
        <div className="kpi"><b>{formatINR(cover)}</b><span>Cover</span></div>
        <div className="kpi"><b>{((annual / cover) * 1000).toFixed(2)}</b><span>₹ / ₹1000 cover</span></div>
      </div>
      <p className="disclaimer">Educational illustration only — not a quote from any insurer.</p>
    </div>
  )
}

export function SqlStudio() {
  const snippets = [
    {
      title: 'Top customers by sales',
      sql: `SELECT c.name, SUM(i.amount) AS sales
FROM customers c
JOIN invoices i ON i.customer_id = c.id
GROUP BY c.name
ORDER BY sales DESC
LIMIT 5;`,
    },
    {
      title: 'Overdue debtors',
      sql: `SELECT name, due_date, amount
FROM invoices
WHERE status = 'open' AND due_date < CURRENT_DATE
ORDER BY due_date;`,
    },
    {
      title: 'Low stock products',
      sql: `SELECT sku, name, qty_on_hand
FROM products
WHERE qty_on_hand < reorder_level
ORDER BY qty_on_hand;`,
    },
  ]
  const [active, setActive] = useState(0)
  return (
    <div className="panel">
      <div className="chips" style={{ marginBottom: 16 }}>
        {snippets.map((item, i) => (
          <button key={item.title} type="button" className="chip" onClick={() => setActive(i)} style={{ cursor: 'pointer', background: i === active ? 'var(--gold-dim)' : undefined }}>
            {item.title}
          </button>
        ))}
      </div>
      <pre className="books sql-block">{snippets[active].sql}</pre>
      <div className="heat" style={{ marginTop: 18 }}>
        <article><small>SCHEMA</small><h4>customers</h4><p>id, name, city, segment</p></article>
        <article><small>SCHEMA</small><h4>invoices</h4><p>id, customer_id, amount, due_date, status</p></article>
        <article><small>SCHEMA</small><h4>products</h4><p>sku, name, qty_on_hand, reorder_level</p></article>
      </div>
    </div>
  )
}

const studios = {
  tax: { title: 'Tax Atelier', el: <TaxStudio /> },
  ledger: { title: 'Ledger Theatre', el: <LedgerStudio /> },
  stats: { title: 'Statforge', el: <StatsStudio /> },
  board: { title: 'Insight Board', el: <BoardStudio /> },
  ratios: { title: 'Ratio Radar', el: <RatioStudio /> },
  breakeven: { title: 'Margin Map', el: <BreakevenStudio /> },
  cashflow: { title: 'Cashflow Compass', el: <CashflowStudio /> },
  emi: { title: 'EMI Lab', el: <EmiStudio /> },
  insurance: { title: 'Premium Pulse', el: <InsuranceStudio /> },
  sql: { title: 'Query Forge', el: <SqlStudio /> },
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
          <ul className="bullet-list">
            {work.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <Link className="btn ghost" to="/#work">
          Close studio
        </Link>
      </div>
      {studio.el}
    </section>
  )
}
