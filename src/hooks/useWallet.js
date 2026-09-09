import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";

const HARDHAT_CHAIN_ID = "0x7A69"; // 31337 in hex

export default function useWallet() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [error, setError] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const isMetaMaskInstalled = typeof window !== "undefined" && !!window.ethereum;
    const isCorrectNetwork = chainId === HARDHAT_CHAIN_ID;

    const connect = useCallback(async () => {
        if (!isMetaMaskInstalled) {
            setError("MetaMask is not installed. Please install MetaMask to continue.");
            return;
        }

        setIsConnecting(true);
        setError(null);

        try {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await browserProvider.send("eth_requestAccounts", []);
            const signer = await browserProvider.getSigner();
            const network = await browserProvider.getNetwork();

            setProvider(browserProvider);
            setSigner(signer);
            setAccount(accounts[0].toLowerCase());
            setChainId("0x" + network.chainId.toString(16));
        } catch (err) {
            if (err.code === 4001) {
                setError("Connection request was rejected. Please try again.");
            } else {
                setError(err.message || "Failed to connect wallet");
            }
        } finally {
            setIsConnecting(false);
        }
    }, [isMetaMaskInstalled]);

    const disconnect = useCallback(() => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setChainId(null);
        setError(null);
    }, []);

    const switchNetwork = useCallback(async () => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: HARDHAT_CHAIN_ID }],
            });
        } catch (err) {
            // Chain not added — try to add it
            if (err.code === 4902) {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: HARDHAT_CHAIN_ID,
                            chainName: "Hardhat Local",
                            rpcUrls: ["http://127.0.0.1:8545"],
                            nativeCurrency: {
                                name: "Ether",
                                symbol: "ETH",
                                decimals: 18,
                            },
                        },
                    ],
                });
            }
        }
    }, []);

    // Listen for account/chain changes
    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                setAccount(null);
                setSigner(null);
            } else {
                setAccount(accounts[0].toLowerCase());
                // Re-create signer
                const browserProvider = new ethers.BrowserProvider(window.ethereum);
                browserProvider.getSigner().then(setSigner);
            }
        };

        const handleChainChanged = (newChainId) => {
            setChainId(newChainId);
            // Refresh the provider/signer
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            setProvider(browserProvider);
            browserProvider.getSigner().then(setSigner);
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
    }, []);

    return {
        account,
        provider,
        signer,
        chainId,
        error,
        isConnecting,
        isConnected: !!account,
        isMetaMaskInstalled,
        isCorrectNetwork,
        connect,
        disconnect,
        switchNetwork,
    };
}
