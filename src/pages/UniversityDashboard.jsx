import React from "react";
import IssuanceForm from "../components/IssuanceForm.jsx";
import CertificateList from "../components/CertificateList.jsx";

export default function UniversityDashboard({ wallet }) {
    return (
        <div className="dashboard">
            <h1>🏫 University Dashboard</h1>
            <p className="subtitle">
                Issue and manage certificates for your institution.
            </p>

            <div className="dashboard-sections">
                <section className="card">
                    <IssuanceForm wallet={wallet} />
                </section>

                <section className="card">
                    <CertificateList wallet={wallet} />
                </section>
            </div>
        </div>
    );
}
