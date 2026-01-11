import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-card">
        <h1>Find Your Life Partner</h1>
        <p>Simple • Trusted • Secure</p>

        <div className="home-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
