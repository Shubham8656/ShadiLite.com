import { useNavigate } from "react-router-dom";

export default function ProfileCard({ profile }) {
  const navigate = useNavigate();

  return (
    <div className="profile-card">
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
