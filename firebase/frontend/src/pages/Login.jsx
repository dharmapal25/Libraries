import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);

      // here you can also save the user data to your backend/database

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div >
      <button
        onClick={handleGoogleLogin}
      >
        Login with Google
      </button>
    </div>
  );
}