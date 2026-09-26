import React, { useState, useEffect } from "react";
import api from "../utils/api.js";

const resultIcons = {
    Valid: "verified",
    Revoked: "gpp_bad",
    "Not Found": "help_outline",
};

const resultAccents = {
    Valid: "card-accent-success",
    Revoked: "card-accent-error",
    "Not Found": "card-accent-warning",
};

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
    };

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
        <div>
            {/* Verification Form */}
            <div className="card">
                <div className="card-accent-top card-accent-primary"></div>
                <div className="card-header">
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--secondary)" }}>search</span>
                            <h2 className="text-headline-md">Credential Verification Query</h2>
                        </div>
                        <p className="text-body-sm" style={{ color: "var(--on-surface-variant)", marginTop: 2 }}>
                            Re-enter the original credential fields to compute the deterministic hash
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" value={formData.firstName}
                                onChange={handleChange} required placeholder="Julian" />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName}
                                onChange={handleChange} required placeholder="Vance" />
                        </div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Student ID / Matrikel</label>
                            <input type="text" name="studentId" value={formData.studentId}
                                onChange={handleChange} className="mono-input" required placeholder="ETHZ-2024-9941" />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input type="date" name="dob" value={formData.dob}
                                onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Percentile (×100)</label>
                            <input type="number" name="percentile" value={formData.percentile}
                                onChange={handleChange} min="0" max="10000" placeholder="9550 = 95.50%" required />
                        </div>
                        <div className="form-group">
                            <label>Issuing University</label>
                            <select name="issuerAddress" value={formData.issuerAddress}
                                onChange={handleChange} required>
                                <option value="">— Select Issuer —</option>
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
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                            {loading ? "hourglass_empty" : "fact_check"}
                        </span>
                        {loading ? "Querying Blockchain..." : "Verify Against Ethereum Ledger"}
                    </button>
                </form>

                {error && (
                    <div className="alert alert-error">
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                            <strong>Error:</strong> {error}
                        </div>
                    </div>
                )}
            </div>

            {/* Result Card */}
            {result && (
                <div className={`verification-result ${resultClasses[result.result]}`}>
                    <div className={`card-accent-top ${resultAccents[result.result]}`}></div>
                    <span className="material-symbols-outlined" style={{ fontSize: 48 }}>
                        {resultIcons[result.result]}
                    </span>
                    <h2 className="result-text">{result.result}</h2>
                    <p className="result-message">{result.message}</p>
                    {result.details && (
                        <div className="result-details">
                            {result.details.issuer && (
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: 4 }}>
                                    <span className="text-label-caps" style={{ color: "var(--outline)" }}>ISSUER</span>
                                    <span className="text-mono-sm" style={{ color: "var(--on-surface)" }}>
                                        {result.details.issuer.slice(0, 10)}...{result.details.issuer.slice(-6)}
                                    </span>
                                </div>
                            )}
                            {result.details.issuedAt && (
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                                    <span className="text-label-caps" style={{ color: "var(--outline)" }}>ISSUED</span>
                                    <span className="text-mono-sm" style={{ color: "var(--on-surface)" }}>
                                        {new Date(result.details.issuedAt).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
