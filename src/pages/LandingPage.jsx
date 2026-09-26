import React from "react";
import { Link } from "react-router";

export default function LandingPage() {
    return (
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
            {/* ═══ HERO ═══ */}
            <section style={{ textAlign: "center", padding: "var(--space-3xl) 0 var(--space-2xl)" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-sm)", marginBottom: "var(--space-lg)", flexWrap: "wrap" }}>
                    <span className="text-label-caps" style={{ color: "var(--secondary)", background: "rgba(78, 222, 163, 0.15)", padding: "3px 8px", borderRadius: "var(--radius)" }}>
                        EVM SOVEREIGN REGISTRY
                    </span>
                    <span className="text-label-caps" style={{ color: "var(--outline)", background: "var(--surface-container-high)", padding: "3px 8px", borderRadius: "var(--radius)" }}>
                        KECCAK-256 • PRIVACY-BY-DESIGN
                    </span>
                </div>

                <h1 className="text-display-lg" style={{ maxWidth: 720, margin: "0 auto var(--space-lg)" }}>
                    Tamper-Proof Academic Credentials on Ethereum
                </h1>

                <p className="text-body-lg" style={{ color: "var(--on-surface-variant)", maxWidth: 600, margin: "0 auto var(--space-xl)" }}>
                    VerifyOnChain enables universities to issue cryptographically anchored certificates.
                    Employers verify authenticity in seconds — no intermediaries, no personal data exposure.
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-md)", flexWrap: "wrap" }}>
                    <Link to="/verify" className="btn btn-primary" style={{ textDecoration: "none" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>fact_check</span>
                        Verify a Certificate
                    </Link>
                    <Link to="/login" className="btn" style={{ textDecoration: "none" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>account_balance_wallet</span>
                        University Login
                    </Link>
                </div>

                {/* Telemetry strip */}
                <div style={{
                    display: "flex", justifyContent: "center", gap: "var(--space-xl)", marginTop: "var(--space-2xl)",
                    flexWrap: "wrap",
                }}>
                    {[
                        { label: "PROTOCOL", value: "Solidity ^0.8.20" },
                        { label: "HASH", value: "Keccak-256" },
                        { label: "PRIVACY", value: "Zero PII On-Chain" },
                        { label: "STATUS", value: "Operational", dot: true },
                    ].map((item) => (
                        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {item.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--secondary)", display: "inline-block" }}></span>}
                            <span className="text-label-caps" style={{ color: "var(--outline)" }}>{item.label}</span>
                            <span className="text-mono-sm" style={{ color: item.dot ? "var(--secondary)" : "var(--on-surface)" }}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ HOW IT WORKS ═══ */}
            <section style={{ padding: "var(--space-2xl) 0" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
                    <span className="text-label-caps" style={{ color: "var(--primary)" }}>ARCHITECTURE</span>
                    <h2 className="text-headline-xl" style={{ marginTop: 4 }}>How It Works</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-xl)" }}>
                    {[
                        {
                            icon: "school",
                            color: "var(--primary)",
                            title: "1. University Issues",
                            desc: "The registrar enters student data (name, DOB, student ID, percentile). The system computes a keccak-256 hash of all fields + the university's wallet address. The hash is anchored on Ethereum via a MetaMask-signed transaction.",
                            detail: "No raw student data is stored anywhere — only the 32-byte hash exists on-chain and in the database.",
                        },
                        {
                            icon: "fact_check",
                            color: "var(--secondary)",
                            title: "2. Employer Verifies",
                            desc: "The employer enters the same raw fields (from the student's physical certificate) and selects the issuing university. The system recomputes the hash and checks it against the blockchain.",
                            detail: "If the hash matches → Valid. If no match → the data was tampered with or never issued.",
                        },
                        {
                            icon: "gavel",
                            color: "var(--error)",
                            title: "3. University Revokes",
                            desc: "If a credential needs to be invalidated (academic misconduct, data error), the issuing university can revoke the certificate on-chain. The hash remains but is marked as invalid.",
                            detail: "Revocation is permanent, on-chain, and immediately visible to all verifiers globally.",
                        },
                    ].map((step) => (
                        <div key={step.title} className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 22, color: step.color }}>{step.icon}</span>
                                <h3 className="text-headline-sm">{step.title}</h3>
                            </div>
                            <p className="text-body-md" style={{ color: "var(--on-surface-variant)" }}>{step.desc}</p>
                            <div style={{
                                background: "var(--surface-container-lowest)", padding: "var(--space-sm) var(--space-md)",
                                borderRadius: "var(--radius)", border: "1px solid rgba(70, 69, 84, 0.3)"
                            }}>
                                <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: "middle", marginRight: 4, color: "var(--tertiary)" }}>info</span>
                                    {step.detail}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ ARCHITECTURE DEEP DIVE ═══ */}
            <section style={{ padding: "var(--space-2xl) 0" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
                    <span className="text-label-caps" style={{ color: "var(--tertiary)" }}>SYSTEM LAYERS</span>
                    <h2 className="text-headline-xl" style={{ marginTop: 4 }}>Three-Layer Architecture</h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
                    {/* Smart Contract */}
                    <div className="card">
                        <div className="card-accent-top" style={{ background: "var(--primary)" }}></div>
                        <div style={{ display: "flex", gap: "var(--space-xl)", flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 320px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: "var(--primary)" }}>memory</span>
                                    <h3 className="text-headline-md">Smart Contract</h3>
                                    <span className="text-label-caps" style={{ color: "var(--primary)", background: "rgba(128, 131, 255, 0.15)", padding: "2px 6px", borderRadius: "var(--radius)" }}>
                                        SOLIDITY ^0.8.20
                                    </span>
                                </div>
                                <p className="text-body-md" style={{ color: "var(--on-surface-variant)", marginBottom: "var(--space-md)" }}>
                                    The immutable source of truth. Stores certificate hashes on Ethereum, manages issuer whitelisting,
                                    and handles revocation. No personal data ever touches the chain.
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                                    {[
                                        ["issueCertificate(bytes32)", "Anchor a hash on-chain"],
                                        ["verifyCertificate(bytes32)", "Query validity (gas-free)"],
                                        ["revokeCertificate(bytes32)", "Permanently invalidate"],
                                        ["addAuthorizedIssuer(address)", "Whitelist a university"],
                                    ].map(([fn, desc]) => (
                                        <div key={fn} style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-xs) 0", borderBottom: "1px solid rgba(70,69,84,0.2)" }}>
                                            <code className="text-mono-sm" style={{ color: "var(--primary)" }}>{fn}</code>
                                            <span className="text-body-sm" style={{ color: "var(--outline)" }}>{desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ flex: "0 0 280px", background: "var(--surface-container-lowest)", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)", border: "1px solid rgba(70,69,84,0.3)" }}>
                                <span className="text-label-caps" style={{ color: "var(--outline)", display: "block", marginBottom: "var(--space-sm)" }}>STORAGE MAPPING</span>
                                <code className="text-mono-md" style={{ color: "var(--primary-fixed)", display: "block", lineHeight: 1.8 }}>
                                    {`mapping(bytes32 => Certificate)`}<br />
                                    <br />
                                    <span style={{ color: "var(--outline)" }}>{"// Certificate {"}</span><br />
                                    <span style={{ color: "var(--on-surface-variant)" }}>{"  issuer: address"}</span><br />
                                    <span style={{ color: "var(--on-surface-variant)" }}>{"  timestamp: uint256"}</span><br />
                                    <span style={{ color: "var(--on-surface-variant)" }}>{"  isValid: bool"}</span><br />
                                    <span style={{ color: "var(--outline)" }}>{"// }"}</span>
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Backend */}
                    <div className="card">
                        <div className="card-accent-top" style={{ background: "var(--secondary)" }}></div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 22, color: "var(--secondary)" }}>dns</span>
                            <h3 className="text-headline-md">Backend API</h3>
                            <span className="text-label-caps" style={{ color: "var(--secondary)", background: "rgba(78, 222, 163, 0.15)", padding: "2px 6px", borderRadius: "var(--radius)" }}>
                                EXPRESS + MONGODB ATLAS
                            </span>
                        </div>
                        <p className="text-body-md" style={{ color: "var(--on-surface-variant)", marginBottom: "var(--space-md)" }}>
                            Coordination layer between the frontend and blockchain. Validates fields, computes hashes, tracks certificate lifecycle
                            (pending → issued → revoked) in MongoDB. <strong style={{ color: "var(--secondary)" }}>Stores zero personal data</strong> — only the hash persists.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-md)" }}>
                            {[
                                { label: "AUTH", value: "Wallet-based (x-wallet-address)" },
                                { label: "HASH FUNCTION", value: "solidityPackedKeccak256" },
                                { label: "SCHEMA FIELDS", value: "6 (name, DOB, ID, %, issuer)" },
                                { label: "PII STORED", value: "None (privacy-by-design)" },
                            ].map((item) => (
                                <div key={item.label} style={{ background: "var(--surface-container-lowest)", padding: "var(--space-md)", borderRadius: "var(--radius)", border: "1px solid rgba(70,69,84,0.2)" }}>
                                    <span className="text-label-caps" style={{ color: "var(--outline)", display: "block", marginBottom: 4 }}>{item.label}</span>
                                    <span className="text-mono-sm" style={{ color: "var(--on-surface)" }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Frontend */}
                    <div className="card">
                        <div className="card-accent-top" style={{ background: "var(--tertiary)" }}></div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 22, color: "var(--tertiary)" }}>web</span>
                            <h3 className="text-headline-md">Frontend</h3>
                            <span className="text-label-caps" style={{ color: "var(--tertiary)", background: "rgba(255, 185, 95, 0.15)", padding: "2px 6px", borderRadius: "var(--radius)" }}>
                                REACT + VITE
                            </span>
                        </div>
                        <p className="text-body-md" style={{ color: "var(--on-surface-variant)", marginBottom: "var(--space-md)" }}>
                            Three role-based dashboards connected via MetaMask. The admin onboards universities,
                            registrars issue certificates through a 4-step consensus pipeline, and employers verify publicly without authentication.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-md)" }}>
                            {[
                                { icon: "admin_panel_settings", label: "Admin Console", desc: "Onboard universities & whitelist on-chain", color: "var(--tertiary)" },
                                { icon: "school", label: "University Portal", desc: "Issue, manage & revoke certificates", color: "var(--primary)" },
                                { icon: "verified", label: "Public Verifier", desc: "Zero-auth hash verification against Ethereum", color: "var(--secondary)" },
                            ].map((dash) => (
                                <div key={dash.label} style={{ background: "var(--surface-container-lowest)", padding: "var(--space-md)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(70,69,84,0.3)" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: dash.color, display: "block", marginBottom: "var(--space-xs)" }}>{dash.icon}</span>
                                    <span className="text-headline-sm" style={{ display: "block", marginBottom: 2 }}>{dash.label}</span>
                                    <span className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>{dash.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ HASH SCHEMA ═══ */}
            <section style={{ padding: "var(--space-2xl) 0" }}>
                <div className="card" style={{ textAlign: "center" }}>
                    <div className="card-accent-top card-accent-primary"></div>
                    <span className="text-label-caps" style={{ color: "var(--outline)" }}>IDENTITY SCHEMA</span>
                    <h2 className="text-headline-xl" style={{ marginTop: 4, marginBottom: "var(--space-lg)" }}>
                        How the Hash Is Computed
                    </h2>
                    <div style={{
                        background: "var(--surface-container-lowest)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)",
                        border: "1px solid rgba(70,69,84,0.3)", display: "inline-block", textAlign: "left", maxWidth: 600, width: "100%",
                    }}>
                        <code className="text-mono-md" style={{ color: "var(--primary-fixed)", lineHeight: 2.2, display: "block" }}>
                            <span style={{ color: "var(--outline)" }}>keccak256(abi.encodePacked(</span><br />
                            {"  "}<span style={{ color: "var(--on-surface)" }}>firstName</span><span style={{ color: "var(--outline)" }}>,{"    "}</span><span className="text-mono-sm" style={{ color: "var(--outline)" }}>// string</span><br />
                            {"  "}<span style={{ color: "var(--on-surface)" }}>lastName</span><span style={{ color: "var(--outline)" }}>,{"     "}</span><span className="text-mono-sm" style={{ color: "var(--outline)" }}>// string</span><br />
                            {"  "}<span style={{ color: "var(--on-surface)" }}>dob</span><span style={{ color: "var(--outline)" }}>,{"          "}</span><span className="text-mono-sm" style={{ color: "var(--outline)" }}>// string "YYYY-MM-DD"</span><br />
                            {"  "}<span style={{ color: "var(--on-surface)" }}>studentId</span><span style={{ color: "var(--outline)" }}>,{"    "}</span><span className="text-mono-sm" style={{ color: "var(--outline)" }}>// string "21BCE7777"</span><br />
                            {"  "}<span style={{ color: "var(--on-surface)" }}>percentile</span><span style={{ color: "var(--outline)" }}>,{"   "}</span><span className="text-mono-sm" style={{ color: "var(--outline)" }}>// uint256 (×100)</span><br />
                            {"  "}<span style={{ color: "var(--secondary)" }}>issuerAddress</span><span style={{ color: "var(--outline)" }}>{" "}</span><span className="text-mono-sm" style={{ color: "var(--outline)" }}>// address (university wallet)</span><br />
                            <span style={{ color: "var(--outline)" }}>))</span>
                        </code>
                    </div>
                    <p className="text-body-sm" style={{ color: "var(--on-surface-variant)", marginTop: "var(--space-lg)", maxWidth: 500, margin: "var(--space-lg) auto 0" }}>
                        The issuer's wallet address is baked into the hash — the same student data issued by two different universities produces different hashes.
                        If any single character changes, the entire hash changes.
                    </p>
                </div>
            </section>

            {/* ═══ PRIVACY & SECURITY ═══ */}
            <section style={{ padding: "var(--space-2xl) 0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)" }}>
                    <div className="card">
                        <span className="material-symbols-outlined" style={{ fontSize: 28, color: "var(--secondary)", display: "block", marginBottom: "var(--space-md)" }}>shield</span>
                        <h3 className="text-headline-md" style={{ marginBottom: "var(--space-sm)" }}>Privacy by Design</h3>
                        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                            {[
                                "No names, DOBs, or grades stored in the database",
                                "Only the 32-byte keccak-256 hash persists in MongoDB",
                                "On-chain storage contains zero personal identifiers",
                                "Verification is a hash comparison — no data retrieval",
                                "Database breach exposes zero personal information",
                            ].map((item, i) => (
                                <li key={i} className="text-body-md" style={{ color: "var(--on-surface-variant)", display: "flex", alignItems: "flex-start", gap: "var(--space-sm)" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--secondary)", marginTop: 2, flexShrink: 0 }}>check_circle</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="card">
                        <span className="material-symbols-outlined" style={{ fontSize: 28, color: "var(--primary)", display: "block", marginBottom: "var(--space-md)" }}>lock</span>
                        <h3 className="text-headline-md" style={{ marginBottom: "var(--space-sm)" }}>Security Model</h3>
                        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                            {[
                                "Wallet-based authentication — no passwords",
                                "Only whitelisted university wallets can issue",
                                "Only the original issuer can revoke their own certs",
                                "Smart contract inherits OpenZeppelin Ownable",
                                "Immutable on-chain audit trail via event logs",
                            ].map((item, i) => (
                                <li key={i} className="text-body-md" style={{ color: "var(--on-surface-variant)", display: "flex", alignItems: "flex-start", gap: "var(--space-sm)" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--primary)", marginTop: 2, flexShrink: 0 }}>check_circle</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section style={{ padding: "var(--space-2xl) 0", textAlign: "center" }}>
                <div className="card" style={{ background: "var(--surface-container)", borderColor: "rgba(192, 193, 255, 0.2)" }}>
                    <h2 className="text-headline-xl" style={{ marginBottom: "var(--space-sm)" }}>Ready to Verify?</h2>
                    <p className="text-body-lg" style={{ color: "var(--on-surface-variant)", marginBottom: "var(--space-xl)" }}>
                        No account needed. Just enter the certificate data and verify instantly against the Ethereum blockchain.
                    </p>
                    <Link to="/verify" className="btn btn-primary" style={{ textDecoration: "none" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>fact_check</span>
                        Start Verification
                    </Link>
                </div>
            </section>

            {/* ═══ FOOTER LINKS ═══ */}
            <section style={{ padding: "var(--space-xl) 0", borderTop: "1px solid rgba(70,69,84,0.3)", display: "flex", justifyContent: "center", gap: "var(--space-xl)" }}>
                <Link to="/privacy" className="text-body-sm" style={{ color: "var(--outline)" }}>Privacy Policy</Link>
                <Link to="/terms" className="text-body-sm" style={{ color: "var(--outline)" }}>Terms & Conditions</Link>
                <Link to="/verify" className="text-body-sm" style={{ color: "var(--outline)" }}>Verify Certificate</Link>
                <Link to="/login" className="text-body-sm" style={{ color: "var(--outline)" }}>University Login</Link>
            </section>
        </div>
    );
}
