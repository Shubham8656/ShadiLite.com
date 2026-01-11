import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import "../Matches/Matches.css";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc,addDoc, serverTimestamp
} from "firebase/firestore";

export default function ReceivedInterests() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReceivedInterests = async () => {
        const user = auth.currentUser;
        if (!user) return;

        setLoading(true);

        const q = query(
            collection(db, "interests"),
            where("toUserId", "==", user.uid),
            where("status", "==", "sent")
        );

        const interestSnap = await getDocs(q);
        const result = [];

        for (const interestDoc of interestSnap.docs) {
            const interest = interestDoc.data();

            const userSnap = await getDoc(
                doc(db, "users", interest.fromUserId)
            );

            if (userSnap.exists()) {
                result.push({
                    interestId: interestDoc.id,
                    fromUserId: interest.fromUserId,
                    ...userSnap.data()
                });
            }
        }

        setProfiles(result);
        setLoading(false);
    };

    useEffect(() => {
        fetchReceivedInterests();
    }, []);

    const updateStatus = async (profile, status) => {
        try {
            await updateDoc(
                doc(db, "interests", profile.interestId),
                { status }
            );
            fetchReceivedInterests(); // refresh list
            if (status === "accepted") {
                const q = query(
                    collection(db, "chats"),
                    where("participants", "array-contains", auth.currentUser.uid)
                );

                const snap = await getDocs(q);

                const exists = snap.docs.find(d => {
                    const p = d.data().participants;
                    return p.includes(profile.fromUserId);
                });

                if (!exists) {
                    await addDoc(collection(db, "chats"), {
                        participants: [auth.currentUser.uid, profile.fromUserId],
                        createdAt: serverTimestamp()
                    });
                }
            }

        } catch {
            alert("Failed to update interest");
        }
    };

    if (loading) {
        return <p style={{ padding: 40 }}>Loading...</p>;
    }

    if (profiles.length === 0) {
        return <p style={{ padding: 40 }}>No pending interests</p>;
    }

    return (
        <div className="matches-page">
            <h2>Received Interests</h2>

            <div className="matches-grid">
                {profiles.map((profile) => (
                    <div className="profile-card" key={profile.interestId}>
                        <h3>{profile.name}, {profile.age}</h3>
                        <p>{profile.religion}</p>
                        <p>{profile.location}</p>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                className="primary-btn"
                                onClick={() =>
                                    updateStatus(profile, "accepted")
                                }
                            >
                                Accept
                            </button>

                            <button
                                className="secondary-btn"
                                onClick={() =>
                                    updateStatus(profile, "rejected")
                                }
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
