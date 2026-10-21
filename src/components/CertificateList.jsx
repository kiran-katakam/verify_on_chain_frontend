import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import { getSignerContract } from "../utils/contract.js";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

export default function CertificateList({ wallet }) {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revoking, setRevoking] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [filter, setFilter] = useState("all");

    const fetchCertificates = async () => {
        try {
            const { data } = await api.get("/certificates");
            setCertificates(data);
        } catch (err) {
            console.error("Failed to fetch certificates:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCertificates(); }, []);

    const handleRevoke = async (fieldHash) => {
        if (!confirm("Revoke this certificate? This is permanent: the record stays on-chain, marked invalid.")) return;
        setRevoking(fieldHash);
        try {
            await api.post(`/certificates/${encodeURIComponent(fieldHash)}/revoke/prepare`);
            const contract = getSignerContract(CONTRACT_ADDRESS, wallet.signer);
            const tx = await contract.revokeCertificate(fieldHash);
            const receipt = await tx.wait();
            await api.post(`/certificates/${encodeURIComponent(fieldHash)}/revoke/confirm`, { txHash: receipt.hash });
            await fetchCertificates();
        } catch (err) {
            console.error("Revocation error:", err);
            alert(err.response?.data?.error || err.message || "Revocation failed");
        } finally { setRevoking(null); }
    };

    const handleDelete = async (fieldHash) => {
        if (!confirm("Delete pending certificate? This cannot be undone.")) return;
        setDeleting(fieldHash);
        try {
            await api.delete(`/certificates/${encodeURIComponent(fieldHash)}`);
            await fetchCertificates();
        } catch (err) {
            console.error("Delete error:", err);
            alert(err.response?.data?.error || err.message || "Delete failed");
        } finally { setDeleting(null); }
    };

    const filtered = filter === "all"
        ? certificates
        : certificates.filter((c) => c.status === filter);

    const counts = {
        all: certificates.length,
        issued: certificates.filter(c => c.status === "issued").length,
        pending: certificates.filter(c => c.status === "pending").length,
        revoked: certificates.filter(c => c.status === "revoked").length,
    };

    if (loading) return <p className="loading">Loading certificates…</p>;

    return (
        <div className="card" style={{ padding: 0 }}>
            {/* Table Toolbar */}
            <div style={{
                padding: "var(--space-lg)",
                borderBottom: "1px solid var(--rule-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "var(--space-md)",
            }}>
                <div>
                    <h2 className="text-headline-md">Your certificates</h2>
                    <p className="text-body-sm" style={{ color: "var(--on-surface-variant)" }}>
                        Revoking is permanent. Pending entries were never signed and can be cancelled.
                    </p>
                </div>
                {/* Filter pills */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid var(--ink)"
                }}>
                    {["all", "issued", "pending", "revoked"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            aria-pressed={filter === f}
                            className="text-body-sm"
                            style={{
                                padding: "6px 12px",
                                border: "none",
                                fontFamily: "inherit",
                                fontWeight: 600,
                                cursor: "pointer",
                                background: filter === f ? "var(--ink)" : "transparent",
                                color: filter === f ? "var(--paper-hi)" : "var(--ink-2)",
                                transition: "var(--transition)",
                            }}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="empty-state">No certificates match this filter.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Fingerprint</th>
                                <th>Student ID</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((cert) => (
                                <tr key={cert.fieldHash} className={cert.status === "revoked" ? "revoked-row" : ""}>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <span className="text-mono-sm" style={{
                                                fontWeight: 600,
                                                color: cert.status === "revoked" ? "var(--ink-3)" : "var(--seal)",
                                                textDecoration: cert.status === "revoked" ? "line-through" : "none",
                                            }} title={cert.fieldHash}>
                                                {cert.fieldHash.slice(0, 8)}...{cert.fieldHash.slice(-4)}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-mono-sm" style={{
                                            color: cert.status === "revoked" ? "var(--ink-3)" : "var(--ink)"
                                        }}>
                                            {cert.studentId}
                                        </span>
                                    </td>
                                    <td>
                                        {cert.status === "issued" && (
                                            <span className="badge badge-issued">Issued</span>
                                        )}
                                        {cert.status === "pending" && (
                                            <span className="badge badge-pending">Pending</span>
                                        )}
                                        {cert.status === "revoked" && (
                                            <span className="badge badge-revoked">
                                                Revoked
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-mono-sm" style={{ color: "var(--on-surface-variant)" }}>
                                        {new Date(cert.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="actions-cell">
                                        {cert.status === "pending" && (
                                            <button
                                                className="action-btn action-btn-danger"
                                                onClick={() => handleDelete(cert.fieldHash)}
                                                disabled={deleting === cert.fieldHash}
                                            >
                                                {deleting === cert.fieldHash ? "Cancelling…" : "Cancel"}
                                            </button>
                                        )}
                                        {cert.status === "issued" && (
                                            <button
                                                className="action-btn action-btn-danger"
                                                onClick={() => handleRevoke(cert.fieldHash)}
                                                disabled={revoking === cert.fieldHash}
                                            >
                                                {revoking === cert.fieldHash ? "Revoking…" : "Revoke"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Footer */}
            <div style={{
                padding: "var(--space-sm) var(--space-lg)",
                borderTop: "1px solid var(--rule-soft)",
            }}>
                <span className="text-body-sm" style={{ color: "var(--ink-3)" }}>
                    Showing {filtered.length} of {certificates.length}
                </span>
            </div>
        </div>
    );
}
