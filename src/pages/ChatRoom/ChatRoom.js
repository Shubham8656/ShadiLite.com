import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp, doc, updateDoc, getDoc
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./ChatRoom.css";

export default function ChatRoom() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const [otherUser, setOtherUser] = useState(null);

  // Load messages and listen for new ones
  useEffect(() => {
    const resetUnread = async () => {
      const userId = auth.currentUser.uid;
      await updateDoc(doc(db, "chats", chatId), {
        [`unreadCount.${userId}`]: 0
      });
    };
    resetUnread();

    const fetchOtherUser = async () => {
      const chatSnap = await getDoc(doc(db, "chats", chatId));
      if (!chatSnap.exists()) return;

      const chatData = chatSnap.data();
      const myId = auth.currentUser.uid;

      const otherUserId = chatData.participants.find(
        p => p !== myId
      );

      const userSnap = await getDoc(doc(db, "users", otherUserId));
      if (userSnap.exists()) {
        setOtherUser(userSnap.data());
      }
    };

    fetchOtherUser();
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    return onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => d.data()));
    });

  }, [chatId]);

  // Load other user info
  useEffect(() => {
    const fetchOtherUser = async () => {
      const chatSnap = await getDoc(doc(db, "chats", chatId));
      if (!chatSnap.exists()) return;

      const chatData = chatSnap.data();
      const myId = auth.currentUser.uid;

      const otherUserId = chatData.participants.find(
        p => p !== myId
      );

      const userSnap = await getDoc(doc(db, "users", otherUserId));
      if (userSnap.exists()) {
        setOtherUser(userSnap.data());
      }
    };

    fetchOtherUser();
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a new message
  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: auth.currentUser.uid,
      text,
      createdAt: serverTimestamp()
    });
    // 🔥 Update chat metadata
    const chatSnap = await getDoc(doc(db, "chats", chatId));
    const chatData = chatSnap.data();

    const otherUserId = chatData.participants.find(
      p => p !== auth.currentUser.uid
    );

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
      lastSenderId: auth.currentUser.uid,
      [`unreadCount.${otherUserId}`]: (chatData.unreadCount?.[otherUserId] || 0) + 1,
      [`unreadCount.${auth.currentUser.uid}`]: 0
    });

    setText("");
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-avatar">
          {otherUser?.photoURL ? (
            <img
              src={otherUser.photoURL}
              alt="avatar"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          ) : (
            otherUser?.name?.charAt(0) || "👤"
          )}
        </div>

        <div className="chat-user-info">
          <div className="chat-user-name">
            {otherUser?.name || "Chat"}
          </div>
          <div className="chat-user-sub">
            Online
          </div>
        </div>
      </div>


      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.senderId === auth.currentUser.uid ? "me" : "other"
              }`}
          >
            {m.text}
            <div className="message-time">
              {m.createdAt?.toDate
                ? m.createdAt.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })
                : ""}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          rows={1}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 20) + "px";
          }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
