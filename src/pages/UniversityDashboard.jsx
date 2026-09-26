import React from "react";
import IssuanceForm from "../components/IssuanceForm.jsx";
import CertificateList from "../components/CertificateList.jsx";

export default function UniversityDashboard({ wallet }) {
    return (
        <div>
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                    <span className="text-label-caps" style={{
                        color: "var(--primary)",
                        background: "rgba(128, 131, 255, 0.2)",
                        padding: "2px 6px",
                        borderRadius: "var(--radius)"
                    }}>NODE INSTANCE</span>
                    <span className="text-mono-sm" style={{ color: "var(--outline)" }}>•</span>
                    <span className="text-mono-sm" style={{ color: "var(--secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--secondary)", display: "inline-block" }}></span>
                        Active
                    </span>
                </div>
                <h1 className="text-headline-xl">University Registrar Office</h1>
                <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                    Sovereign Academic Attestation Protocol • Wallet{" "}
                    <span className="text-mono-sm" style={{ color: "var(--primary)" }}>
                        {wallet.account?.slice(0, 6)}...{wallet.account?.slice(-4)}
                    </span>
                </p>
            </div>

            {/* Two-column grid */}
            <div className="dashboard-grid">
                {/* Left Panel — Issuance Engine */}
                <div className="dashboard-sections">
                    <IssuanceForm wallet={wallet} />
                </div>
                {/* Right Panel — Certificate Registry */}
                <div className="dashboard-sections">
                    <CertificateList wallet={wallet} />
                </div>
            </div>
        </div>
    );
}
