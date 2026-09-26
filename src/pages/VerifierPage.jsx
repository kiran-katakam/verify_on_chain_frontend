import React from "react";
import VerificationResult from "../components/VerificationResult.jsx";

export default function VerifierPage({ wallet }) {
    return (
        <div>
            {/* Header */}
            <div className="dashboard-header">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                    <span className="text-label-caps" style={{
                        color: "var(--secondary)",
                        background: "rgba(78, 222, 163, 0.2)",
                        padding: "2px 6px",
                        borderRadius: "var(--radius)"
                    }}>PUBLIC ENDPOINT</span>
                    <span className="text-mono-sm" style={{ color: "var(--outline)" }}>•</span>
                    <span className="text-label-caps" style={{ color: "var(--outline)" }}>NO AUTHENTICATION REQUIRED</span>
                </div>
                <h1 className="text-headline-xl">Public Credential Verification Engine</h1>
                <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                    Enter the original credential data to recompute the deterministic hash and verify directly against the Ethereum ledger.
                    No personal data is transmitted or stored.
                </p>
            </div>

            <div style={{ maxWidth: 800 }}>
                <VerificationResult />
            </div>
        </div>
    );
}
