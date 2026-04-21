import React, { useState, useEffect } from 'react'
import { FiUpload, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { formatCurrency, formatDateTime } from '../../utils/helpers'
import { StatusBadge, Spinner, Table, Pagination } from '../shared/UI'

export default function DepositPage() {
  const [bankDetails, setBankDetails] = useState(null)
  const [form, setForm] = useState({ amount: '', proof: null })
  const [deposits, setDeposits] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    api.get('/settings/bank-details').then(r => setBankDetails(r.data.data)).catch(() => {})
    fetchDeposits()
  }, [page])

  const fetchDeposits = () => {
    setFetching(true)
    api.get(`/deposits?page=${page}`).then(r => {
      setDeposits(r.data.data.data || [])
      setMeta(r.data.data.meta || {})
    }).finally(() => setFetching(false))
  }

  const handleFile = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large. Max 5MB'); return }
    setForm(p => ({ ...p, proof: file }))
    setPreview(URL.createObjectURL(file))
  }

  const submit = async e => {
    e.preventDefault()
    if (!form.amount || !form.proof) { toast.error('Please fill all fields and upload proof'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('amount', form.amount)
      fd.append('proof', form.proof)
      await api.post('/deposits', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Deposit submitted! Admin will review within a few hours.')
      setForm({ amount: '', proof: null })
      setPreview(null)
      fetchDeposits()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'amount', label: 'Amount', render: r => <span className="font-mono text-white">{formatCurrency(r.amount)}</span> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'created_at', label: 'Date', render: r => <span className="text-white/50 text-xs">{formatDateTime(r.created_at)}</span> },
    { key: 'note', label: 'Note', render: r => <span className="text-white/30 text-xs">{r.admin_note || '—'}</span> },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Deposit Funds</h1>
        <p className="text-white/40 text-sm mt-1">Transfer to our bank and submit proof for approval</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bank details */}
        <div>
          <h2 className="font-display font-semibold text-white mb-4">Bank Account Details</h2>
          {bankDetails ? (
            <div className="glass-card p-6 space-y-4">
              {[
                ['Bank Name', bankDetails.bank_name],
                ['Account Name', bankDetails.account_name],
                ['Account Number', bankDetails.account_number],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center border-b border-white/8 pb-3 last:border-0 last:pb-0">
                  <span className="text-white/40 text-sm">{k}</span>
                  <span className="text-white font-mono font-semibold">{v}</span>
                </div>
              ))}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mt-2">
                <div className="flex gap-2">
                  <FiAlertCircle className="text-amber-400 shrink-0 mt-0.5" size={15} />
                  <p className="text-amber-300 text-xs">Transfer the exact amount you want to deposit, then upload your receipt below.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 text-center text-white/30 text-sm">
              Bank details not configured yet. Contact support.
            </div>
          )}
        </div>

        {/* Upload form */}
        <div>
          <h2 className="font-display font-semibold text-white mb-4">Submit Deposit</h2>
          <form onSubmit={submit} className="glass-card p-6 space-y-5">
            <div>
              <label className="text-white/60 text-sm block mb-1.5">Amount deposited (₦)</label>
              <input
                type="number" min="100" step="1"
                value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                placeholder="e.g. 5000" className="input-field" required
              />
            </div>

            <div>
              <label className="text-white/60 text-sm block mb-1.5">Upload proof of payment</label>
              <label className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${preview ? 'border-brand-500/40 bg-brand-500/5' : 'border-white/15 hover:border-white/25'}`}>
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {preview ? (
                  <div>
                    <img src={preview} alt="proof" className="max-h-40 mx-auto rounded-lg object-cover mb-2" />
                    <p className="text-brand-400 text-xs">Click to change image</p>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="text-white/30 mx-auto mb-2" size={28} />
                    <p className="text-white/40 text-sm">Click to upload screenshot/receipt</p>
                    <p className="text-white/20 text-xs mt-1">JPG, PNG · Max 5MB</p>
                  </div>
                )}
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
              {loading ? <><Spinner size="sm" />Submitting...</> : 'Submit Deposit'}
            </button>
          </form>
        </div>
      </div>

      {/* Deposit history */}
      <div>
        <h2 className="font-display font-semibold text-white mb-4">Deposit History</h2>
        <div className="glass-card overflow-hidden">
          <Table columns={columns} data={deposits} emptyMessage="No deposits yet" />
          <Pagination page={page} lastPage={meta.last_page || 1} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
