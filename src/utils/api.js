import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Attach the wallet address to every request automatically.
 * The wallet address is set via api.setWallet() when the user connects.
 */
let currentWallet = null;

export function setWallet(address) {
    currentWallet = address;
}

api.interceptors.request.use((config) => {
    if (currentWallet) {
        config.headers["x-wallet-address"] = currentWallet;
    }
    return config;
});

export default api;
