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
                        name: userSnap.data().name,
                        lastMessage: data.lastMessage || "",
                        unread: data.unreadCount?.[user.uid] || 0,
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
                    <div className="profile-card-Chat" key={chat.chatId} onClick={() => navigate(`/chat/${chat.chatId}`)}>
                        <div className="chat-avatar">
                            {chat.photoURL ? (
                                <img
                                    src={chat.photoURL}
                                    alt=""
                                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                                />
                            ) : (
                                <div className="avatar-fallback">{chat.name.charAt(0)}</div>
                            )}
                            {/* {chat?.name ? chat.name.charAt(0) : "👤"} */}
                        </div>
                        <div className="ChatName">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>

                                <strong>{chat.name}</strong>
                                {chat.unread > 0 && (
                                    <span style={{
                                        background: "#ff4d4d",
                                        color: "white",
                                        borderRadius: "50%",
                                        padding: "4px 8px",
                                        fontSize: "12px"
                                    }}>
                                        {chat.unread}
                                    </span>
                                )}
                            </div>

                            <p style={{ color: "#666", marginTop: 6 }}>
                                {chat.lastMessage}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
