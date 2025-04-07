import React, { useState } from "react";

interface PasswordInputInterface extends React.InputHTMLAttributes<HTMLInputElement> {
    labelText: string;
    placeholder: string;
    error?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputInterface>(
    ({ labelText, placeholder, error, ...props }, ref) => {
        const [visible, setVisible] = useState<boolean>(false);

        return (
            <div className="flex flex-col gap-1 font-mono">
                <label className="px-2 font-bold text-sm">{labelText}</label>

                <div className="flex justify-between">
                    <input
                        {...props}
                        ref={ref} // Forward the ref properly
                        type={visible ? "text" : "password"}
                        placeholder={placeholder}
                        className="px-2 py-2 w-full rounded bg-blue-100 appearance-none min-w-2xs border border-transparent focus:outline-none"
                    />
                    <button
                        type="button"
                        className="w-fit px-2 pointer-cursor"
                        onClick={() => setVisible(!visible)}
                    >
                        {visible ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-closed">
                                <path d="m15 18-.722-3.25"/>
                                <path d="M2 8a10.645 10.645 0 0 0 20 0"/>
                                <path d="m20 15-1.726-2.05"/>
                                <path d="m4 15 1.726-2.05"/>
                                <path d="m9 18 .722-3.25"/>
                            </svg>
                        )}
                    </button>
                </div>

                {error && <div className="text-red-500 text-xs px-2">{error}</div>}
            </div>
        );
    }
);

export default PasswordInput;
