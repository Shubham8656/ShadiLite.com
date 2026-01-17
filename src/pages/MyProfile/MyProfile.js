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
        <h2 style={{ justifySelf: "center" }}>My Profile</h2>
        <div className="spacer-10" />
        {profile.photoURL && (
          <img
            src={profile.photoURL}
            alt="me"
            style={{ width: 100, height: 100, borderRadius: "50%", marginBottom: 10 }}
          />
        )}
        <h3 style={{ color: "pink" }}>Basic Details</h3>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Age:</strong> {profile.age}</p>
        <p><strong>Gender:</strong> {profile.gender}</p>
        <p><strong>Religion:</strong> {profile.religion}</p>
        <p><strong>Location:</strong> {profile.location}</p>

        <h3 style={{ color: "pink" }}>Personal Details</h3>
        <p><strong>Height:</strong> {profile.height}cm</p>
        <p><strong>Marital Status:</strong> {profile.maritalStatus}</p>
        <p><strong>Mother Tounge:</strong> {profile.motherTongue}</p>
        <p><strong>Diet:</strong> {profile.diet}</p>

        <h3 style={{ color: "pink" }}>Education Details</h3>
        <p><strong>Education:</strong> {profile.education}</p>
        <p><strong>Profession:</strong> {profile.profession}</p>
        <p><strong>Income:</strong> {profile.income}</p>

        <h3 style={{ color: "pink" }}>Family Details</h3>
        <p><strong>Family Type:</strong> {profile.familyType}</p>
        <p><strong>Father Occupation:</strong> {profile.fatherOccupation}</p>
        <p><strong>Mother Occupation:</strong> {profile.motherOccupation}</p>
        <p><strong>Siblings:</strong> {profile.siblings}</p>

        <button
          className="secondary-btn"
          onClick={() => navigate("/profile-completion")}
        >
          Edit Profile
        </button>

      </div>
    </div>
  );
}
