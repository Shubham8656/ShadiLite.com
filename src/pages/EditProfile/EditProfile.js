import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../Auth.css";
import { FieldLabel } from "../../Components/FieldLabel/FieldLabel";
// import { BackButton } from "../../Components/BackButton/BackButton";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [religion, setReligion] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);


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
      setShowWarning(true);
      return;
    } else {
      setShowWarning(false);
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name,
        age,
        gender,
        religion,
        location
      });

      navigate("/profile-completion");
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
        {showWarning && <span className="back-btn" style={{ color: "red" }}>Please fill all the details</span>}
        <h2>Basic Details</h2>
        <div className="spacer-10" />
        <FieldLabel label="Full Name" />
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FieldLabel label="Age" />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <FieldLabel label="Gender" />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <FieldLabel label="Religion" />
        <input
          placeholder="Religion"
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
        />
        <FieldLabel label="Location (City)" />
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
