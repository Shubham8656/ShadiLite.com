import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { calculateProfileCompletion } from "../../utils/matchingEngine";
import "./Home.css";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setProfile(snap.data());
      }
      console.log(snap.data());
    };
    load();
    
  }, []);

  if (!profile) {
    return <p style={{ padding: 40 }}>Loading...</p>;
  }else {
    var percent = calculateProfileCompletion(profile, profile);
  }



  return (
    <div className="home-container ">
      {/* Welcome */}
      <div className="home-card welcome">
        <h2>Welcome, {profile.name} 👋</h2>
        <p>Let’s help you find your perfect life partner.</p>
      </div>

      {/* Profile completion */}
      <div className="home-card welcome">
        <h3>Profile Completion</h3>

        <div className="progress-bar ">
          <div
            className="progress-fill"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p>{percent}% completed</p>

        {percent < 70 && (
          <button
            className="primary-btn"
            onClick={() => navigate("/profile-completion")}
          >
            Complete Profile
          </button>
        )}

        {percent >= 70 && (
          <button
            className="primary-btn"
            onClick={() => navigate("/matches")}
          >
            View Matches
          </button>
        )}
      </div>

      {/* Quick actions */}
      <div className="home-card welcome">
        <h3>Quick Actions</h3>

        <div className="quick-actions">
          <button onClick={() => navigate("/matches")}>
            🔍 Find Matches
          </button>

          <button onClick={() => navigate("/my-profile")}>
            👤 My Profile
          </button>

          <button onClick={() => navigate("/chats")}>
            💬 Chats
          </button>
        </div>
      </div>
    </div>
  );
}
