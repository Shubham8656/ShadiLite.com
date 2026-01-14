import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import "../Auth.css";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setProfile(snap.data());
      }
      console.log(snap.data());
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <p style={{ padding: 40 }}>Loading profile...</p>;
  }

  return (
    <div className="profile-details-page">
      <div className="profile-details-card">
        <h2>My Profile</h2>
        {profile.photoURL && (
          <img
            src={profile.photoURL}
            alt="me"
            style={{ width: 100, height: 100, borderRadius: "50%", marginBottom: 10 }}
          />
        )}
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Age:</strong> {profile.age}</p>
        <p><strong>Gender:</strong> {profile.gender}</p>
        <p><strong>Religion:</strong> {profile.religion}</p>
        <p><strong>Location:</strong> {profile.location}</p>
        <button
          className="secondary-btn"
          onClick={() => navigate("/edit-profile")}
        >
          Edit Profile
        </button>

      </div>
    </div>
  );
}
