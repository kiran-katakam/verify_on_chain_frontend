import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import { getSignerContract } from "../utils/contract.js";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

export default function AdminDashboard({ wallet }) {
    const [universities, setUniversities] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        shortCode: "",
        walletAddress: "",
    });
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const fetchUniversities = async () => {
        try {
            const { data } = await api.get("/admin/universities");
            setUniversities(data);
        } catch (err) {
            console.error("Failed to fetch universities:", err);
        }
    };

    useEffect(() => {
        fetchUniversities();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Step 1: Create university in DB
            setStatus("creating");
            await api.post("/admin/universities", formData);

            // Step 2: Whitelist on-chain via MetaMask
            setStatus("signing");
            const contract = getSignerContract(CONTRACT_ADDRESS, wallet.signer);
            const tx = await contract.addAuthorizedIssuer(formData.walletAddress);

            setStatus("confirming");
            await tx.wait();

            setStatus("idle");
            setFormData({ name: "", shortCode: "", walletAddress: "" });
            await fetchUniversities();
        } catch (err) {
            setStatus("idle");
            setError(
                err.response?.data?.error || err.message || "Failed to onboard university"
            );
        }
    };

    return (
        <div className="dashboard">
            <h1>⚙️ Admin Dashboard</h1>

            <section className="card">
                <h2>➕ Onboard University</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="admin-name">University Name</label>
                            <input
                                id="admin-name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="VIT-AP University"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="admin-shortCode">Short Code</label>
                            <input
                                id="admin-shortCode"
                                name="shortCode"
                                type="text"
                                value={formData.shortCode}
                                onChange={handleChange}
                                required
                                placeholder="VITAP"
                                maxLength={10}
                            />
                        </div>
                        <div className="form-group form-group-full">
                            <label htmlFor="admin-wallet">Wallet Address</label>
                            <input
                                id="admin-wallet"
                                name="walletAddress"
                                type="text"
                                value={formData.walletAddress}
                                onChange={handleChange}
                                required
                                placeholder="0x..."
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status !== "idle"}
                    >
                        {status === "creating" && "Creating..."}
                        {status === "signing" && "Sign in MetaMask..."}
                        {status === "confirming" && "Confirming..."}
                        {status === "idle" && "🏫 Onboard University"}
                    </button>
                </form>
                {error && (
                    <div className="alert alert-error">
                        <strong>Error:</strong> {error}
                    </div>
                )}
            </section>

            <section className="card">
                <h2>📋 Registered Universities</h2>
                {universities.length === 0 ? (
                    <p className="empty-state">No universities registered yet.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Wallet</th>
                                    <th>Registered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {universities.map((u) => (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td><code>{u.shortCode}</code></td>
                                        <td>
                                            <code>
                                                {u.walletAddress.slice(0, 8)}...
                                            </code>
                                        </td>
                                        <td>
                                            {new Date(
                                                u.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
