import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import { getSignerContract } from "../utils/contract.js";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

export default function CertificateList({ wallet }) {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revoking, setRevoking] = useState(null);
    const [deleting, setDeleting] = useState(null);

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

    useEffect(() => {
        fetchCertificates();
    }, []);

    const handleRevoke = async (fieldHash) => {
        if (!confirm("Are you sure you want to revoke this certificate?")) return;

        setRevoking(fieldHash);
        try {
            await api.post(`/certificates/${encodeURIComponent(fieldHash)}/revoke/prepare`);

            const contract = getSignerContract(CONTRACT_ADDRESS, wallet.signer);
            const tx = await contract.revokeCertificate(fieldHash);
            const receipt = await tx.wait();

            await api.post(`/certificates/${encodeURIComponent(fieldHash)}/revoke/confirm`, {
                txHash: receipt.hash,
            });

            await fetchCertificates();
        } catch (err) {
            console.error("Revocation error:", err);
            alert(err.response?.data?.error || err.message || "Revocation failed");
        } finally {
            setRevoking(null);
        }
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
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return <p className="loading">Loading certificates...</p>;

    if (certificates.length === 0) {
        return <p className="empty-state">No certificates issued yet.</p>;
    }

    return (
        <div className="certificate-list">
            <h2>📋 Issued Certificates</h2>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Hash</th>
                            <th>Student ID</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificates.map((cert) => (
                            <tr key={cert.fieldHash} className={cert.status}>
                                <td>
                                    <code title={cert.fieldHash}>
                                        {cert.fieldHash.slice(0, 10)}...{cert.fieldHash.slice(-6)}
                                    </code>
                                </td>
                                <td>
                                    <code>{cert.studentId}</code>
                                </td>
                                <td>
                                    <span className={`badge badge-${cert.status}`}>
                                        {cert.status}
                                    </span>
                                </td>
                                <td>
                                    {new Date(cert.createdAt).toLocaleDateString()}
                                </td>
                                <td className="actions-cell">
                                    {cert.status === "pending" && (
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(cert.fieldHash)}
                                            disabled={deleting === cert.fieldHash}
                                        >
                                            {deleting === cert.fieldHash
                                                ? "Deleting..."
                                                : "🗑️ Delete"}
                                        </button>
                                    )}
                                    {cert.status === "issued" && (
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleRevoke(cert.fieldHash)}
                                            disabled={revoking === cert.fieldHash}
                                        >
                                            {revoking === cert.fieldHash
                                                ? "Revoking..."
                                                : "Revoke"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
