import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PageLoader } from "./components/shared/UI";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./components/dashboard/Overview";
import InvestPage from "./components/dashboard/InvestPage";
import DepositPage from "./components/dashboard/DepositPage";
import WithdrawPage from "./components/dashboard/WithdrawPage";
import {
  ReferralsPage,
  TransactionHistoryPage,
  ProfilePage,
} from "./components/dashboard/DashboardPages";

import AdminLayout from "./components/admin/AdminLayout";
import {
  AdminOverview,
  AdminUsers,
  AdminDeposits,
  AdminWithdrawals,
  AdminSettings,
  AdminTransactions,
  AdminInvestments,
} from "./components/admin/AdminPages";

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin")
    return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) {
    const dest = user.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={dest} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="invest" element={<InvestPage />} />
        <Route path="deposit" element={<DepositPage />} />
        <Route path="withdraw" element={<WithdrawPage />} />
        <Route path="referrals" element={<ReferralsPage />} />
        <Route path="history" element={<TransactionHistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <PrivateRoute adminOnly>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="deposits" element={<AdminDeposits />} />
        <Route path="withdrawals" element={<AdminWithdrawals />} />
        <Route path="investments" element={<AdminInvestments />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a164d",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
            },
            success: {
              iconTheme: { primary: "#34d399", secondary: "#1a164d" },
            },
            error: { iconTheme: { primary: "#f87171", secondary: "#1a164d" } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
