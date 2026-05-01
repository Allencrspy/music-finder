import { useAuth } from "../../context/AuthProvider";
import Button from "../ui/Button";

interface UserProfileProps {
  onLoginClick: () => void;
}

const UserProfile = ({ onLoginClick }: UserProfileProps) => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return (
      <Button variant="ghost" fullWidth onClick={onLoginClick}>
        Log In to Save Music
      </Button>
    );
  }

  return (
    <div className="user-chip">
      <div className="user-avatar">
        {currentUser.email?.[0].toUpperCase()}
      </div>
      <span className="user-email">{currentUser.email?.split("@")[0]}</span>
      <button className="user-logout-btn" onClick={logout} title="Log Out">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="18px"
          viewBox="0 -960 960 960"
          width="18px"
          fill="currentColor"
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
        </svg>
      </button>
    </div>
  );
};

export default UserProfile;
