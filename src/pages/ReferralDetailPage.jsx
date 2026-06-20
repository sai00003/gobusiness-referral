import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import Navbar from '../components/Navbar.jsx'
import '../index.css'

const BASE_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'

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

function ReferralDetailPage() {
  const { id } = useParams()
  const [referral, setReferral] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const token = Cookies.get('jwt_token')

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true)
      setNotFound(false)
      try {
        const res = await fetch(`${BASE_URL}?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()

        if (!res.ok) {
          setNotFound(true)
          setLoading(false)
          return
        }

        const data = json.data || json

        let found = null

        if (data && data.id !== undefined && String(data.id) === String(id)) {
          found = data
        } else if (Array.isArray(data.referrals)) {
          found = data.referrals.find(r => String(r.id) === String(id)) || null
        } else if (data && typeof data === 'object') {
          const keys = Object.keys(data)
          for (const key of keys) {
            const item = data[key]
            if (item && typeof item === 'object' && String(item.id) === String(id)) {
              found = item
              break
            }
          }
        }

        if (found) {
          setReferral(found)
        } else {
          setNotFound(true)
        }
      } catch (err) {
        setNotFound(true)
      }
      setLoading(false)
    }

    fetchDetail()
  }, [id, token])

  return (
    <div className="detail-page">
      <Navbar />
      <div className="detail-content">
        <Link to="/" className="back-link">
          ← Back to dashboard
        </Link>

        <h1 className="page-heading">Referral Details</h1>
        <p className="page-subtitle">Full information for this referral partner.</p>

        {loading && <p className="loading-text">Loading…</p>}

        {!loading && notFound && (
          <p className="page-subtitle" style={{ marginTop: '24px', fontSize: '16px' }}>
            Referral not found
          </p>
        )}

        {!loading && referral && (
          <div className="detail-card">
            <div className="detail-card-header">
              <h2 className="detail-partner-name">{referral.name}</h2>
              <span className="detail-service-badge">{referral.serviceName}</span>
            </div>

            <div className="detail-row">
              <span className="detail-field-label">Referral ID</span>
              <span className="detail-field-value">{referral.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-field-label">Name</span>
              <span className="detail-field-value">{referral.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-field-label">Service Name</span>
              <span className="detail-field-value">{referral.serviceName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-field-label">Date</span>
              <span className="detail-field-value">{formatDate(referral.date)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-field-label">Profit</span>
              <span className="detail-field-value">{formatProfit(referral.profit)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferralDetailPage
