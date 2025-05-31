import { useNavigate } from "react-router";
import GetStartedButton from "./buttons/GetStartedButton";
import { useEffect, useState } from "react";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";

interface MainHeaderInterface {
    headerText: string;
}

export function MainHeader({ headerText }: MainHeaderInterface) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { id } = useSelector((state: RootState) => state.auth);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        setIsLoggedIn(!!id);
    }, [id])

    return (
        <div className="bg-slate-50 px-4 py-3 shadow-lg relative">
            <div className="mx-auto max-w-7xl flex justify-between items-center">
                <h1 className="font-mono text-indigo-900 font-bold md:text-3xl">{headerText}</h1>
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
        </div>
    );
}
