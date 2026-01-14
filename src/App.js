import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/login/login";
import Register from "./pages/Register/Register";
import ProfileSetup from "./pages/Profile/Profile";
import Matches from "./pages/Matches/Matches";
import ProfileDetails from "./pages/ProfileDetails/ProfileDetails";
import Navbar from "./Components/Navbar/Navbar";
import MyProfile from "./pages/MyProfile/MyProfile";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import ReceivedInterests from "./pages/ReceivedInterests/ReceivedInterests";
import AcceptedMatches from "./pages/AcceptedMatches/AcceptedMatches";
import Chats from "./pages/Chats/Chats";
import ChatRoom from "./pages/ChatRoom/ChatRoom";
import EditProfile from "./pages/EditProfile/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><ProfileDetails /></ProtectedRoute>} />
        <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/received-interests" element={<ProtectedRoute><ReceivedInterests /></ProtectedRoute>} />
        <Route path="/accepted-matches" element={<ProtectedRoute><AcceptedMatches /></ProtectedRoute>} />
        <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
        <Route path="/chat/:chatId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      </Routes>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
