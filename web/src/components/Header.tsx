import { useNavigate } from "react-router";
import GetStartedButton from "./buttons/GetStartedButton";
import SignupButton from "./buttons/SignupButton";
import { useState } from "react";
import { useUser } from "../context/UserContext";

interface MainHeaderInterface {
    headerText: string;
}

export function MainHeader({ headerText }: MainHeaderInterface) {
    const navigate = useNavigate();
    const {isLoggedIn, logout} = useUser();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="bg-slate-50 flex justify-between items-center px-4 py-3 shadow-lg relative">
            <h1 className="font-mono text-indigo-900 font-bold text-2xl ">{headerText}</h1>
            {!isLoggedIn ? (
                <GetStartedButton onClick={() => navigate("/signin")} />
            ) : (
                <div>
                    <button onClick={() => setIsOpen(!isOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                            <line x1="4" x2="20" y1="12" y2="12" />
                            <line x1="4" x2="20" y1="6" y2="6" />
                            <line x1="4" x2="20" y1="18" y2="18" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
