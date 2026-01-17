import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

export default function AboutMe() {
    const [aboutMe, setAboutMe] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const user = auth.currentUser;
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) setAboutMe(snap.data().aboutMe || "");
        };
        load();
    }, []);

    const save = async () => {
        const user = auth.currentUser;
        await updateDoc(doc(db, "users", user.uid), {
            aboutMe
        });
        navigate("/profile-completion");
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>About Me</h2>
                <div className="spacer-10" />
                <textarea
                style={{width: "100%", padding: 10, fontSize: 16}}
                    rows={6}
                    placeholder="Describe yourself, your values, hobbies, expectations..."
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                />
                <div className="spacer-10" />

                <button className="primary-btn" onClick={save}>
                    Save & Finish
                </button>
            </div>
        </div>
    );
}
