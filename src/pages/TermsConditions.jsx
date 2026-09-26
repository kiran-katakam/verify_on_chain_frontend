import React from "react";
import { Link } from "react-router";

export default function TermsConditions() {
    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ marginBottom: "var(--space-2xl)" }}>
                <span className="text-label-caps" style={{ color: "var(--tertiary)" }}>LEGAL</span>
                <h1 className="text-headline-xl" style={{ marginTop: 4 }}>Terms & Conditions</h1>
                <p className="text-body-sm" style={{ color: "var(--outline)", marginTop: 4 }}>Last updated: September 2026</p>
            </div>

            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>1. Acceptance of Terms</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        By accessing or using the VerifyOnChain platform ("the Platform"), you agree to be bound by these
                        Terms & Conditions. If you do not agree to these terms, do not use the Platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>2. Description of Service</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        VerifyOnChain is a decentralized academic credential verification system built on the Ethereum blockchain.
                        The Platform enables authorized educational institutions ("Issuers") to issue tamper-proof digital certificates
                        and allows third parties ("Verifiers") to independently verify the authenticity of those credentials.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>3. User Roles & Responsibilities</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                        <div style={{ background: "var(--surface-container-lowest)", padding: "var(--space-md)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(70,69,84,0.3)" }}>
                            <span className="text-headline-sm" style={{ color: "var(--tertiary)", display: "block", marginBottom: 4 }}>Contract Owner (Admin)</span>
                            <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                                The contract owner is responsible for whitelisting authorized university wallets.
                                The admin must verify the legitimacy of institutions before granting issuer privileges.
                            </p>
                        </div>
                        <div style={{ background: "var(--surface-container-lowest)", padding: "var(--space-md)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(70,69,84,0.3)" }}>
                            <span className="text-headline-sm" style={{ color: "var(--primary)", display: "block", marginBottom: 4 }}>University Registrar (Issuer)</span>
                            <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                                Issuers are responsible for the accuracy of certificate data. By issuing a certificate, the institution
                                attests that the student data is genuine. Issuers are responsible for revoking certificates when warranted.
                            </p>
                        </div>
                        <div style={{ background: "var(--surface-container-lowest)", padding: "var(--space-md)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(70,69,84,0.3)" }}>
                            <span className="text-headline-sm" style={{ color: "var(--secondary)", display: "block", marginBottom: 4 }}>Employer / Public (Verifier)</span>
                            <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                                Verifiers access the public verification endpoint. No account is required. Verifiers must enter
                                the original certificate data to recompute the hash and check it against the blockchain.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>4. Blockchain Transactions</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        Issuing and revoking certificates require Ethereum transactions, which consume gas fees.
                        Users are responsible for all gas costs associated with their transactions. The Platform does not
                        charge additional fees. All blockchain transactions are <strong>irreversible</strong> — once a certificate
                        is issued or revoked, the action cannot be undone.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>5. Wallet Security</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        Access to the Platform is controlled by your Ethereum wallet. You are solely responsible for
                        maintaining the security of your private keys and wallet credentials. The Platform cannot recover
                        lost wallets, reverse unauthorized transactions, or restore compromised accounts.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>6. Data Accuracy</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        The Platform verifies that a hash exists on the blockchain and was issued by a whitelisted address.
                        It does not independently verify the truth of the underlying academic claims. The issuing institution
                        bears full responsibility for data accuracy.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>7. Limitation of Liability</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        The Platform is provided "as is" without warranties of any kind. We are not liable for any damages
                        arising from the use of the Platform, including but not limited to: incorrectly issued certificates,
                        gas fees for failed transactions, or reliance on verification results for hiring decisions.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>8. Smart Contract Risks</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        The smart contract has been developed following Solidity best practices and uses OpenZeppelin libraries.
                        However, blockchain-based systems carry inherent risks including smart contract bugs, network congestion,
                        and Ethereum protocol changes. Users interact with the contract at their own risk.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>9. Modifications</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        We reserve the right to modify these Terms at any time. Continued use of the Platform after
                        changes constitutes acceptance of the new Terms. Material changes will be communicated through
                        the Platform's interface.
                    </p>
                </section>

                <section>
                    <h2 className="text-headline-sm" style={{ marginBottom: "var(--space-sm)", color: "var(--primary)" }}>10. Governing Law</h2>
                    <p className="text-body-md" style={{ color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                        These Terms shall be governed by and construed in accordance with applicable laws.
                        Any disputes arising from the use of the Platform shall be resolved through good faith negotiation.
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
