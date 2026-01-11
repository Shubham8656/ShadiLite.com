import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "../Matches/Matches.css";

export default function Chats() {
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const q = query(
                collection(db, "chats"),
                where("participants", "array-contains", user.uid)
            );

            const snap = await getDocs(q);
            const result = [];

            for (const chatDoc of snap.docs) {
                const data = chatDoc.data();
                const otherUserId = data.participants.find(p => p !== user.uid);

                const userSnap = await getDoc(doc(db, "users", otherUserId));
                if (userSnap.exists()) {
                    result.push({
                        chatId: chatDoc.id,
                        ...userSnap.data()
                    });
                }
            }

            setChats(result);
        };

        fetchChats();
    }, []);

    if (chats.length === 0) {
        return <p style={{ padding: 40 }}>No chats yet</p>;
    }

    return (
        <div className="matches-page">
            <h2>Chats</h2>

            <div className="matches-grid">
                {chats.map(chat => (
                    <div
                        key={chat.chatId}
                        className="profile-card"
                        onClick={() => navigate(`/chat/${chat.chatId}`)}
                    >

                        <h3>{chat.name}</h3>
                        {/* <p>Tap to chat</p> */}
                    </div>
                ))}
            </div>
        </div>
    );
}
