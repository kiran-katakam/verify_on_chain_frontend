import React from "react";

export default function WalletConnect({ wallet, onLogout }) {
    const {
        account,
        isConnected,
        isMetaMaskInstalled,
        isCorrectNetwork,
        isConnecting,
        error,
        connect,
        disconnect,
        switchNetwork,
    } = wallet;

    const handleLogout = () => {
        disconnect();
        if (onLogout) onLogout();
    };

    if (!isMetaMaskInstalled) {
        return (
            <div className="wallet-connect wallet-error">
                <span>⚠️ MetaMask not installed</span>
                <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm"
                >
                    Install MetaMask
                </a>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="wallet-connect">
                <button
                    className="btn btn-primary"
                    onClick={connect}
                    disabled={isConnecting}
                >
                    {isConnecting ? "Connecting..." : "🔗 Connect Wallet"}
                </button>
                {error && <p className="error-text">{error}</p>}
            </div>
        );
    }

    return (
        <div className="wallet-connect wallet-connected">
            <div className="wallet-info">
                <span
                    className={`network-dot ${isCorrectNetwork ? "green" : "red"}`}
                />
                <span className="wallet-address">
                    {account.slice(0, 6)}...{account.slice(-4)}
                </span>
            </div>
            {!isCorrectNetwork && (
                <button className="btn btn-sm btn-warning" onClick={switchNetwork}>
                    Switch Network
                </button>
            )}
            <button className="btn btn-sm btn-logout" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}
