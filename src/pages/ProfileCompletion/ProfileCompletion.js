import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ProfileCompletion() {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) setProfile(snap.data());
        };
        load();
    }, [profile]);

    if (!profile) return <p style={{ padding: 40 }}>Loading...</p>;

    return (
        <div className="matches-page">
            <h2>Complete Your Profile</h2>
            <div className="spacer-10" />
            <div className="profile-card welcome" onClick={() => navigate("/edit-profile")}>
                Basic Details {profile.name && profile.age && profile.gender && profile.religion && profile.location ? "✅" : "❌"}
            </div>
            <div className="spacer-10" />
            <div className="profile-card welcome" onClick={() => navigate("/personal-details")}>
                Personal Details {profile.height && profile.maritalStatus && profile.motherTongue && profile.diet ? "✅" : "❌"}
            </div>
            <div className="spacer-10" />
            <div className="profile-card welcome" onClick={() => navigate("/career-details")}>
                Education & Career {profile.education && profile.profession && profile.income ? "✅" : "❌"}
            </div>
            <div className="spacer-10" />
            <div className="profile-card welcome" onClick={() => navigate("/family-details")}>
                Family Details {profile.familyType && profile.fatherOccupation && profile.motherOccupation && profile.siblings ? "✅" : "❌"}
            </div>
            <div className="spacer-10" />
            <div className="profile-card welcome" onClick={() => navigate("/about-me")}>
                About Me {profile.aboutMe ? "✅" : "❌"}
            </div>
        </div>
    );
}
