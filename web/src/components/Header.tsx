import { useNavigate } from "react-router";
import SigninButton from "./buttons/SigninButton";
import SignupButton from "./buttons/SignupButton";
import { useRecoilState } from "recoil";
import { userAtom } from "../state/atoms/userAtom";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";

interface MainHeaderInterface {
    headerText: string;
    notificationCount: number;
}

const sidebarVariants = {
    open: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
        x: "100%",
        opacity: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
    },
};

export function MainHeader({ headerText }: MainHeaderInterface) {
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userAtom);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    async function handleLogout() {
        try {
            await axios.post("http://localhost:3000/auth/logout")
            setUser({isLoggedIn: false, id: ""})
            setIsOpen(false)
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <div className="bg-blue-50 flex justify-between items-center px-4 py-3 border-b relative">
            <h1 className="font-mono font-bold text-2xl">{headerText}</h1>
            {user.isLoggedIn ? (
                <div className="flex gap-4">
                    <SigninButton onClick={() => navigate("/signin")} />
                    <SignupButton onClick={() => navigate("/signup")} />
                </div>
            ) : (
                <div>
                    <button onClick={() => setIsOpen(!isOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                            <line x1="4" x2="20" y1="12" y2="12" />
                            <line x1="4" x2="20" y1="6" y2="6" />
                            <line x1="4" x2="20" y1="18" y2="18" />
                        </svg>
                    </button>
                    <motion.nav
                        initial="closed"
                        animate={isOpen ? "open" : "closed"}
                        variants={sidebarVariants}
                        className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                        <ul className="mt-10 space-y-4">
                            <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate("/home")}>
                                Saved Posts
                            </li>
                            <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate("/about")}>
                                Liked Posts
                            </li>
                            <li 
                                onClick={() => handleLogout()}
                                className="cursor-pointer hover:text-blue-500">
                                Log out
                            </li>
                        </ul>
                    </motion.nav>
                </div>
            )}
        </div>
    );
}
