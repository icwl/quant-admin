import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage'
import UpdateTOTPPage from './pages/UpdateTOTPPage';
import SwapListPage from './pages/SwapListPage';
import SwapEditPage from './pages/SwapEditPage';
import DepositWithdrawalListPage from './pages/DepositWithdrawalListPage';
import ErrorManagementPage from './pages/ErrorManagementPage';
import { ToastContainer } from 'react-toastify';

// 受保护的布局组件
const ProtectedLayout = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="layout">
      <Header />
      <Sidebar />
      <main className="content">
        <div className="pt-3 ps-3 h-100">
          <div className="card p-3 border-0 shadow-sm h-100">
            <Routes>
              <Route path="/user" element={<UserPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              <Route path="/update-totp" element={<UpdateTOTPPage />} />

              <Route path="/swaps" element={<SwapListPage />} />
              <Route path="/swap/add" element={<SwapEditPage />} />
              <Route path="/swap/edit/:id" element={<SwapEditPage />} />
              <Route path="/deposit-withdrawal-settings" element={<DepositWithdrawalListPage />} />
              <Route path="/error-management" element={<ErrorManagementPage />} />
            </Routes>
          </div>
        </div>
        <ToastContainer position="top-center" />
      </main>
    </div>
  );
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </Router>
  )
}

export default App
