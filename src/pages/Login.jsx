import React from "react";

export default function Login({ wallet, loadingRole, role }) {
    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-inner">
                    {/* Gateway Card */}
                    <div className="login-gateway">
                        {/* Header */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "var(--space-lg)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", flexWrap: "wrap" }}>
                                <span className="text-label-caps" style={{ color: "var(--secondary)" }}>PROTOCOL V1.0</span>
                                <span className="text-mono-sm" style={{ color: "var(--outline)" }}>•</span>
                                <span className="text-label-caps" style={{ color: "var(--outline)" }}>KECCAK-256 SOVEREIGN REGISTRY</span>
                            </div>
                            <h1 className="text-headline-xl" style={{ letterSpacing: "-0.02em" }}>
                                Decentralized Credential Gateway
                            </h1>
                            <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                                Cryptographically signed registrar verification & attestation protocol on Ethereum
                            </p>
                        </div>

                        {/* Telemetry Bar */}
                        <div className="telemetry-bar">
                            <div className="telemetry-item">
                                <span className="text-label-caps" style={{ color: "var(--outline)" }}>CONTRACT</span>
                                <span className="hash-pill">
                                    <span>0x4838...91E2</span>
                                </span>
                            </div>
                            <div className="telemetry-item">
                                <span className="text-label-caps" style={{ color: "var(--outline)" }}>CHAIN</span>
                                <span className="text-mono-sm" style={{ color: "var(--on-surface)" }}>Sepolia (11155111)</span>
                            </div>
                            <div className="telemetry-item">
                                <span className="network-dot green"></span>
                                <span className="text-label-caps" style={{ color: "var(--secondary)" }}>OPERATIONAL</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="login-actions">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={wallet.connect}
                                disabled={wallet.isConnected && loadingRole}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>account_balance_wallet</span>
                                {wallet.isConnected && loadingRole
                                    ? "Detecting Role..."
                                    : wallet.isConnected
                                        ? "Wallet Connected"
                                        : "Connect Web3 Wallet"}
                            </button>
                        </div>

                        {/* Resolver Status */}
                        {wallet.isConnected && (
                            <div className="resolver-container" style={{ marginTop: "var(--space-lg)" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                                        {loadingRole ? (
                                            <>
                                                <span className="network-dot green"></span>
                                                <span className="text-mono-md" style={{ color: "var(--primary)" }}>
                                                    Detecting role from on-chain registry contract...
                                                </span>
                                            </>
                                        ) : role ? (
                                            <>
                                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--secondary)" }}>verified_user</span>
                                                <span className="text-headline-sm" style={{ color: "var(--secondary)" }}>
                                                    {role === "admin" ? "Admin Privileges Detected" : "University Registrar Detected"}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--outline)" }}>help_outline</span>
                                                <span className="text-mono-md" style={{ color: "var(--on-surface-variant)" }}>
                                                    No role found for this wallet
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <span className="text-label-caps" style={{ color: "var(--outline)" }}>
                                        {wallet.account.slice(0, 6)}...{wallet.account.slice(-4)}
                                    </span>
                                </div>

                                {loadingRole && (
                                    <div className="progress-bar-track">
                                        <div className="progress-bar-fill" style={{ width: "60%" }}></div>
                                    </div>
                                )}

                                {!loadingRole && !role && (
                                    <p className="text-body-sm" style={{ color: "var(--on-surface-variant)", marginTop: "var(--space-sm)" }}>
                                        This wallet is not registered. You can still <a href="/verify" style={{ color: "var(--primary)" }}>verify certificates publicly</a>.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Wrong Network */}
                        {wallet.isConnected && !wallet.isCorrectNetwork && (
                            <div className="alert alert-error" style={{ marginTop: "var(--space-md)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>warning</span>
                                    <span className="text-body-sm">Wrong network detected.</span>
                                    <button className="btn btn-sm" onClick={wallet.switchNetwork} style={{ marginLeft: "auto" }}>
                                        Switch to Hardhat
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Feature Cards */}
                    <div className="features-grid">
                        <div className="feature-card">
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", marginBottom: "var(--space-xs)", color: "var(--primary)" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>account_tree</span>
                                <span className="text-label-caps" style={{ color: "var(--on-surface)" }}>MERKLE ROOTS</span>
                            </div>
                            <h2 className="text-headline-sm" style={{ marginBottom: 4 }}>Tamper-Proof Ledger</h2>
                            <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                                Keccak-256 hashed student records attested on the Ethereum ledger for immutable verification.
                            </p>
                            <div style={{ marginTop: "var(--space-sm)", display: "flex", justifyContent: "space-between" }}>
                                <span className="text-mono-sm" style={{ color: "var(--outline)" }}>Root Validation</span>
                                <span className="text-mono-sm" style={{ color: "var(--secondary)", fontWeight: 600 }}>0x000...VALID</span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", marginBottom: "var(--space-xs)", color: "var(--secondary)" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>visibility_off</span>
                                <span className="text-label-caps" style={{ color: "var(--on-surface)" }}>PRIVACY</span>
                            </div>
                            <h2 className="text-headline-sm" style={{ marginBottom: 4 }}>Zero-Knowledge Design</h2>
                            <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                                No personal data stored on-chain or in databases. Only hash proofs.
                            </p>
                            <div style={{ marginTop: "var(--space-sm)", display: "flex", justifyContent: "space-between" }}>
                                <span className="text-mono-sm" style={{ color: "var(--outline)" }}>PII Exposure</span>
                                <span className="text-mono-sm" style={{ color: "var(--secondary)", fontWeight: 600 }}>None</span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", marginBottom: "var(--space-xs)", color: "var(--tertiary)" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>sync_saved_locally</span>
                                <span className="text-label-caps" style={{ color: "var(--on-surface)" }}>REVOCATION</span>
                            </div>
                            <h2 className="text-headline-sm" style={{ marginBottom: 4 }}>Instant Revocation</h2>
                            <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                                Institutional revocation updates emitted via smart contract events.
                            </p>
                            <div style={{ marginTop: "var(--space-sm)", display: "flex", justifyContent: "space-between" }}>
                                <span className="text-mono-sm" style={{ color: "var(--outline)" }}>Sync Latency</span>
                                <span className="text-mono-sm" style={{ color: "var(--secondary)", fontWeight: 600 }}>&lt; 1 Block</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer telemetry strip */}
                    <div className="login-footer" style={{ display: "flex", justifyContent: "center", gap: "var(--space-lg)" }}>
                        <span className="text-mono-sm">
                            <span className="network-dot green" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}></span>
                            EVM Gateway Synchronized
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
