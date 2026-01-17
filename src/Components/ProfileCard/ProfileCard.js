import { useNavigate } from "react-router-dom";
import "../../pages/ChatRoom/ChatRoom.css";
import "./ProfileCard.css";
export default function ProfileCard({ profile }) {
  const navigate = useNavigate();

  return (
    <div className="profile-card">

      <div className="profile-card-MatchContainer" style={{display:"flex",justifyContent:"space-between"}}> 
        <div>
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt=""
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          ) : (
            <div className="chat-avatar">{profile.name.charAt(0)}</div>
          )}
        </div>
        <div className="match-score">
          {profile.matchScore}% Match
        </div>

      </div>
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
