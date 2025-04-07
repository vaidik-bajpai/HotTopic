import { Outlet } from "react-router-dom";
import { SavedPostProvider } from "../context/SavedPostContext";

const SavedPostWrapper = () => {
  return (
    <SavedPostProvider>
      <Outlet />
    </SavedPostProvider>
  );
};

export default SavedPostWrapper;
