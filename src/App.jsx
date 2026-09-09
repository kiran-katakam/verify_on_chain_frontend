import React, { useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router";
import useWallet from "./hooks/useWallet.js";
import { setWallet } from "./utils/api.js";
import WalletConnect from "./components/WalletConnect.jsx";
import Login from "./pages/Login.jsx";
import UniversityDashboard from "./pages/UniversityDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import VerifierPage from "./pages/VerifierPage.jsx";

export default function App() {
    const wallet = useWallet();
    const [userRole, setUserRole] = useState(null);

    const handleLogin = (role) => {
        setUserRole(role);
        setWallet(wallet.account);
    };

    const handleLogout = () => {
        setUserRole(null);
        setWallet(null);
    };

    return (
        <div className="app">
            {/* Header */}
            <header className="app-header">
                <div className="header-left">
                    <Link to="/" className="logo">
                        ⛓️ VerifyOnChain
                    </Link>
                    <nav className="nav-links">
                        <Link to="/verify">Verify</Link>
                        {userRole === "university" && (
                            <Link to="/dashboard">Dashboard</Link>
                        )}
                        {userRole === "admin" && (
                            <Link to="/admin">Admin</Link>
                        )}
                    </nav>
                </div>
                <div className="header-right">
                    <WalletConnect wallet={wallet} onLogout={handleLogout} />
                </div>
            </header>

            {/* Main Content */}
            <main className="app-main">
                <Routes>
                    <Route
                        path="/"
                        element={
                            userRole === "university" ? (
                                <Navigate to="/dashboard" replace />
                            ) : userRole === "admin" ? (
                                <Navigate to="/admin" replace />
                            ) : (
                                <Login
                                    wallet={wallet}
                                    onLogin={handleLogin}
                                />
                            )
                        }
                    />
                    <Route path="/verify" element={<VerifierPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            wallet.isConnected && userRole === "university" ? (
                                <UniversityDashboard wallet={wallet} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            wallet.isConnected && userRole === "admin" ? (
                                <AdminDashboard wallet={wallet} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                </Routes>
            </main>

            {/* Footer */}
            <footer className="app-footer">
                <p>
                    VerifyOnChain — Blockchain-based Certificate Verification System
                </p>
            </footer>
        </div>
    );
}
