import { useNavigate } from "react-router-dom";

export function BackButton({ label = "Back" }) {
    const navigate = useNavigate();
    return (
        <div className="back-btn" style={{ justifySelf: "left",fontSize: "24px",fontWeight: "bold" }} onClick={() => navigate(-1)}>
            {/* {"⬅"} */}
            {"<"}
        </div>
    );
}