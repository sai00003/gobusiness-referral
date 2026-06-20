import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import {
  DollarSign,
  Percent,
  Link2,
  Tag,
  TrendingUp,
  Wallet,
  Users,
  ArrowLeftRight,
} from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import '../index.css'

const BASE_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'

const METRIC_ICONS = [
  DollarSign,
  Percent,
  Link2,
  Tag,
  TrendingUp,
  Wallet,
  Users,
  ArrowLeftRight,
]

function formatDate(raw) {
  if (!raw) return ''
  return raw.replace(/-/g, '/')
}

function formatProfit(amount) {
  if (amount == null) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

function DashboardPage() {
  const navigate = useNavigate()

  const [metrics, setMetrics] = useState([])
  const [serviceSummary, setServiceSummary] = useState(null)
  const [referralInfo, setReferralInfo] = useState(null)
  const [allReferrals, setAllReferrals] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('desc')
  const [page, setPage] = useState(1)

  const PAGE_SIZE = 10

  const token = Cookies.get('jwt_token')

  function buildUrl(searchVal, sortVal) {
    const params = new URLSearchParams()
    if (searchVal) params.set('search', searchVal)
    if (sortVal) params.set('sort', sortVal)
    const qs = params.toString()
    return qs ? `${BASE_URL}?${qs}` : BASE_URL
  }

  const fetchReferrals = useCallback(
    async (searchVal, sortVal) => {
      setLoading(true)
      setError('')
      try {
        const url = buildUrl(searchVal, sortVal)
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (!res.ok) {
          setError(json.message ? `${json.message} (${res.status})` : `Error ${res.status}`)
          setLoading(false)
          return
        }

        const data = json.data || json
        if (data.metrics) setMetrics(data.metrics)
        if (data.serviceSummary) setServiceSummary(data.serviceSummary)
        if (data.referral) setReferralInfo(data.referral)
        if (Array.isArray(data.referrals)) setAllReferrals(data.referrals)
      } catch (err) {
        setError('Failed to load referrals. Please check your connection.')
      }
      setLoading(false)
    },
    [token]
  )

  useEffect(() => {
    fetchReferrals('', 'desc')
  }, [fetchReferrals])

  function handleSearch(val) {
    setSearch(val)
    setPage(1)
    fetchReferrals(val, sort)
  }

  function handleSort(val) {
    setSort(val)
    setPage(1)
    fetchReferrals(search, val)
  }

  const totalEntries = allReferrals.length
  const totalPages = Math.max(1, Math.ceil(totalEntries / PAGE_SIZE))
  const pageStart = (page - 1) * PAGE_SIZE
  const pageEnd = Math.min(pageStart + PAGE_SIZE, totalEntries)
  const currentRows = allReferrals.slice(pageStart, pageEnd)

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-content">
        <h1 className="page-heading">Referral Dashboard</h1>
        <p className="page-subtitle">
          Track your referrals, earnings, and partner activity in one place.
        </p>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <p className="loading-text">Loading…</p>
        ) : (
          <>
            <section
              className="section-card"
              role="region"
              aria-label="Overview metrics"
            >
              <h2 className="section-title">Overview</h2>
              <div className="metrics-grid">
                {metrics.map((m, i) => {
                  const Icon = METRIC_ICONS[i] || DollarSign
                  return (
                    <div className="metric-card" key={m.id || i}>
                      <div className="metric-icon">
                        <Icon size={18} color="#ffffff" />
                      </div>
                      <div className="metric-value">{m.value}</div>
                      <div className="metric-label">{m.label}</div>
                    </div>
                  )
                })}
              </div>
            </section>

            {serviceSummary && (
              <section className="section-card" aria-label="Service summary">
                <h2 className="section-title">Service summary</h2>
                <div className="service-summary-grid">
                  <div className="service-summary-cell">
                    <div className="summary-label">Service</div>
                    <div className="summary-value">{serviceSummary.service}</div>
                  </div>
                  <div className="service-summary-cell">
                    <div className="summary-label">Your Referrals</div>
                    <div className="summary-value-plain">{serviceSummary.yourReferrals}</div>
                  </div>
                  <div className="service-summary-cell">
                    <div className="summary-label">Active Referrals</div>
                    <div className="summary-value-plain">{serviceSummary.activeReferrals}</div>
                  </div>
                  <div className="service-summary-cell">
                    <div className="summary-label">Total Ref. Earnings</div>
                    <div className="summary-value-plain">{serviceSummary.totalRefEarnings}</div>
                  </div>
                </div>
              </section>
            )}

            {referralInfo && (
              <section className="section-card" aria-label="Share referral">
                <h2 className="section-title">Refer friends and earn more</h2>
                <div className="referral-share-row">
                  <div>
                    <div className="share-field-label">Your Referral Link</div>
                    <div className="share-input-row">
                      <input
                        type="text"
                        className="share-input"
                        value={referralInfo.link}
                        readOnly
                        aria-label="Your referral link"
                      />
                      <button
                        className="btn-copy"
                        onClick={() => copyToClipboard(referralInfo.link)}
                        aria-label="Copy referral link"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="share-field-label">Your Referral Code</div>
                    <div className="share-input-row">
                      <input
                        type="text"
                        className="share-input"
                        value={referralInfo.code}
                        readOnly
                        aria-label="Your referral code"
                      />
                      <button
                        className="btn-copy"
                        onClick={() => copyToClipboard(referralInfo.code)}
                        aria-label="Copy referral code"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="section-card">
              <h2 className="section-title">All referrals</h2>

              <div className="table-controls">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Name or service…"
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  aria-label="Search referrals"
                />
                <div className="sort-row">
                  <span className="sort-label-text">Sort by date</span>
                  <select
                    className="sort-select"
                    value={sort}
                    onChange={e => handleSort(e.target.value)}
                    aria-label="Sort referrals by date"
                  >
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </div>
              </div>

              <table className="referrals-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="empty-table">
                        No matching entries
                      </td>
                    </tr>
                  ) : (
                    currentRows.map(row => (
                      <tr
                        key={row.id}
                        onClick={() => navigate(`/referral/${row.id}`)}
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter') navigate(`/referral/${row.id}`)
                        }}
                      >
                        <td>{row.name}</td>
                        <td>{row.serviceName}</td>
                        <td>{formatDate(row.date)}</td>
                        <td className="profit-cell">{formatProfit(row.profit)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {totalEntries > 0 && (
                <div className="pagination-area">
                  <span className="pagination-summary">
                    Showing {pageStart + 1}–{pageEnd} of {totalEntries} entries
                  </span>
                  <div className="pagination-controls">
                    <button
                      className="page-btn"
                      onClick={() => setPage(p => p - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                      <button
                        key={num}
                        className={`page-btn${page === num ? ' active' : ''}`}
                        onClick={() => setPage(num)}
                      >
                        {num}
                      </button>
                    ))}

                    <button
                      className="page-btn"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="dashboard-footer">
        <span className="footer-brand">Go Business</span>
        <nav className="footer-nav" aria-label="Footer">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </nav>
        <span className="footer-copyright">© 2024 Go Business, Inc.</span>
      </footer>
    </div>
  )
}

export default DashboardPage
