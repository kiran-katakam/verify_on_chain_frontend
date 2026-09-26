import React from "react";
import { Link } from "react-router";

export default function PrivacyPolicy() {
    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ marginBottom: "var(--space-2xl)" }}>
                <span className="text-label-caps" style={{ color: "var(--secondary)" }}>LEGAL</span>
                <h1 className="text-headline-xl" style={{ marginTop: 4 }}>Privacy Policy</h1>
                <p className="text-body-sm" style={{ color: "var(--outline)", marginTop: 4 }}>Last updated: September 2026</p>
            </div>

            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>1. Overview</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        VerifyOnChain ("the Platform") is a blockchain-based academic certificate verification system.
                        This Privacy Policy explains how we handle information in connection with the Platform.
                        Our core design principle is <strong style={{ color: "var(--secondary)" }}>privacy by design</strong> —
                        we minimize data collection and store zero personally identifiable information (PII) in our databases or on the blockchain.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>2. What Data We Collect</h2>
                    <div style={{ background: "var(--surface-container-lowest)", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)", border: "1px solid rgba(70,69,84,0.3)" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", paddingBottom: "var(--space-sm)", borderBottom: "1px solid rgba(70,69,84,0.3)" }}>Data</th>
                                    <th style={{ textAlign: "left", paddingBottom: "var(--space-sm)", borderBottom: "1px solid rgba(70,69,84,0.3)" }}>Stored Where</th>
                                    <th style={{ textAlign: "left", paddingBottom: "var(--space-sm)", borderBottom: "1px solid rgba(70,69,84,0.3)" }}>Duration</th>
                                </tr>
                            </thead>
                            <tbody className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                                <tr><td style={{ padding: "var(--space-sm) 0" }}>Wallet address</td><td>MongoDB</td><td>Until account deletion</td></tr>
                                <tr><td style={{ padding: "var(--space-sm) 0" }}>Certificate hash (keccak-256)</td><td>MongoDB + Ethereum</td><td>Permanent (on-chain)</td></tr>
                                <tr><td style={{ padding: "var(--space-sm) 0" }}>Student ID</td><td>MongoDB</td><td>Until certificate deletion</td></tr>
                                <tr><td style={{ padding: "var(--space-sm) 0" }}>Transaction hash</td><td>MongoDB + Ethereum</td><td>Permanent</td></tr>
                                <tr style={{ background: "rgba(78, 222, 163, 0.05)" }}>
                                    <td style={{ padding: "var(--space-sm) 0", color: "var(--secondary)", fontWeight: 600 }}>Names, DOB, percentile</td>
                                    <td style={{ color: "var(--secondary)" }}>NOT stored anywhere</td>
                                    <td style={{ color: "var(--secondary)" }}>Never persisted</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-body-sm" style={{ color: "var(--on-surface-variant)", marginTop: "var(--space-sm)" }}>
                        Personal data (first name, last name, date of birth, percentile) is used only transiently to compute the hash
                        and is immediately discarded. It is never written to MongoDB or the blockchain.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>3. Blockchain Immutability</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        Data written to the Ethereum blockchain is <strong>permanent and cannot be deleted</strong>. This includes:
                        certificate hashes, issuer addresses, timestamps, and revocation status. Since no PII is stored on-chain,
                        GDPR "right to erasure" requests are satisfied by design — there is nothing personal to erase.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>4. Wallet Authentication</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        We use Ethereum wallet addresses (via MetaMask or compatible providers) for authentication.
                        We do not collect passwords, email addresses, phone numbers, or any other traditional identity data.
                        Your wallet address is your sole identifier on the Platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>5. Verification Logs</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        When a certificate is verified, we log the hash queried, the result (Valid / Not Found / Revoked),
                        and the response time for analytics and research purposes. We do not log the raw fields entered by the verifier,
                        the verifier's IP address, or any identifying information about the verifier.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>6. Third-Party Services</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        The Platform uses MongoDB Atlas (cloud database) and Ethereum (public blockchain). Both are
                        subject to their own privacy policies. We do not share data with any advertising, analytics, or marketing services.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>7. Contact</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        For privacy-related inquiries, please contact the project maintainers through the project's official channels.
                    </p>
                </section>
            </div>

            <div style={{ textAlign: "center", marginTop: "var(--space-xl)" }}>
                <Link to="/" className="btn btn-ghost">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
