import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { site } from './data'

function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)))
}

function mean(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

/** EASY — Excel Sheet Lab */
export function ExcelSheetStudio() {
  const [rows, setRows] = useState([
    { name: 'Notebooks', qty: 40, price: 120 },
    { name: 'Pens', qty: 100, price: 15 },
    { name: 'Bags', qty: 12, price: 850 },
    { name: 'Bottles', qty: 25, price: 199 },
  ])
  const withCalc = rows.map((r) => ({
    ...r,
    amount: r.qty * r.price,
    status: r.qty * r.price >= 5000 ? 'High' : 'Normal',
  }))
  const total = withCalc.reduce((s, r) => s + r.amount, 0)
  const avg = withCalc.length ? total / withCalc.length : 0
  const max = Math.max(...withCalc.map((r) => r.amount), 1)

  const update = (i: number, key: 'name' | 'qty' | 'price', value: string) => {
    setRows((prev) =>
      prev.map((row, idx) =>
        idx === i
          ? {
              ...row,
              [key]: key === 'name' ? value : Number(value) || 0,
            }
          : row,
      ),
    )
  }

  return (
    <div className="panel">
      <p className="disclaimer" style={{ marginTop: 0 }}>
        Excel idea: Amount = Qty × Price · Total = SUM · Average = AVERAGE · Status = IF(Amount≥5000,"High","Normal")
      </p>
      <div className="sheet-table">
        <div className="sheet-head">
          <span>Item</span>
          <span>Qty</span>
          <span>Price</span>
          <span>Amount</span>
          <span>IF Status</span>
        </div>
        {withCalc.map((row, i) => (
          <div className="sheet-row" key={i}>
            <input value={row.name} onChange={(e) => update(i, 'name', e.target.value)} />
            <input type="number" value={row.qty} onChange={(e) => update(i, 'qty', e.target.value)} />
            <input type="number" value={row.price} onChange={(e) => update(i, 'price', e.target.value)} />
            <strong>{formatINR(row.amount)}</strong>
            <span className={`grade ${row.status === 'High' ? 'gold' : 'mute'}`}>{row.status}</span>
          </div>
        ))}
      </div>
      <div className="kpi-grid">
        <div className="kpi">
          <b>{formatINR(total)}</b>
          <span>SUM total</span>
        </div>
        <div className="kpi">
          <b>{formatINR(avg)}</b>
          <span>AVERAGE</span>
        </div>
        <div className="kpi">
          <b>{withCalc.filter((r) => r.status === 'High').length}</b>
          <span>High rows (IF)</span>
        </div>
        <div className="kpi">
          <b>{rows.length}</b>
          <span>Rows</span>
        </div>
      </div>
      <svg viewBox="0 0 400 100" style={{ width: '100%', marginTop: 18 }}>
        {withCalc.map((r, i) => {
          const h = (r.amount / max) * 80
          const w = 400 / withCalc.length - 8
          return (
            <rect
              key={r.name}
              x={i * (400 / withCalc.length) + 4}
              y={90 - h}
              width={w}
              height={h}
              fill="#d4b483"
            />
          )
        })}
      </svg>
    </div>
  )
}

/** EASY — SQL Starter */
export function SqlStarterStudio() {
  type Row = { id: number; name: string; city: string; amount: number }
  const table: Row[] = [
    { id: 1, name: 'Asha Traders', city: 'Hyderabad', amount: 42000 },
    { id: 2, name: 'Ravi Stores', city: 'Warangal', amount: 18500 },
    { id: 3, name: 'Nova Mart', city: 'Hyderabad', amount: 61000 },
    { id: 4, name: 'Sai Depot', city: 'Nizamabad', amount: 9000 },
    { id: 5, name: 'Orbit Retail', city: 'Hyderabad', amount: 27500 },
  ]
  const queries: { title: string; sql: string; run: () => Row[] }[] = [
    {
      title: 'All rows',
      sql: 'SELECT id, name, city, amount\nFROM customers;',
      run: () => table,
    },
    {
      title: 'Hyderabad only',
      sql: "SELECT name, city, amount\nFROM customers\nWHERE city = 'Hyderabad';",
      run: () => table.filter((r) => r.city === 'Hyderabad'),
    },
    {
      title: 'Amount above 25000',
      sql: 'SELECT name, city, amount\nFROM customers\nWHERE amount > 25000;',
      run: () => table.filter((r) => r.amount > 25000),
    },
  ]
  const [active, setActive] = useState(0)
  const result = queries[active].run()

  return (
    <div className="panel">
      <p className="disclaimer" style={{ marginTop: 0 }}>
        SQL idea: SELECT chooses columns · FROM chooses table · WHERE filters rows
      </p>
      <div className="chips" style={{ marginBottom: 14 }}>
        {queries.map((q, i) => (
          <button
            key={q.title}
            type="button"
            className="chip"
            style={{ cursor: 'pointer', background: i === active ? 'var(--gold-dim)' : undefined }}
            onClick={() => setActive(i)}
          >
            {q.title}
          </button>
        ))}
      </div>
      <pre className="books sql-block">{queries[active].sql}</pre>
      <div className="sheet-table" style={{ marginTop: 16 }}>
        <div className="sheet-head" style={{ gridTemplateColumns: '1.4fr 1fr 1fr' }}>
          <span>Name</span>
          <span>City</span>
          <span>Amount</span>
        </div>
        {result.map((r) => (
          <div className="sheet-row" style={{ gridTemplateColumns: '1.4fr 1fr 1fr' }} key={r.id}>
            <span>{r.name}</span>
            <span>{r.city}</span>
            <strong>{formatINR(r.amount)}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

/** MEDIUM — Excel Budget Studio */
export function ExcelBudgetStudio() {
  const [lines, setLines] = useState([
    { cat: 'Rent', planned: 15000, actual: 15000 },
    { cat: 'Groceries', planned: 8000, actual: 9200 },
    { cat: 'Travel', planned: 3000, actual: 2100 },
    { cat: 'Study', planned: 4000, actual: 4500 },
    { cat: 'Misc', planned: 2000, actual: 1800 },
  ])
  const enriched = lines.map((l) => {
    const variance = l.planned - l.actual
    const used = l.planned ? (l.actual / l.planned) * 100 : 0
    return { ...l, variance, used }
  })
  const planTotal = enriched.reduce((s, l) => s + l.planned, 0)
  const actualTotal = enriched.reduce((s, l) => s + l.actual, 0)
  const varianceTotal = planTotal - actualTotal

  return (
    <div className="panel">
      <p className="disclaimer" style={{ marginTop: 0 }}>
        Excel idea: Variance = Planned − Actual · % Used = Actual/Planned · Totals like a budget sheet
      </p>
      <div className="sheet-table">
        <div className="sheet-head sheet-head-5">
          <span>Category</span>
          <span>Planned</span>
          <span>Actual</span>
          <span>Variance</span>
          <span>% Used</span>
        </div>
        {enriched.map((l, i) => (
          <div className="sheet-row sheet-row-5" key={l.cat}>
            <input
              value={l.cat}
              onChange={(e) =>
                setLines((prev) => prev.map((row, idx) => (idx === i ? { ...row, cat: e.target.value } : row)))
              }
            />
            <input
              type="number"
              value={l.planned}
              onChange={(e) =>
                setLines((prev) =>
                  prev.map((row, idx) => (idx === i ? { ...row, planned: Number(e.target.value) || 0 } : row)),
                )
              }
            />
            <input
              type="number"
              value={l.actual}
              onChange={(e) =>
                setLines((prev) =>
                  prev.map((row, idx) => (idx === i ? { ...row, actual: Number(e.target.value) || 0 } : row)),
                )
              }
            />
            <strong style={{ color: l.variance < 0 ? 'var(--warn)' : 'var(--ok)' }}>{formatINR(l.variance)}</strong>
            <span>{l.used.toFixed(0)}%</span>
          </div>
        ))}
      </div>
      <div className="kpi-grid">
        <div className="kpi">
          <b>{formatINR(planTotal)}</b>
          <span>Planned total</span>
        </div>
        <div className="kpi">
          <b>{formatINR(actualTotal)}</b>
          <span>Actual total</span>
        </div>
        <div className="kpi">
          <b>{formatINR(varianceTotal)}</b>
          <span>Variance</span>
        </div>
        <div className="kpi">
          <b>{varianceTotal >= 0 ? 'Surplus' : 'Deficit'}</b>
          <span>Signal</span>
        </div>
      </div>
    </div>
  )
}

/** MEDIUM — SQL Analyst */
export function SqlAnalystStudio() {
  const snippets = [
    {
      title: 'Top customers by sales',
      sql: `SELECT c.name, SUM(i.amount) AS sales
FROM customers c
JOIN invoices i ON i.customer_id = c.id
GROUP BY c.name
ORDER BY sales DESC;`,
      meaning: 'Join customers to invoices, total sales per customer, highest first.',
    },
    {
      title: 'Overdue open invoices',
      sql: `SELECT c.name, i.amount, i.due_date
FROM invoices i
JOIN customers c ON c.id = i.customer_id
WHERE i.status = 'open'
  AND i.due_date < CURRENT_DATE
ORDER BY i.due_date;`,
      meaning: 'Find unpaid invoices whose due date already passed.',
    },
    {
      title: 'City-wise invoice count',
      sql: `SELECT c.city, COUNT(*) AS bills
FROM customers c
JOIN invoices i ON i.customer_id = c.id
GROUP BY c.city
ORDER BY bills DESC;`,
      meaning: 'How many invoices came from each city.',
    },
  ]
  const [active, setActive] = useState(0)
  return (
    <div className="panel">
      <p className="disclaimer" style={{ marginTop: 0 }}>
        SQL idea: JOIN links tables · GROUP BY makes totals · ORDER BY sorts answers
      </p>
      <div className="chips" style={{ marginBottom: 14 }}>
        {snippets.map((s, i) => (
          <button
            key={s.title}
            type="button"
            className="chip"
            style={{ cursor: 'pointer', background: i === active ? 'var(--gold-dim)' : undefined }}
            onClick={() => setActive(i)}
          >
            {s.title}
          </button>
        ))}
      </div>
      <pre className="books sql-block">{snippets[active].sql}</pre>
      <p className="contact-note">{snippets[active].meaning}</p>
      <div className="heat" style={{ marginTop: 16 }}>
        <article>
          <small>TABLE</small>
          <h4>customers</h4>
          <p>id, name, city</p>
        </article>
        <article>
          <small>TABLE</small>
          <h4>invoices</h4>
          <p>id, customer_id, amount, due_date, status</p>
        </article>
        <article>
          <small>KEY</small>
          <h4>customer_id</h4>
          <p>Foreign key link</p>
        </article>
      </div>
    </div>
  )
}

/** HARD — Power BI Hub */
const biData = [
  { region: 'North', month: 'Apr', category: 'Retail', sales: 120000, profit: 18000 },
  { region: 'North', month: 'May', category: 'Retail', sales: 135000, profit: 21000 },
  { region: 'North', month: 'Jun', category: 'Wholesale', sales: 150000, profit: 24000 },
  { region: 'South', month: 'Apr', category: 'Retail', sales: 98000, profit: 14000 },
  { region: 'South', month: 'May', category: 'Wholesale', sales: 110000, profit: 17000 },
  { region: 'South', month: 'Jun', category: 'Retail', sales: 125000, profit: 20000 },
  { region: 'West', month: 'Apr', category: 'Wholesale', sales: 88000, profit: 11000 },
  { region: 'West', month: 'May', category: 'Retail', sales: 102000, profit: 15000 },
  { region: 'West', month: 'Jun', category: 'Retail', sales: 118000, profit: 19000 },
]

export function PowerBiStudio() {
  const [region, setRegion] = useState('All')
  const filtered = region === 'All' ? biData : biData.filter((r) => r.region === region)
  const sales = filtered.reduce((s, r) => s + r.sales, 0)
  const profit = filtered.reduce((s, r) => s + r.profit, 0)
  const margin = sales ? (profit / sales) * 100 : 0
  const months = ['Apr', 'May', 'Jun']
  const byMonth = months.map((m) => ({
    m,
    sales: filtered.filter((r) => r.month === m).reduce((s, r) => s + r.sales, 0),
  }))
  const maxM = Math.max(...byMonth.map((x) => x.sales), 1)
  const cats = ['Retail', 'Wholesale'].map((c) => ({
    c,
    sales: filtered.filter((r) => r.category === c).reduce((s, r) => s + r.sales, 0),
  }))

  return (
    <div className="panel">
      <p className="disclaimer" style={{ marginTop: 0 }}>
        Power BI idea: one filter changes all visuals — KPIs, trend, and breakdown stay in sync
      </p>
      <div className="field">
        <label>Region slicer</label>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option>All</option>
          <option>North</option>
          <option>South</option>
          <option>West</option>
        </select>
      </div>
      <div className="kpi-grid">
        <div className="kpi">
          <b>{formatINR(sales)}</b>
          <span>Sales</span>
        </div>
        <div className="kpi">
          <b>{formatINR(profit)}</b>
          <span>Profit</span>
        </div>
        <div className="kpi">
          <b>{margin.toFixed(1)}%</b>
          <span>Margin</span>
        </div>
        <div className="kpi">
          <b>{filtered.length}</b>
          <span>Rows in view</span>
        </div>
      </div>
      <h4 style={{ marginTop: 22, marginBottom: 8, fontFamily: 'var(--serif)', fontWeight: 500 }}>Trend by month</h4>
      <svg viewBox="0 0 400 140" style={{ width: '100%' }}>
        <polyline
          fill="none"
          stroke="#d4b483"
          strokeWidth="3"
          points={byMonth
            .map((x, i) => {
              const px = 40 + i * 140
              const py = 120 - (x.sales / maxM) * 90
              return `${px},${py}`
            })
            .join(' ')}
        />
        {byMonth.map((x, i) => {
          const px = 40 + i * 140
          const py = 120 - (x.sales / maxM) * 90
          return (
            <g key={x.m}>
              <circle cx={px} cy={py} r="5" fill="#f0d7a3" />
              <text x={px} y={136} textAnchor="middle" fill="#8f877b" fontSize="12">
                {x.m}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="heat" style={{ marginTop: 8 }}>
        {cats.map((c) => (
          <article key={c.c}>
            <small>CATEGORY</small>
            <h4>{c.c}</h4>
            <span className="grade">{formatINR(c.sales)}</span>
          </article>
        ))}
      </div>
    </div>
  )
}

/** HARD — Python Analytics Lab */
export function PythonLabStudio() {
  const [raw, setRaw] = useState('42000, 38500, null, 51000, 47000, 45500, 62000, 39000, 50500')
  const cleaned = useMemo(() => {
    return raw
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter((t) => t && t.toLowerCase() !== 'null' && t !== 'na')
      .map(Number)
      .filter((n) => Number.isFinite(n))
  }, [raw])

  const stats = useMemo(() => {
    if (cleaned.length < 2) return null
    const m = mean(cleaned)
    const sorted = [...cleaned].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
    const variance = mean(cleaned.map((x) => (x - m) ** 2))
    const sd = Math.sqrt(variance)
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const outliers = cleaned.filter((x) => Math.abs(x - m) > 1.5 * sd)
    return { m, median, sd, min, max, outliers, n: cleaned.length }
  }, [cleaned])

  const insights = stats
    ? [
        `Cleaned series has n=${stats.n} values after removing blanks/nulls.`,
        `Mean ≈ ${formatINR(stats.m)} and median ≈ ${formatINR(stats.median)}.`,
        `Spread (σ) ≈ ${formatINR(stats.sd)} — ${stats.sd / stats.m > 0.2 ? 'fairly variable' : 'fairly stable'} set.`,
        `Range from ${formatINR(stats.min)} to ${formatINR(stats.max)}.`,
        stats.outliers.length
          ? `Possible outlier values: ${stats.outliers.map(formatINR).join(', ')}.`
          : 'No strong outliers under a 1.5σ rule.',
      ]
    : ['Need at least 2 valid numbers.']

  const max = stats ? stats.max : 1

  return (
    <div className="panel">
      <p className="disclaimer" style={{ marginTop: 0 }}>
        Python idea: raw data → clean → describe → write insights (like a tiny pandas notebook)
      </p>
      <div className="field">
        <label>Paste numbers (use null for missing)</label>
        <textarea rows={3} value={raw} onChange={(e) => setRaw(e.target.value)} />
      </div>
      <pre className="books sql-block">{`data = [n for n in raw if n is not None]
mean = sum(data)/len(data)
# describe → insights`}</pre>
      {stats && (
        <div className="kpi-grid">
          <div className="kpi">
            <b>{stats.n}</b>
            <span>Clean n</span>
          </div>
          <div className="kpi">
            <b>{formatINR(stats.m)}</b>
            <span>Mean</span>
          </div>
          <div className="kpi">
            <b>{formatINR(stats.median)}</b>
            <span>Median</span>
          </div>
          <div className="kpi">
            <b>{formatINR(stats.sd)}</b>
            <span>σ</span>
          </div>
        </div>
      )}
      <svg viewBox="0 0 400 90" style={{ width: '100%', marginTop: 16 }}>
        {cleaned.map((n, i) => {
          const h = (n / max) * 75
          const w = 400 / Math.max(cleaned.length, 1) - 4
          return (
            <rect
              key={i}
              x={i * (400 / cleaned.length) + 2}
              y={85 - h}
              width={w}
              height={h}
              fill="#d4b483"
              opacity={0.85}
            />
          )
        })}
      </svg>
      <ul className="bullet-list">
        {insights.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  )
}

const studios = {
  'excel-sheet': { el: <ExcelSheetStudio /> },
  'sql-starter': { el: <SqlStarterStudio /> },
  'excel-budget': { el: <ExcelBudgetStudio /> },
  'sql-analyst': { el: <SqlAnalystStudio /> },
  'powerbi-hub': { el: <PowerBiStudio /> },
  'python-lab': { el: <PythonLabStudio /> },
}

export function WorkPage() {
  const { slug } = useParams()
  const work = site.works.find((item) => item.slug === slug)
  const studio = slug && slug in studios ? studios[slug as keyof typeof studios] : null
  if (!work || !studio) {
    return (
      <section className="studio">
        <h1>Project not found.</h1>
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
          Close project
        </Link>
      </div>
      {studio.el}
    </section>
  )
}
