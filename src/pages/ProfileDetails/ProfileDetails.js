import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProfileDetails.css";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
    doc, getDoc
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import BackButton from "../../Components/BackButton/BackButton";

export default function ProfileDetails() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [sent, setSent] = useState(false);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchProfile = async () => {
            const snap = await getDoc(doc(db, "users", id));
            if (snap.exists()) {
                setProfile(snap.data());
            }
        };
        const fetchInterest = async () => {
            if (!user) return;
            // Check if already sent
            const q = query(
                collection(db, "interests"),
                where("fromUserId", "==", user.uid),
                where("toUserId", "==", id)
            );

            const snap = await getDocs(q);

            if (!snap.empty) {
                setSent(true);
                return;
            }
        }
        fetchProfile();
        fetchInterest();
    }, [id, user]);

    const sendInterest = async () => {

        if (!user) return;

        try {
            // Check if already sent
            const q = query(
                collection(db, "interests"),
                where("fromUserId", "==", user.uid),
                where("toUserId", "==", id)
            );

            const snap = await getDocs(q);

            if (!snap.empty) {
                setSent(true);
                return;
            }

            await addDoc(collection(db, "interests"), {
                fromUserId: user.uid,
                toUserId: id,
                participants: [user.uid, id],
                status: "sent",
                createdAt: serverTimestamp()
            });

            setSent(true);
        } catch (err) {
            alert("Error sending interest");
        }
    };

    const getInitials = (name) => {
        return name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U";
    };

    if (!profile) return <div className="profile-loading">Loading profile...</div>;

    return (
        <div className="profile-details-container">
            <BackButton />

            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-header-bg"></div>
                <div className="profile-avatar-section">
                    {profile.photoURL ? (
                        <img
                            src={profile.photoURL}
                            alt="profile"
                            className="profile-avatar-image"
                        />
                    ) : (
                        <div className="profile-avatar-placeholder">
                            {getInitials(profile.name)}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="profile-main-content">
                {/* Name and Quick Info */}
                <div className="profile-name-section">
                    <h1 className="profile-name">{profile.name}</h1>
                    <p className="profile-tagline">
                        {profile.age && profile.location && `${profile.age} years, ${profile.location}`}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="profile-actions">
                    <button
                        className={`btn-primary ${sent ? 'btn-sent' : ''}`}
                        onClick={sendInterest}
                        disabled={sent}
                    >
                        {sent ? "✓ Interest Sent" : "💌 Send Interest"}
                    </button>
                    {/* <button className="btn-secondary">
                        💬 Message
                    </button> */}
                </div>

                {/* Profile Sections */}
                <div className="profile-sections">
                    {/* Basic Details */}
                    {(profile.name || profile.age || profile.gender || profile.religion) && (
                        <div className="profile-section">
                            <h3 className="section-title">📋 Basic Details</h3>
                            <div className="section-content">
                                {profile.age && <DetailRow label="Age" value={`${profile.age} years`} />}
                                {profile.gender && <DetailRow label="Gender" value={profile.gender} />}
                                {profile.religion && <DetailRow label="Religion" value={profile.religion} />}
                                {profile.location && <DetailRow label="Location" value={profile.location} />}
                            </div>
                        </div>
                    )}

                    {/* Personal Details */}
                    {(profile.height || profile.maritalStatus || profile.motherTongue || profile.diet) && (
                        <div className="profile-section">
                            <h3 className="section-title">👤 Personal Details</h3>
                            <div className="section-content">
                                {profile.height && <DetailRow label="Height" value={`${profile.height} cm`} />}
                                {profile.maritalStatus && <DetailRow label="Marital Status" value={profile.maritalStatus} />}
                                {profile.motherTongue && <DetailRow label="Mother Tongue" value={profile.motherTongue} />}
                                {profile.diet && <DetailRow label="Diet" value={profile.diet} />}
                            </div>
                        </div>
                    )}

                    {/* Career Details */}
                    {(profile.education || profile.profession || profile.income) && (
                        <div className="profile-section">
                            <h3 className="section-title">💼 Career Details</h3>
                            <div className="section-content">
                                {profile.education && <DetailRow label="Education" value={profile.education} />}
                                {profile.profession && <DetailRow label="Profession" value={profile.profession} />}
                                {profile.income && <DetailRow label="Annual Income" value={profile.income} />}
                            </div>
                        </div>
                    )}

                    {/* Family Details */}
                    {(profile.familyType || profile.fatherOccupation || profile.motherOccupation || profile.siblings) && (
                        <div className="profile-section">
                            <h3 className="section-title">👨‍👩‍👧‍👦 Family Details</h3>
                            <div className="section-content">
                                {profile.familyType && <DetailRow label="Family Type" value={profile.familyType} />}
                                {profile.fatherOccupation && <DetailRow label="Father's Occupation" value={profile.fatherOccupation} />}
                                {profile.motherOccupation && <DetailRow label="Mother's Occupation" value={profile.motherOccupation} />}
                                {profile.siblings && <DetailRow label="Siblings" value={profile.siblings} />}
                            </div>
                        </div>
                    )}

                    {/* About */}
                    {profile.about && (
                        <div className="profile-section">
                            <h3 className="section-title">💭 About Me</h3>
                            <div className="section-content about-section">
                                <p className="about-text">{profile.about}</p>
                            </div>
                        </div>
                    )}

                    {/* Expectations */}
                    {profile.expectations && (
                        <div className="profile-section">
                            <h3 className="section-title">🎯 Expectations</h3>
                            <div className="section-content about-section">
                                <p className="about-text">{profile.expectations}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="detail-row">
            <span className="detail-label">{label}</span>
            <span className="detail-value">{value || "Not specified"}</span>
        </div>
    );
}
