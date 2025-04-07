import { Outlet } from "react-router-dom";
import { LikedPostProvider } from "../context/LikedPostContext";

const LikedPostWrapper = () => {
  return (
    <LikedPostProvider>
      <Outlet />
    </LikedPostProvider>
  );
};

export default LikedPostWrapper;
