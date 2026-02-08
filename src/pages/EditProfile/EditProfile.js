import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../Auth.css";
import { FieldLabel } from "../../Components/FieldLabel/FieldLabel";
// import { BackButton } from "../../Components/BackButton/BackButton";

// Clean list of major Indian cities
const INDIAN_CITIES = [
  "Agra", "Ahmedabad", "Ajmer", "Allahabad", "Amritsar", "Aurangabad", "Ayodhya",
  "Bangalore", "Bareilly", "Baroda", "Bengaluru", "Bhopal", "Bhubaneswar", "Bhilai", "Bilaspur",
  "Chandigarh", "Chennai", "Coimbatore", "Cuttack",
  "Darjeeling", "Delhi", "Dehradun", "Dharamshala", "Dhulia", "Dindigul", "Dombivali", "Durgapur",
  "Erode",
  "Faridabad", "Faizabad",
  "Ghaziabad", "Ghazipur", "Goa", "Gorakhpur", "Greater Noida", "Gurgaon", "Guwahati", "Gwalior",
  "Haridwar", "Hisar", "Hooghly", "Howrah", "Hubballi", "Hyderabad",
  "Indore", "Itanagar", "Irinjalakuda",
  "Jabalpur", "Jaipur", "Jalandhar", "Jalgaon", "Jammu", "Jamnagar", "Jamshedpur", "Jaunpur", "Jhansi", "Jhunjhunu", "Jodhpur", "Junagadh",
  "Kanpur", "Kancheepuram", "Kannur", "Kapurthala", "Karauli", "Karol Bagh", "Katni", "Katihar", "Kochi", "Kodaikanal", "Kohima", "Kolhapur", "Kolkata", "Kollam", "Kota", "Kottayam", "Krishnanagar", "Kurnool", "Kurukshetra",
  "Ladakh", "Ladnun", "Lakhimpur", "Lakhisarai", "Lalganj", "Lalitpur", "Lucknow", "Ludhiana",
  "Madurai", "Mahabalipuram", "Mahabubnagar", "Mahesana", "Manali", "Mangalore", "Meerut", "Moradabad", "Mumbai", "Mussoorie", "Mysore",
  "Nagaland", "Nagpur", "Nainital", "Nanded", "Nashik", "Navi Mumbai", "Nellore", "New Delhi", "Nizamabad", "Noida",
  "Odisha", "Ongole", "Ooty",
  "Panaji", "Panchkula", "Panipat", "Patiala", "Patna", "Pune", "Purnia", "Purulia",
  "Raebareli", "Raichur", "Raipur", "Rajkot", "Rampur", "Ranchi", "Ratlam", "Ravi", "Rewa",
  "Saharanpur", "Salem", "Salsette", "Sambalpur", "Sangli", "Satsang", "Secunderabad", "Shimla", "Shivakashi", "Shimoga", "Sholapur", "Sikar", "Siliguri", "Sindhnur", "Singrauli", "Sirsa", "Sitapur", "Solapur", "Srinagar", "Srirangam", "Surat",
  "Thiruvananthapuram", "Thane", "Thanjavur", "Thiruvananthapuram", "Thoothukkudi", "Thrissur", "Tirupati", "Tiruppur", "Tiruchirappalli", "Tirunelveli", "Trichur",
  "Udaipur", "Udupi", "Ujjain", "Ulhasnagar", "Uttarkashi", "Uttaranchal",
  "Vadodara", "Valsad", "Varanasi", "Vapi", "Vasai", "Vellore", "Vijayanagara", "Vijayawada", "Vikarabad", "Viluppuram", "Vira Parambil", "Visakhapatnam",
  "Warangal",
  "Yamunanagar", "Yercaud"
];

export default function EditProfile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [religion, setReligion] = useState("");
  const [location, setLocation] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  const navigate = useNavigate();

  // Filter cities based on user input
  const handleLocationChange = (value) => {
    setLocation(value);

    if (value.trim().length > 0) {
      const filtered = INDIAN_CITIES.filter(city =>
        city.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 8); // Show max 8 suggestions
      setFilteredCities(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setShowSuggestions(false);
    }
  };

  const selectCity = (city) => {
    setLocation(city);
    setShowSuggestions(false);
    setFilteredCities([]);
  };

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
          style={{ fontSize: "15px" }}
        />
        <FieldLabel label="Age" />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{ fontSize: "15px" }}
        />
        <FieldLabel label="Gender" />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={{ fontSize: "15px" }}
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <FieldLabel label="Religion" />
        <select
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
          style={{ fontSize: "15px" }}
        >
          <option value="">Select Religion</option>
          <option>Islam</option>
          <option>Hindu</option>
          <option>Christian</option>
          <option>Sikh</option>
          <option>Buddhist</option>
          <option>Jain</option>
        </select>
        {/* <input
          placeholder="Religion"
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
          style={{ fontSize: "15px" }}
        /> */}
        <FieldLabel label="Location (City)" />
        <div style={{ position: "relative" }}>
          <input
            placeholder="Start typing city name..."
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onFocus={() => location && setShowSuggestions(true)}
            style={{ fontSize: "15px", width: "100%", boxSizing: "border-box" }}
          />
          {showSuggestions && filteredCities.length > 0 && (
            <div className="city-suggestions">
              {filteredCities.map((city, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => selectCity(city)}
                >
                  📍 {city}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="primary-btn" onClick={updateProfile}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
