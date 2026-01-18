import { useNavigate } from "react-router-dom";
import "./SignInOrSignUp.css";

export default function SignInOrSignUp() {
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
