import { ethers } from "ethers";

// ABI loaded from compiled artifacts via Vite's JSON import
import contractArtifact from "./VerifyOnChain.json";

const CONTRACT_ABI = contractArtifact.abi;

/**
 * Get a read-only contract instance (no signer).
 */
export function getReadOnlyContract(contractAddress, provider) {
    return new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
}

/**
 * Get a writable contract instance (with signer for MetaMask).
 */
export function getSignerContract(contractAddress, signer) {
    return new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
}

/**
 * Compute the keccak256 hash of certificate fields + issuer address.
 * Must match the backend and on-chain computation exactly.
 *
 * Schema: firstName, lastName, dob, studentId, percentile, issuerAddress
 *
 * @param {Object} fields - { firstName, lastName, dob, studentId, percentile }
 * @param {string} issuerAddress - The issuing university's wallet address
 */
export function computeFieldHash(fields, issuerAddress) {
    return ethers.solidityPackedKeccak256(
        ["string", "string", "string", "string", "uint256", "address"],
        [
            fields.firstName,
            fields.lastName,
            fields.dob,
            fields.studentId,
            Number(fields.percentile),
            issuerAddress,
        ]
    );
}

export { CONTRACT_ABI };
