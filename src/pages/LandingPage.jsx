import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import Rosette from "../components/Rosette.jsx";
import { computeFieldHash } from "../utils/contract.js";

// Hardhat test accounts #1 and #2: demonstration wallets, not real universities.
const ISSUERS = [
    { label: "0x7099…79C8", address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" },
    { label: "0x3C44…93BC", address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" },
];

const SPECIMEN = {
    firstName: "Ananya",
    lastName: "Rao",
    dob: "2003-04-11",
    studentId: "21BCE7781",
    percentile: "9150",
};

const MICROTEXT = "VERIFYONCHAIN · KECCAK-256 · ANCHORED ON ETHEREUM · ".repeat(40);

function hashOf(fields, issuer) {
    if (!/^\d+$/.test(fields.percentile)) return null;
    try {
        return computeFieldHash(fields, issuer);
    } catch {
        return null;
    }
}

const SPECIMEN_HASH = hashOf(SPECIMEN, ISSUERS[0].address);

function Serial({ hash }) {
    if (!hash) return <code>—</code>;
    return (
        <code aria-label={hash}>
            {hash.split("").map((ch, i) => (
                <span key={i} className={ch !== SPECIMEN_HASH[i] ? "diff" : undefined}>{ch}</span>
            ))}
        </code>
    );
}

function Specimen() {
    const [fields, setFields] = useState(SPECIMEN);
    const [issuer, setIssuer] = useState(0);

    const hash = useMemo(() => hashOf(fields, ISSUERS[issuer].address), [fields, issuer]);
    const match = hash === SPECIMEN_HASH;
    const edited = issuer !== 0 || Object.keys(SPECIMEN).some((k) => fields[k] !== SPECIMEN[k]);

    const set = (e) => setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
    const reset = () => { setFields(SPECIMEN); setIssuer(0); };

    return (
        <figure className="lp-specimen" aria-labelledby="specimen-title">
            <div className="lp-specimen-head">
                <h2 id="specimen-title">Certificate of Degree</h2>
                <span className="lp-specimen-tag">Specimen</span>
            </div>

            <div className="lp-specimen-body">
                <div className="lp-fields">
                    <div className="form-group">
                        <label htmlFor="sp-first">First name</label>
                        <input id="sp-first" name="firstName" value={fields.firstName} onChange={set} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sp-last">Last name</label>
                        <input id="sp-last" name="lastName" value={fields.lastName} onChange={set} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sp-dob">Date of birth</label>
                        <input id="sp-dob" name="dob" value={fields.dob} onChange={set} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sp-id">Student ID</label>
                        <input id="sp-id" name="studentId" className="mono-input" value={fields.studentId} onChange={set} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sp-pct">Percentile ×100</label>
                        <input id="sp-pct" name="percentile" inputMode="numeric" value={fields.percentile} onChange={set} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <span className="text-label-caps" style={{ color: "var(--ink-3)" }} id="sp-issuer">Issuer wallet</span>
                        <div className="lp-issuer" role="group" aria-labelledby="sp-issuer">
                            {ISSUERS.map((it, i) => (
                                <button key={it.address} type="button" aria-pressed={issuer === i} onClick={() => setIssuer(i)}>
                                    {it.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <div className="lp-specimen-foot">
                <div className="lp-serial">
                    <span className="text-label-caps lp-serial-label">Fingerprint</span>
                    <Serial hash={hash} />
                </div>
                <div className="lp-rosette is-drawing" style={{ color: match ? "var(--ink)" : "var(--seal)" }}>
                    <Rosette hash={hash} animate title="Guilloché rosette drawn from this certificate's fingerprint" />
                </div>
            </div>

            <div className="lp-state" data-match={match} aria-live="polite">
                <span>
                    {hash === null ? (
                        "Percentile must be a whole number, e.g. 9150 for 91.50%."
                    ) : match ? (
                        <><span className="material-symbols-outlined" aria-hidden="true">verified</span>Matches the specimen's fingerprint</>
                    ) : (
                        <><span className="material-symbols-outlined" aria-hidden="true">gpp_bad</span>Does not match the specimen. Every edit makes a new fingerprint.</>
                    )}
                </span>
                {edited && <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>Reset specimen</button>}
            </div>
        </figure>
    );
}

export default function LandingPage() {
    return (
        <div className="lp">
            <section className="lp-sheet" aria-labelledby="lp-title">
                <div className="microtext" aria-hidden="true">{MICROTEXT}</div>
                <div className="lp-hero">
                    <div>
                        <h1 id="lp-title" className="lp-title">
                            Change one letter. The certificate <em>fails.</em>
                        </h1>
                        <p className="lp-lede">
                            Each certificate's fingerprint lives on Ethereum. Anyone can recompute it from the
                            printed fields; names, birth dates and grades are never stored.
                        </p>
                        <div className="lp-actions">
                            <Link to="/verify" className="btn btn-primary">Verify a certificate</Link>
                            <Link to="/login" className="btn">University login</Link>
                        </div>
                        <p className="lp-footnote">Verifying needs no account and no wallet. Try editing the specimen.</p>
                    </div>
                    <Specimen />
                </div>
                <div className="microtext" aria-hidden="true">{MICROTEXT}</div>
            </section>

            <section aria-labelledby="lp-flow">
                <div className="lp-section-head">
                    <h2 id="lp-flow">One certificate, three hands.</h2>
                    <p>
                        Each stage is a different wallet signing its own transaction. The backend prepares the data,
                        MetaMask signs it in the browser, and the contract records the result. No private key ever
                        leaves the signer's wallet.
                    </p>
                </div>
                <div className="lp-counterfoil">
                    <article className="lp-stub">
                        <span className="lp-stub-num" aria-hidden="true">i.</span>
                        <h3>Issue</h3>
                        <p>
                            The registrar enters the student's fields. The backend computes the fingerprint, the registrar
                            signs the transaction in MetaMask, and the contract records it against the university's wallet.
                        </p>
                        <span className="who">University registrar, whitelisted wallet</span>
                    </article>
                    <article className="lp-stub">
                        <span className="lp-stub-num" aria-hidden="true">ii.</span>
                        <h3>Verify</h3>
                        <p>
                            An employer types the fields from the paper certificate and picks the issuing university.
                            The fingerprint is recomputed and looked up on-chain: Valid, Revoked or Not Found.
                        </p>
                        <span className="who">Anyone, no login and no gas</span>
                    </article>
                    <article className="lp-stub" data-tone="seal">
                        <span className="lp-stub-num" aria-hidden="true">iii.</span>
                        <h3>Revoke</h3>
                        <p>
                            If a certificate was issued in error, the university that issued it can revoke it.
                            The record stays on-chain, marked invalid, permanently.
                        </p>
                        <span className="who">The issuing university only</span>
                    </article>
                </div>
            </section>

            <section aria-labelledby="lp-hash">
                <div className="lp-section-head">
                    <h2 id="lp-hash">What the fingerprint is made of.</h2>
                    <p>Six values, packed in order and hashed with keccak-256. The backend and the browser compute it the same way; the contract stores the result.</p>
                </div>
                <div className="lp-formula">
                    <pre aria-label="Hash formula"><span className="k">keccak256</span>(abi.encodePacked({"\n"}
{"  "}firstName,      <span className="c">// string</span>{"\n"}
{"  "}lastName,       <span className="c">// string</span>{"\n"}
{"  "}dob,            <span className="c">// "YYYY-MM-DD"</span>{"\n"}
{"  "}studentId,      <span className="c">// string</span>{"\n"}
{"  "}percentile,     <span className="c">// uint256, ×100</span>{"\n"}
{"  "}<span className="k">issuerAddress</span>   <span className="c">// university wallet</span>{"\n"}
))</pre>
                    <ul className="lp-points">
                        <li>
                            <strong>The issuer is part of the hash.</strong>
                            <span>The same student data issued by a different university gives a different fingerprint, so nobody can claim another institution issued it.</span>
                        </li>
                        <li>
                            <strong>One character changes everything.</strong>
                            <span>Edit a single letter and the whole fingerprint changes. The specimen above highlights every character that moved.</span>
                        </li>
                        <li>
                            <strong>Nothing to read back.</strong>
                            <span>The chain holds no names. A fingerprint can only be checked against fields you already have.</span>
                        </li>
                    </ul>
                </div>
            </section>

            <section aria-labelledby="lp-store">
                <div className="lp-section-head">
                    <h2 id="lp-store">What is stored, and where.</h2>
                    <p>The fields printed on the certificate stay on the certificate. Here is everything the system keeps.</p>
                </div>
                <div className="table-container">
                    <table className="lp-ledger">
                        <thead>
                            <tr><th scope="col">Item</th><th scope="col">On Ethereum</th><th scope="col">In the database</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Fingerprint (bytes32)</td><td data-label="On Ethereum">Yes, as the record's key</td><td data-label="In the database">Yes</td></tr>
                            <tr><td>Issuer wallet</td><td data-label="On Ethereum">Yes</td><td data-label="In the database">Through the university record</td></tr>
                            <tr><td>Time of issue</td><td data-label="On Ethereum">Block timestamp</td><td data-label="In the database">Creation time</td></tr>
                            <tr><td>Status</td><td data-label="On Ethereum">Valid flag</td><td data-label="In the database">Pending, issued or revoked, plus transaction hash</td></tr>
                            <tr><td>Student ID</td><td data-label="On Ethereum">No</td><td data-label="In the database">Yes, unique per university to block duplicate issuance</td></tr>
                            <tr><td>Name, date of birth, percentile</td><td className="never" data-label="On Ethereum">Never</td><td className="never" data-label="In the database">Never</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section aria-labelledby="lp-layers">
                <div className="lp-section-head">
                    <h2 id="lp-layers">Three layers, one source of truth.</h2>
                    <p>The contract decides what is valid. The backend and frontend only prepare and display it.</p>
                </div>
                <div className="lp-layers">
                    <div className="lp-layer">
                        <h3>Smart contract</h3>
                        <p className="stack">Solidity ^0.8.20, OpenZeppelin Ownable</p>
                        <p>Stores fingerprints, whitelists issuers and handles revocation.</p>
                        <dl>
                            <dt>issueCertificate</dt><dd>Anchor a fingerprint</dd>
                            <dt>verifyCertificate</dt><dd>Read status, free</dd>
                            <dt>revokeCertificate</dt><dd>Invalidate, permanently</dd>
                            <dt>addAuthorizedIssuer</dt><dd>Whitelist a university</dd>
                        </dl>
                    </div>
                    <div className="lp-layer">
                        <h3>Backend</h3>
                        <p className="stack">Express, MongoDB Atlas</p>
                        <p>Validates fields, computes fingerprints and tracks each certificate. It never holds a private key.</p>
                        <dl>
                            <dt>auth</dt><dd>Wallet address and role</dd>
                            <dt>hash</dt><dd>solidityPackedKeccak256</dd>
                            <dt>flow</dt><dd>Prepare, sign, confirm</dd>
                        </dl>
                    </div>
                    <div className="lp-layer">
                        <h3>Frontend</h3>
                        <p className="stack">React, Vite, ethers v6</p>
                        <p>Three views for three roles, connected through MetaMask.</p>
                        <dl>
                            <dt>admin</dt><dd>Onboard and whitelist universities</dd>
                            <dt>registrar</dt><dd>Issue and revoke</dd>
                            <dt>verifier</dt><dd>Public, no login</dd>
                        </dl>
                    </div>
                </div>
            </section>

            <section className="lp-sheet" aria-labelledby="lp-close">
                <div className="lp-close">
                    <div>
                        <h2 id="lp-close">Have a certificate in front of you?</h2>
                        <p>Enter its fields exactly as printed and pick the university that issued it.</p>
                    </div>
                    <Link to="/verify" className="btn btn-primary btn-lg" style={{ width: "auto", padding: "0 var(--space-2xl)" }}>
                        Verify a certificate
                    </Link>
                </div>
            </section>
        </div>
    );
}
