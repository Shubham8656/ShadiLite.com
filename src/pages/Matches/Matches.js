import { useEffect, useState } from "react";
import { collection, getDocs,getDoc,doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import {
  calculateMatchScore,
  passesHardFilters
} from "../../utils/matchingEngine";

import "./Matches.css";

export default function Matches() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const meSnap = await getDoc(doc(db, "users", user.uid));
      const me = meSnap.data();

      const snap = await getDocs(collection(db, "users"));
      const result = [];
      snap.forEach((docu) => {
        const other = { id: docu.id, ...docu.data() };

        if (other.id === user.uid) return;

        if (!passesHardFilters(me, other)) return;

        const score = calculateMatchScore(me, other);

        result.push({
          ...other,
          matchScore: score
        });
      });

      // sort best match first
      result.sort((a, b) => b.matchScore - a.matchScore);

      setProfiles(result);
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
