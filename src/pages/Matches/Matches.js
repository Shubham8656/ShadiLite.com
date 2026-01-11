import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import "./Matches.css";

export default function Matches() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDocs(collection(db, "users"));
      const list = [];

      snap.forEach(doc => {
        if (doc.id !== user.uid) {
          list.push({ id: doc.id, ...doc.data() });
        }
      });

      setProfiles(list);
    };

    fetchProfiles();
  }, []);

  return (
    <div className="matches-page">
      <h2>Matches for You</h2>

      <div className="matches-grid">
        {profiles.map(profile => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
}
