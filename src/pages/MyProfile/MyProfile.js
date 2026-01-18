import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { calculateProfileCompletion } from "../../utils/matchingEngine";
import "./MyProfile.css";
import { FieldDetail } from "../../Components/FieldDetail/FieldDetail";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const userData = snap.data();
        setProfile(userData);
        setProfileCompletion(calculateProfileCompletion(userData));
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="my-profile-loading">Loading profile...</div>;
  }

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  return (
    <div className="my-profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-bg"></div>
        <div className="profile-avatar-section">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt="profile"
              className="profile-avatar-image"
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {getInitials(profile.name)}
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="profile-main-content">
        {/* Name and Quick Info */}
        <div className="profile-name-section">
          <h1 className="profile-name">{profile.name}</h1>
          <p className="profile-tagline">
            {profile.age && profile.location && `${profile.age}, ${profile.location}`}
          </p>
        </div>

        {/* Completion Progress Bar */}
        {profileCompletion && (
          <div className="profile-completion">
            <div className="completion-header">
              <span>Profile Strength</span>
              <span className="completion-percentage">{profileCompletion}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${profileCompletion.percentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Profile Sections */}
        <div className="profile-sections">
          {/* Basic Details */}
          {(profile.name || profile.age || profile.gender || profile.religion) && (
            <div className="profile-section">
              <div className="space-between" >
                <h3 className="section-title">Basic Details</h3>
                <span className="section-title" onClick={() => navigate("/edit-profile")}>✏️</span>
              </div>
              <div className="section-content">

                <FieldDetail label={"Age"} value={profile.age} />
                <FieldDetail label={"Gender"} value={profile.gender} />
                <FieldDetail label={"Religion"} value={profile.religion} />
                <FieldDetail label={"Location"} value={profile.location} />
              </div>
            </div>
          )}

          {/* Personal Details */}
          {(profile.height || profile.maritalStatus || profile.motherTongue || profile.diet) && (
            <div className="profile-section">
              <div className="space-between" >
                <h3 className="section-title">Personal Details</h3>
                <span className="section-title" onClick={() => navigate("/personal-details")}>✏️</span>
              </div>
              <div className="section-content">
                <FieldDetail label={"Height (cm)"} value={profile.height} />
                <FieldDetail label={"Marital Status"} value={profile.maritalStatus} />
                <FieldDetail label={"Mother Tongue"} value={profile.motherTongue} />
                <FieldDetail label={"Diet"} value={profile.diet} />
              </div>
            </div>
          )}

          {/* Career Details */}
          {(profile.education || profile.profession || profile.income) && (
            <div className="profile-section">
              <div className="space-between" >
                <h3 className="section-title">Career Details</h3>
                <span className="section-title" onClick={() => navigate("/career-details")}>✏️</span>
              </div>
              <div className="section-content">
                <FieldDetail label={"Education"} value={profile.education} />
                <FieldDetail label={"Profession"} value={profile.profession} />
                <FieldDetail label={"Income"} value={profile.income} />
              </div>
            </div>
          )}

          {/* Family Details */}
          {(profile.familyType || profile.fatherOccupation || profile.motherOccupation || profile.siblings) && (
            <div className="profile-section">
              <div className="space-between" >
                <h3 className="section-title">Family Details</h3>
                <span className="section-title" onClick={() => navigate("/family-details")}>✏️</span>
              </div>
              <div className="section-content">
                <FieldDetail label={"Familty Type"} value={profile.familyType} />
                <FieldDetail label={"Father's Occupation"} value={profile.fatherOccupation} />
                <FieldDetail label={"Mother's Occupation"} value={profile.motherOccupation} />
                <FieldDetail label={"Siblings"} value={profile.siblings} />
              </div>
            </div>
          )}

          {/* About Me */}
          {profile.aboutMe && (
            <div className="profile-section">
              <div className="space-between" >
                <h3 className="section-title">About Me</h3>
                <span className="section-title" onClick={() => navigate("/about-me")}>✏️</span>
              </div>
              <div className="section-content">
                <div className="about-text">{profile.aboutMe}</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button
            className="edit-profile-btn"
            onClick={() => navigate("/profile-completion")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
