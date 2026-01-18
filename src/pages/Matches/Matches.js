import { useContext, useEffect, useState } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import {
  calculateMatchScore,
  passesHardFilters
} from "../../utils/matchingEngine";

import "./Matches.css";
import { AuthContext } from "../../Context/AuthContext";

export default function Matches() {
  const [profiles, setProfiles] = useState([]);
  const [LoadingMessage, setLoadingMessage] = useState("No Matches yet...");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfiles = async () => {
      const meSnap = await getDoc(doc(db, "users", user.uid));
      if (!meSnap.exists()) {
        console.log("User profile does not exist.");
        setLoadingMessage("No Profile found. Please create your profile...");
        return;
      }
      
      const me = meSnap.data();
      console.log("My profile:", me);
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
      console.log("Matched profiles:", result);
      // sort best match first
      result.sort((a, b) => b.matchScore - a.matchScore);

      setProfiles(result);
    };
    if (user) {
      fetchProfiles();
    }
    else {
      console.log("No user logged in");
    }
  }, [user]);

  if (profiles.length === 0) {
    return <p style={{ padding: 40 }}>{LoadingMessage}</p>;
  }
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
