import { useNavigate } from "react-router-dom";
import "../../pages/ChatRoom/ChatRoom.css";

export default function ProfileCard({ profile }) {
  const navigate = useNavigate();

  return (
    <div className="profile-card">
      {profile.photoURL ? (
        <img
          src={profile.photoURL}
          alt=""
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      ) : (
        <div className="chat-avatar">{profile.name.charAt(0)}</div>
      )}
      <h3>{profile.name}, {profile.age}</h3>
      <p>{profile.religion}</p>
      <p>{profile.location}</p>

      <button
        className="secondary-btn"
        onClick={() => navigate(`/profile/${profile.id}`)}
      >
        View Profile
      </button>
    </div>
  );
}
