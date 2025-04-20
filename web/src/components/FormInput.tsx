import React from "react";

interface FormInputInterface extends React.InputHTMLAttributes<HTMLInputElement> {
    labelText: string;
    placeholder: string;
    error?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputInterface>(
    ({ labelText, placeholder, error, ...props }, ref) => {
        return (
            <div className="flex flex-col-reverse gap-1 font-mono w-full">
                {error && <div className="text-xs text-red-500 px-1 pt-1">{error}</div>}
                
                <input
                    {...props}
                    ref={ref}
                    type="text"
                    placeholder={placeholder}
                    className={`w-full peer px-3 py-2 rounded-xl bg-white border transition-all duration-200
                        placeholder-gray-400 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                        ${error ? "border-red-500" : "border-gray-300"}`}
                />

                <label
                    className="px-1 text-sm font-semibold text-black transform transition-transform duration-400 peer-focus:text-indigo-500 peer-focus:translate-x-2"
                >
                    {labelText}
                </label>
            </div>
        );  
    }
);

export default FormInput;
