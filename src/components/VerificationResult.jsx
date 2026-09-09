import React, { useState, useEffect } from "react";
import api from "../utils/api.js";

export default function VerificationResult() {
    const [universities, setUniversities] = useState([]);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        studentId: "",
        percentile: "",
        issuerAddress: "",
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch universities for the dropdown
    useEffect(() => {
        api.get("/universities")
            .then(({ data }) => setUniversities(data))
            .catch((err) => console.error("Failed to load universities:", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVerify = async (e) => {
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
            setError(
                err.response?.data?.error || err.message || "Verification failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const resultColors = {
        Valid: "result-valid",
        Revoked: "result-revoked",
        "Not Found": "result-notfound",
    };

    const resultIcons = {
        Valid: "✅",
        Revoked: "🚫",
        "Not Found": "❓",
    };

    return (
        <div className="verification-page">
            <h1>🔍 Verify Certificate</h1>
            <p className="subtitle">
                Enter the certificate details to verify authenticity on the blockchain.
                <br />
                <small>All fields are hashed and compared against the on-chain record.</small>
            </p>

            <form onSubmit={handleVerify} className="verify-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="verify-firstName">First Name</label>
                        <input
                            id="verify-firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="John"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="verify-lastName">Last Name</label>
                        <input
                            id="verify-lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Doe"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="verify-dob">Date of Birth</label>
                        <input
                            id="verify-dob"
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="verify-studentId">Student ID</label>
                        <input
                            id="verify-studentId"
                            name="studentId"
                            type="text"
                            value={formData.studentId}
                            onChange={handleChange}
                            required
                            placeholder="21BCE7777"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="verify-percentile">Percentile (×100)</label>
                        <input
                            id="verify-percentile"
                            name="percentile"
                            type="number"
                            value={formData.percentile}
                            onChange={handleChange}
                            required
                            min="0"
                            max="10000"
                            placeholder="9550"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="verify-issuer">Issuing University</label>
                        <select
                            id="verify-issuer"
                            name="issuerAddress"
                            value={formData.issuerAddress}
                            onChange={handleChange}
                            required
                        >
                            <option value="">— Select University —</option>
                            {universities.map((u) => (
                                <option key={u._id} value={u.walletAddress}>
                                    {u.name} ({u.shortCode})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? "⏳ Verifying..." : "🔍 Verify Certificate"}
                </button>
            </form>

            {/* Error */}
            {error && (
                <div className="alert alert-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Result */}
            {result && (
                <div className={`verification-result ${resultColors[result.result]}`}>
                    <div className="result-icon">{resultIcons[result.result]}</div>
                    <h2 className="result-text">{result.result}</h2>
                    <p className="result-message">{result.message}</p>
                    {result.details && (
                        <div className="result-details">
                            {result.details.issuer && (
                                <p>
                                    <strong>Issuer:</strong>{" "}
                                    <code>
                                        {result.details.issuer.slice(0, 10)}...
                                        {result.details.issuer.slice(-6)}
                                    </code>
                                </p>
                            )}
                            {result.details.issuedAt && (
                                <p>
                                    <strong>Issued:</strong>{" "}
                                    {new Date(
                                        result.details.issuedAt
                                    ).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
