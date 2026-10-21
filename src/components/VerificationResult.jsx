import React, { useState, useEffect, useMemo } from "react";
import api from "../utils/api.js";
import { computeFieldHash } from "../utils/contract.js";
import Rosette from "./Rosette.jsx";

const resultClasses = {
    Valid: "result-valid",
    Revoked: "result-revoked",
    "Not Found": "result-notfound",
};

export default function VerificationResult() {
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", dob: "", studentId: "", percentile: "", issuerAddress: "",
    });
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get("/universities")
            .then(({ data }) => setUniversities(data))
            .catch(() => {});
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setResult(null);
    };

    // Same hash the backend computes; drawn live so the seal forms as fields are typed.
    const liveHash = useMemo(() => {
        const f = formData;
        if (!f.firstName || !f.lastName || !f.dob || !f.studentId || !/^\d+$/.test(f.percentile) || !f.issuerAddress) return null;
        try { return computeFieldHash(f, f.issuerAddress); } catch { return null; }
    }, [formData]);

    const sealColor = !result ? "var(--ink-3)" : result.result === "Valid" ? "var(--valid)" : result.result === "Revoked" ? "var(--seal)" : "var(--umber)";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const { data } = await api.post("/verify", {
                ...formData,
                percentile: Number(formData.percentile),
            });
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verifier-grid">
            {/* Verification Form */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <h2 className="text-headline-md">Certificate details</h2>
                        <p className="text-body-sm" style={{ color: "var(--on-surface-variant)", marginTop: 2 }}>
                            Spelling, spacing and capitals must match the printed certificate.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>First name</label>
                            <input type="text" name="firstName" value={formData.firstName}
                                onChange={handleChange} required placeholder="e.g. Ananya" />
                        </div>
                        <div className="form-group">
                            <label>Last name</label>
                            <input type="text" name="lastName" value={formData.lastName}
                                onChange={handleChange} required placeholder="e.g. Rao" />
                        </div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Student ID</label>
                            <input type="text" name="studentId" value={formData.studentId}
                                onChange={handleChange} className="mono-input" required placeholder="e.g. 21BCE7781" />
                        </div>
                        <div className="form-group">
                            <label>Date of birth</label>
                            <input type="date" name="dob" value={formData.dob}
                                onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Percentile ×100</label>
                            <input type="number" name="percentile" value={formData.percentile}
                                onChange={handleChange} min="0" max="10000" placeholder="e.g. 9150 for 91.50%" required />
                        </div>
                        <div className="form-group">
                            <label>Issuing university</label>
                            <select name="issuerAddress" value={formData.issuerAddress}
                                onChange={handleChange} required>
                                <option value="">Select a university</option>
                                {universities.map((u) => (
                                    <option key={u.walletAddress} value={u.walletAddress}>
                                        {u.name} ({u.shortCode})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ marginTop: "var(--space-md)" }}
                    >
                        {loading ? "Checking the contract…" : "Verify certificate"}
                    </button>
                </form>

                {error && (
                    <div className="alert alert-error">
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                            {error}
                        </div>
                    </div>
                )}
            </div>

            <aside className="seal-panel" aria-live="polite" aria-label="Verification seal">
                {liveHash ? (
                    <div className="lp-rosette is-drawing" style={{ color: sealColor }}>
                        <Rosette hash={liveHash} animate title="Rosette drawn from the fingerprint of the fields entered" />
                    </div>
                ) : (
                    <div className="seal-empty">The seal draws itself once every field is filled in.</div>
                )}
                {liveHash && <div className="seal-serial">{liveHash}</div>}

                {result ? (
                    <div className={resultClasses[result.result]}>
                        <h2 className="result-text">{result.result}</h2>
                        <p className="result-message">{result.message}</p>
                        {result.details && (
                            <div className="result-details">
                                {result.details.issuer && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: 4 }}>
                                        <span className="text-label-caps" style={{ color: "var(--ink-3)" }}>Issuer</span>
                                        <span className="text-mono-sm" style={{ color: "var(--seal)" }}>
                                            {result.details.issuer.slice(0, 10)}…{result.details.issuer.slice(-6)}
                                        </span>
                                    </div>
                                )}
                                {result.details.issuedAt && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                                        <span className="text-label-caps" style={{ color: "var(--ink-3)" }}>Issued</span>
                                        <span className="text-mono-sm" style={{ color: "var(--ink)" }}>
                                            {new Date(result.details.issuedAt).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : liveHash ? (
                    <p className="seal-pending">Not checked yet. Press Verify certificate to look this fingerprint up on the contract.</p>
                ) : null}
            </aside>
        </div>
    );
}
