import { useState, useEffect, useContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import BackButton from "../../Components/BackButton/BackButton";
import "./MyPreference.css";

// List of major Indian cities for autocomplete
const INDIAN_CITIES = [
    "Any Location", "Maharashtra",
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

// List of Indian languages for autocomplete
const INDIAN_LANGUAGES = [
    "Any Language",
    "Assamese", "Awadhi",
    "Bengali", "Bhojpuri", "Bodo", "Brij",
    "Chhattisgarhi", "Chakma", "Dogri",
    "English",
    "Gondi", "Gujarati",
    "Haryanvi", "Hindi",
    "Kannada", "Kashmiri", "Khasi", "Konkani", "Kumaoni",
    "Maithili", "Malayalam", "Manipuri", "Marathi", "Meitei", "Mewari", "Mizoram", "Moghul",
    "Nepali",
    "Odia", "Oriya",
    "Punjabi",
    "Rajasthani",
    "Sanskrit", "Santali", "Sindhi", "Sinhala", "Slovak", "Spanish",
    "Tamil", "Telugu", "Tibetan", "Tigrinya", "Tulu",
    "Urdu", "Uttarakhandhi",
    "Vaghri",
    "Garwali"
];

export default function MyPreference() {
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);
    const [preferences, setPreferences] = useState({
        ageMin: 20,
        ageMax: 35,
        religion: "",
        location: "",
        height: "",
        education: "",
        profession: "",
        maritalStatus: "",
        caste: "",
        motherTongue: "",
        diet: "",
        smoking: "No",
        drinking: "No",
        familyType: "",
        annualIncomeMin: "",
        annualIncomeMax: "",
        traits: "",
        expectation: "",
    });

    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [filteredCities, setFilteredCities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);

    useEffect(() => {
        const fetchPreferences = async () => {
            if (!user) return;
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) {
                const data = snap.data();
                if (data.preferences) {
                    setPreferences(data.preferences);
                }
            }
        };
        fetchPreferences();
    }, [user]);

    const handleChange = (field, value) => {
        setPreferences({
            ...preferences,
            [field]: value,
        });
    };

    // Handle location input with city autocomplete
    const handleLocationChange = (value) => {
        handleChange("location", value);

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

    // Select city from suggestions
    const selectCity = (city) => {
        handleChange("location", city);
        setShowSuggestions(false);
        setFilteredCities([]);
    };

    // Handle language input with language autocomplete
    const handleLanguageChange = (value) => {
        handleChange("motherTongue", value);

        if (value.trim().length > 0) {
            const filtered = INDIAN_LANGUAGES.filter(language =>
                language.toLowerCase().startsWith(value.toLowerCase())
            ).slice(0, 8); // Show max 8 suggestions
            setFilteredLanguages(filtered);
            setShowLanguageSuggestions(filtered.length > 0);
        } else {
            setFilteredLanguages([]);
            setShowLanguageSuggestions(false);
        }
    };

    // Select language from suggestions
    const selectLanguage = (language) => {
        handleChange("motherTongue", language);
        setShowLanguageSuggestions(false);
        setFilteredLanguages([]);
    };

    const savePreferences = async () => {
        if (!user) return;

        try {
            setSaving(true);
            await setDoc(
                doc(db, "users", user.uid),
                {
                    preferences: preferences,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            );
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            alert("Error saving preferences");
        } finally {
            setSaving(false);
        }
        navigate("/matches");
    };

    if (loading) {
        return <div className="pref-loading">Loading...</div>;
    }

    return (
        <div className="preference-container">
            <BackButton />

            {/* Header Section */}
            <div className="pref-header">
                <div className="pref-header-bg"></div>
                <div className="pref-header-content">
                    <h1 className="pref-title">My Preferences</h1>
                    <p className="pref-subtitle">Tell us what you're looking for</p>
                </div>
            </div>

            {/* Success Message */}
            {saveSuccess && (
                <div className="success-banner">
                    ✓ Preferences saved successfully!
                </div>
            )}

            {/* Main Content */}
            <div className="pref-main-content">
                <div className="pref-sections">
                    {/* Age Preference */}
                    <div className="pref-section">
                        <h3 className="section-title">🎂 Age Preference</h3>
                        <div className="section-content">
                            <div className="range-input-group">
                                <div className="range-item">
                                    <label>From</label>
                                    <input
                                        type="number"
                                        value={preferences.ageMin}
                                        onChange={(e) =>
                                            handleChange("ageMin", parseInt(e.target.value))
                                        }
                                        min="18"
                                        max="100"
                                        className="input-field"
                                    />
                                    <span className="unit">years</span>
                                </div>
                                <div className="range-item">
                                    <label>To</label>
                                    <input
                                        type="number"
                                        value={preferences.ageMax}
                                        onChange={(e) =>
                                            handleChange("ageMax", parseInt(e.target.value))
                                        }
                                        min="18"
                                        max="100"
                                        className="input-field"
                                    />
                                    <span className="unit">years</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Height Preference */}
                    <div className="pref-section">
                        <h3 className="section-title">📏 Height Preference</h3>
                        <div className="section-content">
                            <input
                                type="text"
                                placeholder="e.g. 160 cm"
                                value={preferences.height}
                                onChange={(e) => handleChange("height", e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Religion & Caste */}
                    <div className="pref-section">
                        <h3 className="section-title">🕌 Religion & Community</h3>
                        <div className="section-content">
                            <select
                                value={preferences.religion}
                                onChange={(e) => handleChange("religion", e.target.value)}
                                className="input-field"
                            >
                                <option value="">Religion (Any)</option>
                                <option>Islam</option>
                                <option>Hindu</option>
                                <option>Christian</option>
                                <option>Sikh</option>
                                <option>Buddhist</option>
                                <option>Jain</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Caste/Community (optional)"
                                value={preferences.caste}
                                onChange={(e) => handleChange("caste", e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Location Preference */}
                    <div className="pref-section">
                        <h3 className="section-title">📍 Location</h3>
                        <div className="section-content">
                            <div style={{ position: "relative" }}>
                                <input
                                    type="text"
                                    placeholder="Start typing city name..."
                                    value={preferences.location}
                                    onChange={(e) => handleLocationChange(e.target.value)}
                                    onFocus={() => preferences.location && setShowSuggestions(true)}
                                    className="input-field"
                                    style={{ width: "100%" }}
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
                        </div>
                    </div>

                    {/* Education & Career */}
                    <div className="pref-section">
                        <h3 className="section-title">🎓 Education & Career</h3>
                        <div className="section-content">
                            <select
                                value={preferences.education}
                                onChange={(e) => handleChange("education", e.target.value)}
                                className="input-field"
                            >
                                <option value="">Education (Any)</option>
                                <option>10th Pass</option>
                                <option>12th Pass</option>
                                <option>Diploma</option>
                                <option>Bachelor's Degree</option>
                                <option>Master's Degree</option>
                                <option>Professional Degree</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Profession (optional)"
                                value={preferences.profession}
                                onChange={(e) => handleChange("profession", e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Income Preference */}
                    <div className="pref-section">
                        <h3 className="section-title">💰 Annual Income Range</h3>
                        <div className="section-content">
                            <div className="range-input-group">
                                <div className="range-item">
                                    <label>From</label>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={preferences.annualIncomeMin}
                                        onChange={(e) =>
                                            handleChange("annualIncomeMin", e.target.value)
                                        }
                                        className="input-field"
                                    />
                                    <span className="unit">₹ LPA</span>
                                </div>
                                <div className="range-item">
                                    <label>To</label>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={preferences.annualIncomeMax}
                                        onChange={(e) =>
                                            handleChange("annualIncomeMax", e.target.value)
                                        }
                                        className="input-field"
                                    />
                                    <span className="unit">₹ LPA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Marital Status */}
                    <div className="pref-section">
                        <h3 className="section-title">💍 Marital Status</h3>
                        <div className="section-content">
                            <select
                                value={preferences.maritalStatus}
                                onChange={(e) => handleChange("maritalStatus", e.target.value)}
                                className="input-field"
                            >
                                <option value="">Any</option>
                                <option>Never Married</option>
                                <option>Divorced</option>
                                <option>Widowed</option>
                                <option>Separated</option>
                            </select>
                        </div>
                    </div>

                    {/* Lifestyle */}
                    <div className="pref-section">
                        <h3 className="section-title">🌿 Lifestyle</h3>
                        <div className="section-content">
                            <div className="preference-group">
                                <label>Mother Tongue</label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type="text"
                                        placeholder="e.g., Urdu, Hindi, English"
                                        value={preferences.motherTongue}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                        className="input-field"
                                        onFocus={() => {
                                            if (preferences.motherTongue && filteredLanguages.length > 0) {
                                                setShowLanguageSuggestions(true);
                                            }
                                        }}
                                    />
                                    {showLanguageSuggestions && filteredLanguages.length > 0 && (
                                        <div className="city-suggestions">
                                            {filteredLanguages.map((language, index) => (
                                                <div
                                                    key={index}
                                                    className="suggestion-item"
                                                    onClick={() => selectLanguage(language)}
                                                >
                                                    {language}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="preference-group">
                                <label>Diet</label>
                                <select
                                    value={preferences.diet}
                                    onChange={(e) => handleChange("diet", e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">Any</option>
                                    <option>Vegetarian</option>
                                    <option>Non-Vegetarian</option>
                                    <option>Eggetarian</option>
                                </select>
                            </div>
                            <div className="preference-group">
                                <label>Smoking</label>
                                <select
                                    value={preferences.smoking}
                                    onChange={(e) => handleChange("smoking", e.target.value)}
                                    className="input-field"
                                >
                                    <option>No</option>
                                    <option>Yes</option>
                                    <option>Occasionally</option>
                                </select>
                            </div>
                            <div className="preference-group">
                                <label>Drinking</label>
                                <select
                                    value={preferences.drinking}
                                    onChange={(e) => handleChange("drinking", e.target.value)}
                                    className="input-field"
                                >
                                    <option>No</option>
                                    <option>Yes</option>
                                    <option>Occasionally</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Family Preference */}
                    <div className="pref-section">
                        <h3 className="section-title">👨‍👩‍👧‍👦 Family Preference</h3>
                        <div className="section-content">
                            <select
                                value={preferences.familyType}
                                onChange={(e) => handleChange("familyType", e.target.value)}
                                className="input-field"
                            >
                                <option value="">Family Type (Any)</option>
                                <option>Nuclear</option>
                                <option>Joint</option>
                            </select>
                        </div>
                    </div>

                    {/* Personal Traits */}
                    <div className="pref-section">
                        <h3 className="section-title">⭐ Personality Traits</h3>
                        <div className="section-content">
                            <textarea
                                placeholder="Describe the personality traits you're looking for (kind, ambitious, caring, humorous, etc.)"
                                value={preferences.traits}
                                onChange={(e) => handleChange("traits", e.target.value)}
                                className="textarea-field"
                                rows="4"
                            />
                        </div>
                    </div>

                    {/* Expectations */}
                    <div className="pref-section">
                        <h3 className="section-title">🎯 Expectations</h3>
                        <div className="section-content">
                            <textarea
                                placeholder="What else would you like your partner to know about your expectations?"
                                value={preferences.expectation}
                                onChange={(e) => handleChange("expectation", e.target.value)}
                                className="textarea-field"
                                rows="4"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="pref-actions">
                    <button
                        className="btn-save"
                        onClick={savePreferences}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "💾 Save Preferences"}
                    </button>
                </div>
            </div>
        </div>
    );
}
