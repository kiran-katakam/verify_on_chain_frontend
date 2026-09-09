import React, { useEffect, useState } from "react";
import api, { setWallet } from "../utils/api.js";

export default function Login({ wallet, onLogin }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (wallet.account) {
            setWallet(wallet.account);
            checkRole();
        }
    }, [wallet.account]);

    const checkRole = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get("/auth/role");
            if (data.role) {
                onLogin(data.role);
            } else {
                setError("This wallet is not registered. Ask an admin to onboard you.");
            }
        } catch (err) {
            setError("Unable to reach the server. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>🔐 VerifyOnChain</h1>
                <p className="subtitle">
                    Connect your MetaMask wallet to access the dashboard.
                </p>

                {!wallet.isConnected ? (
                    <div className="login-actions">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={wallet.connect}
                            disabled={wallet.isConnecting}
                        >
                            {wallet.isConnecting
                                ? "Connecting..."
                                : "🦊 Connect MetaMask"}
                        </button>
                        {wallet.error && (
                            <p className="error-text">{wallet.error}</p>
                        )}
                    </div>
                ) : (
                    <div className="login-status">
                        <p className="wallet-addr">
                            Connected: <code>{wallet.account}</code>
                        </p>
                        {loading && <p>Checking your role...</p>}
                        {error && <p className="error-text">{error}</p>}
                    </div>
                )}

                <div className="login-footer">
                    <p>
                        Public verification?{" "}
                        <a href="/verify">Go to Verifier Page →</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
