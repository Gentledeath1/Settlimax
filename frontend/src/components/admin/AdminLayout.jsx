import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiUsers, FiArrowDownCircle, FiArrowUpCircle,
  FiSettings, FiLogOut, FiMenu, FiX, FiTrendingUp, FiList
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Logo from '../shared/Logo'
import { formatCurrency } from '../../utils/helpers'

const adminNav = [
  { to: '/admin',                  icon: FiGrid,            label: 'Overview',   end: true },
  { to: '/admin/users',            icon: FiUsers,           label: 'Users' },
  { to: '/admin/deposits',         icon: FiArrowDownCircle, label: 'Deposits' },
  { to: '/admin/withdrawals',      icon: FiArrowUpCircle,   label: 'Withdrawals' },
  { to: '/admin/investments',      icon: FiTrendingUp,      label: 'Investments' },
  { to: '/admin/transactions',     icon: FiList,            label: 'Transactions' },
  { to: '/admin/settings',         icon: FiSettings,        label: 'Settings' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/8">
        <Logo size="sm" />
        <span className="text-xs text-brand-400 font-mono mt-1 block">Admin Panel</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {adminNav.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}>
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/8">
        <p className="text-white/30 text-xs mb-3 px-1">Logged in as <span className="text-white">{user?.name}</span></p>
        <button onClick={handleLogout} className="sidebar-link w-full text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/8">
          <FiLogOut size={18} /><span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-dark-800 border-r border-white/8 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-dark-800 border-r border-white/8 h-full">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white p-1">
              <FiX size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-dark-900/95 backdrop-blur border-b border-white/8 px-4 sm:px-6 h-16 flex items-center justify-between">
          <button className="lg:hidden text-white/60 hover:text-white p-1" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={22} />
          </button>
          <div className="hidden lg:flex items-center gap-2">
            <span className="badge-danger">Admin</span>
            <span className="text-white/40 text-sm">{user?.name}</span>
          </div>
          <div className="ml-auto w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center font-display font-bold text-rose-400 text-sm">
            A
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
