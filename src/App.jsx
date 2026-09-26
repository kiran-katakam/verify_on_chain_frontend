import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from "react-router";
import useWallet from "./hooks/useWallet.js";
import api, { setWallet } from "./utils/api.js";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UniversityDashboard from "./pages/UniversityDashboard.jsx";
import VerifierPage from "./pages/VerifierPage.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsConditions from "./pages/TermsConditions.jsx";

export default function App() {
    const wallet = useWallet();
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(false);

    useEffect(() => {
        setWallet(wallet.account || null);
        if (!wallet.account) {
            setRole(null);
            return;
        }
        setLoadingRole(true);
        api.get("/auth/role")
            .then(({ data }) => {
                setRole(data.role || null);
                if (data.role === "admin" && location.pathname === "/login") navigate("/admin");
                else if (data.role === "university" && location.pathname === "/login") navigate("/dashboard");
            })
            .catch(() => setRole(null))
            .finally(() => setLoadingRole(false));
    }, [wallet.account]);

    const isPublicPage = ["/", "/verify", "/privacy", "/terms"].includes(location.pathname);
    const showHeader = true;

    return (
        <div className="app">
            {showHeader && (
                <header className="app-header">
                    <div className="header-left">
                        <Link to="/" className="logo">
                            <div className="logo-text">
                                <span className="logo-title">VerifyOnChain</span>
                                <span className="logo-subtitle">
                                    {role === "admin" ? "ADMIN CONSOLE" : role === "university" ? "REGISTRAR NODE" : "PUBLIC VERIFIER"}
                                </span>
                            </div>
                        </Link>
                        <nav className="nav-links">
                            {role === "university" && (
                                <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>school</span>
                                    University Portal
                                </Link>
                            )}
                            {role === "admin" && (
                                <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>admin_panel_settings</span>
                                    Admin Console
                                </Link>
                            )}
                            <Link to="/verify" className={location.pathname === "/verify" ? "active" : ""}>
                                Public Verifier
                            </Link>
                        </nav>
                    </div>
                    <div className="header-right">
                        {wallet.isConnected && (
                            <>
                                <div className="network-pill">
                                    <span className={`network-dot ${wallet.isCorrectNetwork ? "green" : "red"}`}></span>
                                    <span className="text-mono-sm" style={{ color: "var(--on-surface-variant)" }}>
                                        {wallet.isCorrectNetwork ? "Hardhat" : "Wrong Network"}
                                    </span>
                                </div>
                                <div className="wallet-info">
                                    <span className="wallet-address">
                                        {wallet.account.slice(0, 6)}...{wallet.account.slice(-4)}
                                    </span>
                                    <button className="btn-disconnect" onClick={wallet.disconnect} title="Disconnect">
                                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>power_settings_new</span>
                                    </button>
                                </div>
                            </>
                        )}
                        {!wallet.isConnected && isPublicPage && (
                            <Link to="/login" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>account_balance_wallet</span>
                                University Login
                            </Link>
                        )}
                    </div>
                </header>
            )}

            <main className="app-main">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={
                        wallet.isConnected && role
                            ? <Navigate to={role === "admin" ? "/admin" : "/dashboard"} />
                            : <Login wallet={wallet} loadingRole={loadingRole} role={role} />
                    } />
                    <Route path="/admin" element={
                        wallet.isConnected && role === "admin"
                            ? <AdminDashboard wallet={wallet} />
                            : <Navigate to="/login" />
                    } />
                    <Route path="/dashboard" element={
                        wallet.isConnected && role === "university"
                            ? <UniversityDashboard wallet={wallet} />
                            : <Navigate to="/login" />
                    } />
                    <Route path="/verify" element={<VerifierPage wallet={wallet} />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsConditions />} />
                </Routes>
            </main>

            <footer className="app-footer">
                <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-xl)", flexWrap: "wrap" }}>
                    <span className="text-mono-sm">VerifyOnChain Protocol • EVM Sovereign Registry</span>
                    <Link to="/privacy" className="text-mono-sm" style={{ color: "var(--outline)" }}>Privacy</Link>
                    <Link to="/terms" className="text-mono-sm" style={{ color: "var(--outline)" }}>Terms</Link>
                </div>
            </footer>
        </div>
    );
}
