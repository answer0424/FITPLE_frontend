import React from "react";

function TrainerCertifications({ certifications, BASE_URL }) {
    return (
        <div>
            <h3>보유 자격증</h3>
            <ul style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: 0 }}>
                {certifications.map((cert, index) => (
                    <li key={index} style={{ listStyle: "none", textAlign: "center" }}>
                        <p><strong>기술:</strong> {cert.skills}</p>
                        <img src={`${BASE_URL}${cert.imageUrl}`} alt="자격증 이미지" width="150" />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TrainerCertifications;
