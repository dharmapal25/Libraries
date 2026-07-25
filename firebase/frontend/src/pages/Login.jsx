import { signInWithPopup } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);

      // here you can also save the user data to your backend/database

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  if (loading) {
    return <div><p>Loading...</p></div>;
  }

  if (user) {
    return null;
  }

  return (
    <div>
      <button onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
}



// ---------------------

// const handleGoogleLogin = async () => {
//   try {
//     const result = await signInWithPopup(auth, googleProvider);
//     const idToken = await result.user.getIdToken();

//     const response = await fetch("http://localhost:5000/api/auth/google-login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include", // 👈 cookies allow 
//       body: JSON.stringify({ idToken }),
//     });

//     const data = await response.json();
//     console.log(data.user);
//     // redirect ---
//   } catch (error) {
//     console.error(error);
//   }
// };