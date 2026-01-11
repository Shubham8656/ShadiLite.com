import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "../Auth.css";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [religion, setReligion] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const saveProfile = async () => {
    if (!name || !age || !gender || !religion || !location) {
      alert("Please fill all details");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      setLoading(true);

      await setDoc(doc(db, "users", user.uid), {
        name,
        age,
        gender,
        religion,
        location,
        createdAt: serverTimestamp()
      });

      // ✅ Profile saved
      navigate("/matches");
    } catch (error) {
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Profile</h2>
        <p>Tell us about yourself</p>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input
          placeholder="Religion"
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
        />

        <input
          placeholder="Location (City)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          className="primary-btn"
          onClick={saveProfile}
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
