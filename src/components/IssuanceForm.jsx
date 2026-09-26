import React, { useState } from "react";
import api from "../utils/api.js";
import { getSignerContract, computeFieldHash } from "../utils/contract.js";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

export default function IssuanceForm({ wallet }) {
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", dob: "", studentId: "", percentile: "",
    });
    const [status, setStatus] = useState("idle"); // idle | preparing | signing | confirming | done | error
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [computedHash, setComputedHash] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setComputedHash(null);
    };

    const allFilled = formData.firstName && formData.lastName && formData.dob && formData.studentId && formData.percentile;

    // Live hash preview
    const previewHash = () => {
        if (!allFilled || !wallet.account) return null;
        try {
            return computeFieldHash(
                { ...formData, percentile: Number(formData.percentile) },
                wallet.account
            );
        } catch { return null; }
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
            setComputedHash(fieldHash);

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
            setComputedHash(null);
        } catch (err) {
            setStatus("error");
            if (err.code === "ACTION_REJECTED") {
                setError("Transaction rejected in MetaMask.");
            } else {
                setError(err.response?.data?.error || err.message || "Something went wrong");
            }
        }
    };

    const pipelineSteps = [
        { key: "preparing", label: "Step 1: Preparing Payload", desc: "Schema normalization & keccak-256 hash generated", icon: "check" },
        { key: "signing", label: "Step 2: Registrar Signing (MetaMask)", desc: "Sign credential with institutional authority key", icon: "token" },
        { key: "confirming", label: "Step 3: Mempool Broadcast", desc: "Propagation across consensus validators", icon: "link" },
        { key: "done", label: "Step 4: Immutably Anchored", desc: "EVM finality state with verification receipt", icon: "shield" },
    ];

    const statusOrder = ["preparing", "signing", "confirming", "done"];
    const currentIdx = statusOrder.indexOf(status);

    const liveHash = computedHash || previewHash();

    return (
        <div className="card">
            <div className="card-accent-top card-accent-primary"></div>

            {/* Header */}
            <div className="card-header">
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--primary)" }}>edit_document</span>
                        <h2 className="text-headline-md">Single Certificate Engine</h2>
                    </div>
                    <p className="text-body-sm" style={{ color: "var(--on-surface-variant)", marginTop: 2 }}>
                        Generate cryptographic signature & anchor hash
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Student ID / Matrikel</label>
                        <input type="text" name="studentId" value={formData.studentId} onChange={handleChange}
                            className="mono-input" required />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Percentile (×100)</label>
                        <input type="number" name="percentile" value={formData.percentile} onChange={handleChange}
                            min="0" max="10000" placeholder="9550 = 95.50%" required />
                    </div>
                </div>

                {/* Live Hash Digest */}
                {liveHash && (
                    <div className="hash-digest">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span className="text-label-caps" style={{ color: "var(--outline)", display: "flex", alignItems: "center", gap: 4 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14, color: "var(--tertiary)" }}>fingerprint</span>
                                DETERMINISTIC KECCAK-256 DIGEST
                            </span>
                            <span className="text-mono-sm" style={{ color: "var(--secondary)" }}>256 bits</span>
                        </div>
                        <div className="hash-value-box">
                            <code>{liveHash}</code>
                        </div>
                    </div>
                )}

                {/* Consensus Pipeline */}
                {status !== "idle" && status !== "error" && (
                    <div style={{ marginTop: "var(--space-sm)" }}>
                        <span className="text-label-caps" style={{ color: "var(--outline)" }}>CONSENSUS PIPELINE STATE</span>
                        <div className="pipeline">
                            {pipelineSteps.map((step, i) => {
                                const isCompleted = currentIdx > i || status === "done";
                                const isActive = currentIdx === i && status !== "done";
                                const isPending = currentIdx < i && status !== "done";

                                return (
                                    <div className="pipeline-step" key={step.key}>
                                        <div className="pipeline-step-indicator">
                                            <div className={`pipeline-node ${isCompleted ? "pipeline-node-completed" : isActive ? "pipeline-node-active" : "pipeline-node-pending"}`}>
                                                {isCompleted ? (
                                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
                                                ) : (
                                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{step.icon}</span>
                                                )}
                                            </div>
                                            {i < pipelineSteps.length - 1 && (
                                                <div className={`pipeline-line ${isCompleted ? "pipeline-line-completed" : "pipeline-line-pending"}`}></div>
                                            )}
                                        </div>
                                        <div className="pipeline-step-content">
                                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                                                <span className="text-headline-sm" style={{ color: isActive ? "var(--primary)" : isCompleted ? "var(--on-surface)" : "var(--outline)" }}>
                                                    {step.label}
                                                </span>
                                                {isCompleted && <span className="badge badge-issued" style={{ fontSize: 10 }}>Validated</span>}
                                                {isActive && <span className="badge badge-pending" style={{ fontSize: 10 }}>In Progress</span>}
                                            </div>
                                            <span className="text-body-sm" style={{ color: isActive ? "var(--on-surface-variant)" : "var(--outline)" }}>
                                                {step.desc}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={status === "preparing" || status === "signing" || status === "confirming"}
                    style={{ marginTop: "var(--space-lg)" }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        {status === "done" ? "check_circle" : "lock_open"}
                    </span>
                    {status === "preparing" && "Preparing Payload..."}
                    {status === "signing" && "Sign in MetaMask..."}
                    {status === "confirming" && "Broadcasting to Chain..."}
                    {(status === "idle" || status === "done" || status === "error") && "Sign & Issue to Ethereum Blockchain"}
                </button>
            </form>

            {/* Error */}
            {error && (
                <div className="alert alert-error">
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                        <strong>Error:</strong> {error}
                    </div>
                </div>
            )}

            {/* Success */}
            {result && (
                <div className="alert alert-success">
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>verified</span>
                        <span className="text-headline-sm">Certificate Immutably Anchored</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div className="text-mono-sm">
                            <span style={{ color: "var(--outline)" }}>HASH: </span>
                            <span style={{ color: "var(--primary)" }}>{result.fieldHash.slice(0, 18)}...{result.fieldHash.slice(-6)}</span>
                        </div>
                        <div className="text-mono-sm">
                            <span style={{ color: "var(--outline)" }}>TX: </span>
                            <span>{result.txHash.slice(0, 18)}...{result.txHash.slice(-6)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
