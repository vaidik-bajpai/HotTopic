import { Eye, EyeClosed } from "lucide-react";
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
            <div className="flex flex-col-reverse gap-1 font-mono">
                <div className="relative peer">
                    <input
                        {...props}
                        ref={ref}
                        type={visible ? "text" : "password"}
                        placeholder={placeholder}
                        className={`w-full px-3 py-2 pr-10 rounded-xl bg-white border text-black shadow-sm
                            placeholder-gray-400 transition-all duration-200 appearance-none
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                            ${error ? "border-red-500" : "border-gray-300"}`}
                    />

                    <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-indigo-600 cursor-pointer"
                        onClick={() => setVisible(!visible)}
                        aria-label={visible ? "Hide password" : "Show password"}
                    >
                        {visible ? (
                            <EyeClosed />
                        ) : (
                            <Eye />
                        )}
                    </button>
                </div>
                <label className="px-1 text-sm font-semibold text-black transform transition-transform duration-500 peer-focus-within:text-indigo-500 peer-focus-within:translate-x-2">{labelText}</label>

                {error && <div className="text-xs text-red-500 px-1 pt-1">{error}</div>}
            </div>
        );
    }
);

export default PasswordInput;
