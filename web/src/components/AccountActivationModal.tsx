import { useEffect, useState } from "react";

interface AccountActivationModalInterface {
    setIsActivation: (value: boolean) => void
}

function AccountActivationModal({setIsActivation}: AccountActivationModalInterface) {
    const [counter, setCounter] = useState<number>(10)

    useEffect(() => {
        if (counter > 0) {
            const timer = setTimeout(() => setCounter(counter - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsActivation(false);
        }
    }, [counter, setIsActivation]);
    return (
        <div className="w-full min-h-screen flex justify-center items-center fixed inset-0 backdrop-blur-sm">
            <div className="font-mono flex flex-col gap-1 justify-center items-center border border-2 border-blue-400 p-3 rounded-lg bg-white">
                <div
                    className="ml-auto cursor-pointer transition-transform duration-200 hover:rotate-360 transform"
                    onClick={() => setIsActivation(false)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <h1 className="text-2xl font-bold">Account Activation</h1>
                <p>Your account is still not activated.</p>
                <div className="flex ml-auto gap-2 mt-8 mb-2">
                    <Button buttonText={"Skip " + "(" + counter + ")"}/>
                    <Button buttonText={"Activate Now!"}/>
                </div>
            </div>
        </div>
    )
}

export default AccountActivationModal;

interface ButtonInterface {
    buttonText: string
}

function Button({buttonText}: ButtonInterface) {
    return (
        <button className="p-2 border-2 border-blue-400 cursor-pointer shadow-[5px_5px_0px_rgba(96,165,250,0.5)] hover:shadow-[4px_4px_0px_rgba(96,165,250,0.5)]">
            {buttonText}
        </button>
    )
}
