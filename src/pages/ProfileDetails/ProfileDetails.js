import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProfileDetails.css";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
    doc, getDoc
} from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function ProfileDetails() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [sent, setSent] = useState(false);
    const user = auth.currentUser;
    useEffect(() => {
        const fetchProfile = async () => {
            const snap = await getDoc(doc(db, "users", id));
            if (snap.exists()) {
                setProfile(snap.data());
            }
        };
        const fetchInterest = async () => {
            // Check if already sent
            const q = query(
                collection(db, "interests"),
                where("fromUserId", "==", user.uid),
                where("toUserId", "==", id)
            );

            const snap = await getDocs(q);

            if (!snap.empty) {
                setSent(true);
                return;
            }
        }
        fetchProfile();
        fetchInterest();
    }, [id, sent, user]);

    const sendInterest = async () => {

        if (!user) return;

        try {
            // Check if already sent
            const q = query(
                collection(db, "interests"),
                where("fromUserId", "==", user.uid),
                where("toUserId", "==", id)
            );

            const snap = await getDocs(q);

            if (!snap.empty) {
                setSent(true);
                return;
            }

            await addDoc(collection(db, "interests"), {
                fromUserId: user.uid,
                toUserId: id,
                participants: [user.uid, id],
                status: "sent",
                createdAt: serverTimestamp()
            });

            setSent(true);
        } catch (err) {
            alert("Error sending interest");
        }
    };


    if (!profile) return <p>Profile not found</p>;

    return (
        <div className="profile-details-page">
            <div className="profile-details-card">
                <h2>{profile.name}, {profile.age}</h2>

                <p><strong>Religion:</strong> {profile.religion}</p>
                <p><strong>Location:</strong> {profile.location}</p>

                <button
                    className="primary-btn"
                    onClick={sendInterest}
                    disabled={sent}
                    style={{
                        background: sent ? "#ccc" : "#ff4d4d",
                        cursor: sent ? "not-allowed" : "pointer"
                    }}
                >
                    {sent ? "Interest Sent" : "Send Interest"}
                </button>
            </div>
        </div>
    );
}
