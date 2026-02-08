import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export default function Navbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const myProfile = JSON.parse(
        localStorage.getItem("myProfile") || "{}"
    );

    const goTo = (path) => {
        navigate(path);
        setOpen(false);
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.clear();
        goTo("/login-register");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="navbar">
            <div className="logo-section">
                <button className="home-icon-btn" onClick={() => goTo("/")} title="Go to Home">
                    🏠
                </button>
                <div className="logo" onClick={() => goTo("/")}>
                    ShaadiLite
                </div>
            </div>

            <div className="burger" onClick={() => setOpen(!open)}>
                ☰
            </div>

            <div ref={menuRef} className={`menu ${open ? "open" : ""}`}>
                {/* Profile Header */}
                <div className="menu-profile">
                    <div className="avatar">👤</div>
                    <div className="name">
                        {myProfile.name || "My Profile"}
                    </div>
                </div>

                <span onClick={() => goTo("/")}>Home</span>
                <span onClick={() => goTo("/matches")}>Matches</span>
                <span onClick={() => goTo("/received-interests")}>
                    Received Interests
                </span>
                <span onClick={() => goTo("/accepted-matches")}>
                    Accepted Matches
                </span>
                <span onClick={
                    () => goTo("/chats")}>Chats</span>

                <span onClick={() => goTo("/my-profile")}>My Profile</span>
                <span onClick={logout}>Logout</span>
            </div>
        </div>
    );
}
