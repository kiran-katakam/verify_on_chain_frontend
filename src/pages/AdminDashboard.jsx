import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import { getSignerContract } from "../utils/contract.js";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

export default function AdminDashboard({ wallet }) {
    const [universities, setUniversities] = useState([]);
    const [formData, setFormData] = useState({ name: "", shortCode: "", walletAddress: "" });
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    const [confirming, setConfirming] = useState(null);
    const [deletingPending, setDeletingPending] = useState(null);

    const fetchUniversities = async () => {
        try {
            const { data } = await api.get("/admin/universities");
            setUniversities(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchUniversities(); }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Step 1: Validate on backend (no DB write yet)
            setStatus("preparing");
            await api.post("/admin/universities/prepare", formData);

            // Step 2: Sign on-chain transaction
            setStatus("signing");
            const contract = getSignerContract(CONTRACT_ADDRESS, wallet.signer);
            const tx = await contract.addAuthorizedIssuer(formData.walletAddress);

            // Step 3: Wait for confirmation
            setStatus("confirming");
            const receipt = await tx.wait();

            // Step 4: Only NOW save to MongoDB
            await api.post("/admin/universities/confirm", {
                walletAddress: formData.walletAddress,
                txHash: receipt.hash,
            });

            setStatus("idle");
            setFormData({ name: "", shortCode: "", walletAddress: "" });
            await fetchUniversities();
        } catch (err) {
            setStatus("idle");
            await fetchUniversities(); // refresh to show pending entry if it was created
            if (err.code === "ACTION_REJECTED") {
                setError("Transaction rejected in MetaMask. University saved as pending — use Confirm to retry.");
            } else {
                setError(err.response?.data?.error || err.message || "Failed to onboard university");
            }
        }
    };

    const handleConfirmPending = async (u) => {
        setConfirming(u.walletAddress);
        setError(null);
        try {
            const contract = getSignerContract(CONTRACT_ADDRESS, wallet.signer);
            const tx = await contract.addAuthorizedIssuer(u.walletAddress);
            const receipt = await tx.wait();
            await api.post("/admin/universities/confirm", {
                walletAddress: u.walletAddress,
                txHash: receipt.hash,
            });
            await fetchUniversities();
        } catch (err) {
            if (err.code !== "ACTION_REJECTED") {
                setError(err.response?.data?.error || err.reason || err.message || "Confirm failed");
            }
        } finally { setConfirming(null); }
    };

    const handleDeletePending = async (walletAddress) => {
        if (!confirm("Delete pending university entry?")) return;
        setDeletingPending(walletAddress);
        try {
            await api.delete(`/admin/universities/${encodeURIComponent(walletAddress)}`);
            await fetchUniversities();
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Delete failed");
        } finally { setDeletingPending(null); }
    };

    return (
        <div>
            {/* Header */}
            <div className="dashboard-header">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                    <span className="text-label-caps" style={{
                        color: "var(--tertiary)",
                        background: "rgba(255, 185, 95, 0.2)",
                        padding: "2px 6px",
                        borderRadius: "var(--radius)"
                    }}>CONTRACT OWNER</span>
                    <span className="text-mono-sm" style={{ color: "var(--outline)" }}>•</span>
                    <span className="text-label-caps" style={{ color: "var(--outline)" }}>ADMIN PRIVILEGES</span>
                </div>
                <h1 className="text-headline-xl">Admin Console & Whitelist Management</h1>
                <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                    Manage authorized registrar nodes and on-chain issuer whitelisting •{" "}
                    <span className="text-mono-sm" style={{ color: "var(--primary)" }}>
                        {wallet.account?.slice(0, 6)}...{wallet.account?.slice(-4)}
                    </span>
                </p>
            </div>

            <div className="dashboard-grid">
                {/* Left — Onboard Form */}
                <div className="dashboard-sections">
                    <div className="card">
                        <div className="card-accent-top card-accent-primary"></div>
                        <div className="card-header">
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--primary)" }}>add_business</span>
                                    <h2 className="text-headline-md">Onboard New University</h2>
                                </div>
                                <p className="text-body-sm" style={{ color: "var(--on-surface-variant)", marginTop: 2 }}>
                                    Register institution in DB & whitelist on smart contract
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: "var(--space-md)" }}>
                                <label>University Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange}
                                    required placeholder="ETH Zurich" />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Short Code</label>
                                    <input type="text" name="shortCode" value={formData.shortCode} onChange={handleChange}
                                        className="mono-input" required placeholder="ETHZ" />
                                </div>
                                <div className="form-group">
                                    <label>Wallet Address</label>
                                    <input type="text" name="walletAddress" value={formData.walletAddress} onChange={handleChange}
                                        className="mono-input" required placeholder="0x..." />
                                </div>
                            </div>

                            {/* Pipeline status */}
                            {status !== "idle" && (
                                <div style={{ margin: "var(--space-md) 0", display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                                    <span className="network-dot green"></span>
                                    <span className="text-mono-sm" style={{ color: "var(--primary)" }}>
                                        {status === "preparing" && "Registering in database..."}
                                        {status === "signing" && "Sign whitelist transaction in MetaMask..."}
                                        {status === "confirming" && "Broadcasting to chain..."}
                                    </span>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary btn-lg"
                                disabled={status !== "idle"} style={{ marginTop: "var(--space-md)" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                                    {status === "idle" ? "domain_add" : "hourglass_empty"}
                                </span>
                                {status === "idle" ? "Register & Whitelist On-Chain" : "Processing..."}
                            </button>
                        </form>

                        {error && (
                            <div className="alert alert-error">
                                <strong>Error:</strong> {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right — Registered Universities */}
                <div className="dashboard-sections">
                    <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: "var(--space-lg)", borderBottom: "1px solid rgba(70, 69, 84, 0.3)" }}>
                            <h2 className="text-headline-md">Authorized Registrar Nodes</h2>
                            <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                                On-chain whitelisted issuers
                            </p>
                        </div>

                        {universities.length === 0 ? (
                            <p className="empty-state">No universities registered yet.</p>
                        ) : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Institution</th>
                                            <th>Code</th>
                                            <th>Wallet</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {universities.map((u) => (
                                            <tr key={u._id}>
                                                <td className="text-body-md">{u.name}</td>
                                                <td>
                                                    <span className="text-mono-sm" style={{ color: "var(--primary)" }}>{u.shortCode}</span>
                                                </td>
                                                <td>
                                                    <span className="text-mono-sm" title={u.walletAddress}>
                                                        {u.walletAddress.slice(0, 8)}...{u.walletAddress.slice(-4)}
                                                    </span>
                                                </td>
                                                <td>
                                                    {u.status === "active" ? (
                                                        <span className="badge badge-issued">Active</span>
                                                    ) : (
                                                        <span className="badge badge-pending">Pending On-Chain</span>
                                                    )}
                                                </td>
                                                <td className="actions-cell">
                                                    {u.status === "pending_onchain" && (
                                                        <>
                                                            <button
                                                                className="action-btn action-btn-primary"
                                                                onClick={() => handleConfirmPending(u)}
                                                                disabled={confirming === u.walletAddress}
                                                            >
                                                                {confirming === u.walletAddress ? "Signing..." : "Confirm"}
                                                            </button>
                                                            <button
                                                                className="action-btn action-btn-danger"
                                                                onClick={() => handleDeletePending(u.walletAddress)}
                                                                disabled={deletingPending === u.walletAddress}
                                                            >
                                                                {deletingPending === u.walletAddress ? "..." : "Delete"}
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div style={{
                            padding: "var(--space-sm) var(--space-lg)",
                            borderTop: "1px solid rgba(70, 69, 84, 0.3)",
                            background: "var(--surface-container-lowest)",
                        }}>
                            <span className="text-mono-sm" style={{ color: "var(--outline)" }}>
                                {universities.length} Authorized Node{universities.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
