import React from "react";
import { Link } from "react-router";

export default function Login({ wallet, loadingRole, role }) {
    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-inner">
                    <div>
                        <h1 className="text-headline-xl">University and admin sign-in</h1>
                        <p className="text-body-md" style={{ color: "var(--ink-2)", marginTop: "var(--space-sm)" }}>
                            Your wallet is your identity. Connect MetaMask and the registry looks up whether this
                            address belongs to an admin or a whitelisted university.
                        </p>
                    </div>

                    <div className="login-gateway">
                        <div className="login-actions" style={{ marginTop: 0 }}>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={wallet.connect}
                                disabled={wallet.isConnected && loadingRole}
                            >
                                {wallet.isConnected && loadingRole
                                    ? "Checking this wallet's role…"
                                    : wallet.isConnected
                                        ? "Wallet connected"
                                        : "Connect MetaMask"}
                            </button>
                        </div>

                        {wallet.isConnected && (
                            <div className="resolver-container" style={{ marginTop: "var(--space-lg)" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-md)", flexWrap: "wrap" }}>
                                    <span className="text-headline-sm" style={{ color: role ? "var(--valid)" : "var(--ink-2)" }}>
                                        {loadingRole
                                            ? "Looking up role…"
                                            : role === "admin"
                                                ? "Admin wallet"
                                                : role === "university"
                                                    ? "University registrar wallet"
                                                    : "No role for this wallet"}
                                    </span>
                                    <span className="wallet-address">
                                        {wallet.account.slice(0, 6)}…{wallet.account.slice(-4)}
                                    </span>
                                </div>

                                {loadingRole && (
                                    <div className="progress-bar-track" style={{ marginTop: "var(--space-md)", marginBottom: 0 }}>
                                        <div className="progress-bar-fill" style={{ width: "60%" }}></div>
                                    </div>
                                )}

                                {!loadingRole && !role && (
                                    <p className="text-body-sm" style={{ color: "var(--ink-2)", marginTop: "var(--space-sm)" }}>
                                        This wallet isn't registered as an admin or university. Anyone can still{" "}
                                        <Link to="/verify">verify a certificate</Link> without signing in.
                                    </p>
                                )}
                            </div>
                        )}

                        {wallet.isConnected && !wallet.isCorrectNetwork && (
                            <div className="alert alert-error">
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                                    <span className="text-body-sm">MetaMask is on a different network. This build runs on Hardhat Local (chain 31337).</span>
                                    <button className="btn btn-sm" onClick={wallet.switchNetwork} style={{ marginLeft: "auto" }}>
                                        Switch to Hardhat
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <span className="text-headline-sm">Admin</span>
                            <span className="text-body-sm" style={{ color: "var(--ink-2)" }}>Onboards universities and whitelists their wallets on-chain.</span>
                        </div>
                        <div className="feature-card">
                            <span className="text-headline-sm">Registrar</span>
                            <span className="text-body-sm" style={{ color: "var(--ink-2)" }}>Issues and revokes certificates, signing each in MetaMask.</span>
                        </div>
                        <div className="feature-card">
                            <span className="text-headline-sm">Verifier</span>
                            <span className="text-body-sm" style={{ color: "var(--ink-2)" }}>Needs no sign-in. <Link to="/verify">Verify here</Link>.</span>
                        </div>
                    </div>

                    <p className="login-footer">The backend never sees a private key. Every transaction is signed in your wallet.</p>
                </div>
            </div>
        </div>
    );
}
