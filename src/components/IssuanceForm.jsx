import React, { useState } from "react";
import api from "../utils/api.js";
import { getSignerContract } from "../utils/contract.js";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

export default function IssuanceForm({ wallet }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        studentId: "",
        percentile: "",
    });
    const [status, setStatus] = useState("idle"); // idle | preparing | signing | confirming | done | error
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        try {
            // Step 1: Prepare — get fieldHash from backend
            setStatus("preparing");
            const { data } = await api.post("/certificates/prepare", {
                ...formData,
                percentile: Number(formData.percentile),
            });
            const { fieldHash } = data;

            // Step 2: Sign — send the transaction via MetaMask
            setStatus("signing");
            const contract = getSignerContract(CONTRACT_ADDRESS, wallet.signer);
            const tx = await contract.issueCertificate(fieldHash);

            // Step 3: Wait for confirmation
            setStatus("confirming");
            const receipt = await tx.wait();

            // Step 4: Confirm with backend
            await api.post("/certificates/confirm", {
                fieldHash,
                txHash: receipt.hash,
            });

            setStatus("done");
            setResult({
                fieldHash,
                txHash: receipt.hash,
            });
            setFormData({ firstName: "", lastName: "", dob: "", studentId: "", percentile: "" });
        } catch (err) {
            setStatus("error");
            if (err.code === "ACTION_REJECTED") {
                setError("Transaction rejected in MetaMask.");
            } else {
                setError(
                    err.response?.data?.error || err.message || "Something went wrong"
                );
            }
        }
    };

    return (
        <div className="issuance-form">
            <h2>📜 Issue New Certificate</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="John"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Doe"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            id="dob"
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="studentId">Student ID</label>
                        <input
                            id="studentId"
                            name="studentId"
                            type="text"
                            value={formData.studentId}
                            onChange={handleChange}
                            required
                            placeholder="21BCE7777"
                        />
                    </div>
                    <div className="form-group form-group-full">
                        <label htmlFor="percentile">Percentile (×100, e.g. 95.50 → 9550)</label>
                        <input
                            id="percentile"
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
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={status !== "idle" && status !== "done" && status !== "error"}
                >
                    {status === "preparing" && "⏳ Preparing..."}
                    {status === "signing" && "✍️ Sign in MetaMask..."}
                    {status === "confirming" && "⛓️ Confirming on-chain..."}
                    {(status === "idle" || status === "done" || status === "error") &&
                        "🎓 Issue Certificate"}
                </button>
            </form>

            {error && (
                <div className="alert alert-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {result && (
                <div className="alert alert-success">
                    <h3>✅ Certificate Issued!</h3>
                    <p>
                        <strong>Hash:</strong>{" "}
                        <code>{result.fieldHash.slice(0, 18)}...</code>
                    </p>
                    <p>
                        <strong>Tx:</strong>{" "}
                        <code>{result.txHash.slice(0, 18)}...</code>
                    </p>
                </div>
            )}
        </div>
    );
}
