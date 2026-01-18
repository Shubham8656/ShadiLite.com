// import React from "react";
import "./FieldDetail.css";
export function FieldDetail({ label, value }) {
    return (
        value && (
            <div className="detail-row">
                <div className="detail-label">{label}</div>
                <div className="detail-value">{value}</div>
            </div>
        )
    )
}