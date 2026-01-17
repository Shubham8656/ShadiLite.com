import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import "../Auth.css";
import { FieldLabel } from "../../Components/FieldLabel/FieldLabel";
import { BackButton } from "../../Components/BackButton/BackButton";

export default function CareerDetails() {
    const [form, setForm] = useState({});
    const [showWarning, setShowWarning] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) setForm(snap.data());
        };
        load();
    }, []);

    const h = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const save = async () => {
        const user = auth.currentUser;
        if (form.education && form.profession && form.income) {
            await updateDoc(doc(db, "users", user.uid), {
                education: form.education || "",
                profession: form.profession || "",
                income: form.income || ""
            });
            setShowWarning(false);
        } else {
            setShowWarning(true);
            return;
        }

        navigate("/profile-completion");
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <BackButton />
                {showWarning && <span className="back-btn" style={{ color: "red" }}>Please fill all the details</span>}

                <h2>Education & Career</h2>
                <div className="spacer-10" />
                <FieldLabel label="Education" />
                <CustomDropdown
                    label="Education"
                    value={form.education}
                    options={[
                        "High School",
                        "Diploma",
                        "Graduate",
                        "Post Graduate",
                        "Doctorate"
                    ]}
                    onChange={(v) => h("education", v)}
                />

                <FieldLabel label="Profession" />
                <input
                    placeholder="Profession"
                    value={form.profession || ""}
                    onChange={(e) => h("profession", e.target.value)}
                />

                <FieldLabel label="Annual Income" />
                <CustomDropdown
                    label="Annual Income"
                    value={form.income}
                    options={[
                        "Below 3 LPA",
                        "3–5 LPA",
                        "5–10 LPA",
                        "10–20 LPA",
                        "20+ LPA"
                    ]}
                    onChange={(v) => h("income", v)}
                />

                <button className="primary-btn" onClick={save}>
                    Save & Continue
                </button>
            </div>
        </div>
    );
}
