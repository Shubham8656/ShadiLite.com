import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../Auth.css";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import { FieldLabel } from "../../Components/FieldLabel/FieldLabel";
import { BackButton } from "../../Components/BackButton/BackButton";

export default function PersonalDetails() {
    const [form, setForm] = useState({});
    const [showWarning, setShowWarning] = useState(false);
    const motherTongues = [
        "Marathi",
        "Hindi",
        "Telugu",
        "Tamil",
        "Kannada",
        "Gujarati",
        "Punjabi",
        "Bengali",
        "Urdu",
        "Malayalam",
        "English",
        "Odia"
    ];
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const user = auth.currentUser;
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) setForm(snap.data());
        };
        load();
    }, []);

    const save = async () => {
        const user = auth.currentUser;
        if (form.height && form.maritalStatus && form.motherTongue && form.diet) {
            setShowWarning(false);
            await updateDoc(doc(db, "users", user.uid), {
                height: form.height || "",
                maritalStatus: form.maritalStatus || "",
                motherTongue: form.motherTongue || "",
                diet: form.diet || ""
            });
            navigate("/profile-completion");
        } else {
            setShowWarning(true);
            return;
        }

    };

    const h = (k, v) => setForm(p => ({ ...p, [k]: v }));

    return (
        <div className="auth-container">
            <div className="auth-card">
                <BackButton />
                {showWarning && <span className="back-btn" style={{ color: "red" }}>Please fill all the details</span>}
                <h2>Personal Details</h2>
                <div className="spacer-10" />
                <FieldLabel label="Height (cm)" />
                <input type="number" placeholder="Height (cm)"
                    value={form.height || ""}
                    onChange={e => h("height", e.target.value)} />

                <FieldLabel label="Marital Status" />
                <CustomDropdown
                    label="Marital Status"
                    options={["Never Married", "Divorced", "Widowed"]}
                    value={form.maritalStatus}
                    onChange={(val) => h("maritalStatus", val)}
                />

                <FieldLabel label="Mother Tongue" />
                <CustomDropdown
                    label="Mother Tongue"
                    options={motherTongues}
                    value={form.motherTongue}
                    onChange={(val) => h("motherTongue", val)}
                />

                <FieldLabel label="Diet" />
                <CustomDropdown
                    label="Diet"
                    options={["Veg", "Non-Veg", "Eggetarian"]}
                    value={form.diet}
                    onChange={(val) => h("diet", val)}
                />

                <button className="primary-btn" onClick={save}>
                    Save & Continue
                </button>
            </div>
        </div>
    );
}
