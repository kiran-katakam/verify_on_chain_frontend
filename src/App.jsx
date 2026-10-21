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
import Rosette from "./components/Rosette.jsx";

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
                            <span className="logo-mark"><Rosette hash={"0x" + "5a3c91e7".repeat(8)} /></span>
                            <div className="logo-text">
                                <span className="logo-title">VerifyOnChain</span>
                                <span className="logo-subtitle">
                                    {role === "admin" ? "Admin" : role === "university" ? "Registrar" : "Certificate registry"}
                                </span>
                            </div>
                        </Link>
                        <nav className="nav-links">
                            {role === "university" && (
                                <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                                    University portal
                                </Link>
                            )}
                            {role === "admin" && (
                                <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
                                    Admin console
                                </Link>
                            )}
                            <Link to="/verify" className={location.pathname === "/verify" ? "active" : ""}>
                                Verify a certificate
                            </Link>
                        </nav>
                    </div>
                    <div className="header-right">
                        {wallet.isConnected && (
                            <>
                                <div className="network-pill">
                                    <span className={`network-dot ${wallet.isCorrectNetwork ? "green" : "red"}`}></span>
                                    <span className="text-body-sm" style={{ color: "var(--ink-2)" }}>
                                        {wallet.isCorrectNetwork ? "Hardhat" : "Wrong Network"}
                                    </span>
                                </div>
                                <div className="wallet-info">
                                    <span className="wallet-address">
                                        {wallet.account.slice(0, 6)}...{wallet.account.slice(-4)}
                                    </span>
                                    <button className="btn-disconnect" onClick={wallet.disconnect} title="Disconnect" aria-label="Disconnect wallet">
                                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>power_settings_new</span>
                                    </button>
                                </div>
                            </>
                        )}
                        {!wallet.isConnected && isPublicPage && (
                            <Link to="/login" className="btn btn-sm">
                                University login
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
                <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", display: "flex", justifyContent: "space-between", gap: "var(--space-md) var(--space-xl)", flexWrap: "wrap" }}>
                    <span>VerifyOnChain, an academic research project</span>
                    <nav style={{ display: "flex", gap: "var(--space-xl)", flexWrap: "wrap" }}>
                        <Link to="/verify">Verify</Link>
                        <Link to="/login">University login</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/terms">Terms</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
