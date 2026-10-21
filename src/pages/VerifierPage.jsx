import React from "react";
import VerificationResult from "../components/VerificationResult.jsx";

export default function VerifierPage({ wallet }) {
    return (
        <div>
            {/* Header */}
            <div className="dashboard-header">
                <h1 className="text-headline-xl">Verify a certificate</h1>
                <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                    Type the fields exactly as they appear on the certificate and pick the issuing university.
                    The fingerprint is recomputed and checked against the contract. Nothing you type is stored.
                </p>
            </div>

            <VerificationResult />
        </div>
    );
}
