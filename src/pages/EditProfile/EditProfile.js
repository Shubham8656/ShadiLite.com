import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../Auth.css";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [religion, setReligion] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setAge(data.age || "");
        setGender(data.gender || "");
        setReligion(data.religion || "");
        setLocation(data.location || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!name || !age || !gender || !religion || !location) {
      alert("Please fill all fields");
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name,
        age,
        gender,
        religion,
        location
      });

      navigate("/my-profile");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return <p style={{ padding: 40 }}>Loading...</p>;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Edit Profile</h2>

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

        <button className="primary-btn" onClick={updateProfile}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
