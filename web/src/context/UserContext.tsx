import { createContext, useContext, useState, ReactNode } from "react";

export interface UserContextType {
  id: string;
  isLoggedIn: boolean;
  setUser: (user: { id: string; isLoggedIn: boolean }) => void;
  logout: () => void;
}

const defaultUser = {
  id: "",
  isLoggedIn: false,
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : defaultUser;
  });

  const setUser = (newUser: { id: string; isLoggedIn: boolean }) => {
    setUserState(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUserState(defaultUser);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ ...user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}
