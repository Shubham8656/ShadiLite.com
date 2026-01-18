import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import "../Auth.css";
import { FieldLabel } from "../../Components/FieldLabel/FieldLabel";
// import { BackButton } from "../../Components/BackButton/BackButton";

export default function FamilyDetails() {
    const [form, setForm] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const user = auth.currentUser;
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) setForm(snap.data());
        };
        load();
    }, []);

    const h = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const save = async () => {
        const user = auth.currentUser;
        await updateDoc(doc(db, "users", user.uid), {
            familyType: form.familyType || "",
            fatherOccupation: form.fatherOccupation || "",
            motherOccupation: form.motherOccupation || "",
            siblings: form.siblings || ""
        });
        navigate("/profile-completion");
    };

    return (
        <div className="auth-container">
            
            <div className="auth-card welcome">
                <h2>Family Details</h2>
                <div className="spacer-10" />
                <FieldLabel label="Family Type" />
                <CustomDropdown
                    label="Family Type"
                    value={form.familyType}
                    options={["Nuclear", "Joint"]}
                    onChange={(v) => h("familyType", v)}
                />

                <FieldLabel label="Father Occupation" />
                <input
                    placeholder="Father Occupation"
                    value={form.fatherOccupation || ""}
                    onChange={(e) => h("fatherOccupation", e.target.value)}
                    style={{fontSize:"15px"}}
                />

                <FieldLabel label="Mother Occupation" />
                <input
                    placeholder="Mother Occupation"
                    value={form.motherOccupation || ""}
                    onChange={(e) => h("motherOccupation", e.target.value)}
                    style={{fontSize:"15px"}}
                />

                <FieldLabel label="Siblings" />
                <CustomDropdown
                    label="Siblings"
                    value={form.siblings}
                    options={["0", "1", "2", "3+"]}
                    onChange={(v) => h("siblings", v)}
                />

                <button className="primary-btn" onClick={save}>
                    Save & Continue
                </button>
            </div>
        </div>
    );
}
