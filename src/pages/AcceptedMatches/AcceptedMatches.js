import { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import "../Matches/Matches.css";

export default function AcceptedMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            const user = auth.currentUser;
            if (!user) return;

            setLoading(true);

            // 🔹 Query 1: I sent, other accepted
            const q1 = query(
                collection(db, "interests"),
                where("fromUserId", "==", user.uid),
                where("status", "==", "accepted")
            );

            // 🔹 Query 2: I received, I accepted
            const q2 = query(
                collection(db, "interests"),
                where("toUserId", "==", user.uid),
                where("status", "==", "accepted")
            );

            const snaps = [
                ...(await getDocs(q1)).docs,
                ...(await getDocs(q2)).docs
            ];
            const result = [];

            for (const interestDoc of snaps) {
                const interest = interestDoc.data();

                // Check if current user is part of this match
                if (
                    interest.fromUserId === user.uid ||
                    interest.toUserId === user.uid
                ) {
                    const otherUserId =
                        interest.fromUserId === user.uid
                            ? interest.toUserId
                            : interest.fromUserId;

                    const userSnap = await getDoc(
                        doc(db, "users", otherUserId)
                    );

                    if (userSnap.exists()) {
                        result.push({
                            matchId: interestDoc.id,
                            userId: otherUserId,
                            ...userSnap.data()
                        });
                    }
                }
            }

            setMatches(result);
            setLoading(false);
        };

        fetchMatches();
    }, []);

    if (loading) {
        return <p style={{ padding: 40 }}>Loading matches...</p>;
    }

    if (matches.length === 0) {
        return <p style={{ padding: 40 }}>No matches yet</p>;
    }

    return (
        <div className="matches-page">
            <h2>Accepted Matches</h2>

            <div className="matches-grid">
                {matches.map((profile) => (
                    <div className="profile-card" key={profile.matchId}>
                        <h3>{profile.name}, {profile.age}</h3>
                        <p>{profile.religion}</p>
                        <p>{profile.location}</p>

                        <span style={{ color: "#4caf50", fontWeight: 600 }}>
                            ✔ Matched
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
