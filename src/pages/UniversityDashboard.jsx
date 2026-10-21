import React from "react";
import IssuanceForm from "../components/IssuanceForm.jsx";
import CertificateList from "../components/CertificateList.jsx";

export default function UniversityDashboard({ wallet }) {
    return (
        <div>
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <h1 className="text-headline-xl">Registrar</h1>
                <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                    Issue certificates and revoke ones issued in error. Every action is signed by your wallet{" "}
                    <span className="wallet-address">
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
