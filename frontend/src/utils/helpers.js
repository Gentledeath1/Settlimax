export const formatCurrency = (amount, decimals = 2) => {
  const num = parseFloat(amount) || 0
  return '₦' + num.toLocaleString('en-NG', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export const formatNumber = (num) => {
  return parseFloat(num || 0).toLocaleString('en-NG')
}

export const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatDateTime = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export const timeAgo = (date) => {
  if (!date) return '—'
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return formatDate(date)
}

export const PLANS = [
  { tier: 1,  name: 'Stack 1',  cost: 3000,   daily: 750,   total: 18750,  cycle: 25 },
  { tier: 2,  name: 'Stack 2',  cost: 5000,   daily: 1250,  total: 31250,  cycle: 25 },
  { tier: 3,  name: 'Stack 3',  cost: 7000,   daily: 1750,  total: 43750,  cycle: 25 },
  { tier: 4,  name: 'Stack 4',  cost: 10000,  daily: 2500,  total: 62500,  cycle: 25 },
  { tier: 5,  name: 'Stack 5',  cost: 15000,  daily: 3750,  total: 93750,  cycle: 25 },
  { tier: 6,  name: 'Stack 6',  cost: 20000,  daily: 5000,  total: 125000, cycle: 25 },
  { tier: 7,  name: 'Stack 7',  cost: 25000,  daily: 6250,  total: 156250, cycle: 25 },
  { tier: 8,  name: 'Stack 8',  cost: 30000,  daily: 7500,  total: 187500, cycle: 25 },
  { tier: 9,  name: 'Stack 9',  cost: 50000,  daily: 12500, total: 312500, cycle: 25 },
  { tier: 10, name: 'Stack 10', cost: 70000,  daily: 17500, total: 437500, cycle: 25 },
  { tier: 11, name: 'Stack 11', cost: 100000, daily: 25000, total: 625000, cycle: 25 },
  { tier: 12, name: 'Stack 12', cost: 150000, daily: 37500, total: 937500, cycle: 25 },
]

export const REFERRAL_BONUS = 20
export const REFERRAL_PERCENT = 5
export const SECOND_LEVEL_PERCENT = 0
export const WELCOME_BONUS = 800
export const DAILY_LOGIN_BONUS = 50
export const MIN_WITHDRAWAL = 800
export const WITHDRAWAL_CHARGE = 15
export const INCOME_INTERVAL_HOURS = 18
