import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";

function ProtectedComponent() {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isLoggedIn) {
      navigate("/");
    }
  }, [user.isLoggedIn, navigate]);

  // Prevent rendering before redirect check
  if (!user.isLoggedIn) return null;

  return <Outlet />;
}

export default ProtectedComponent;
