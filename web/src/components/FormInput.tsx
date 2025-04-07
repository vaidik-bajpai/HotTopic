import React from "react";

interface FormInputInterface extends React.InputHTMLAttributes<HTMLInputElement> {
    labelText: string;
    placeholder: string;
    error?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputInterface>(
    ({ labelText, placeholder, error, ...props }, ref) => {
        return (
        <div className="flex flex-col gap-1 font-mono">
            <label className="px-2 font-bold text-sm">{labelText}</label>

            <input
            {...props}
            ref={ref} // Attach ref here
            type="text"
            placeholder={placeholder}
            className="px-2 py-2 rounded bg-blue-100 appearance-none min-w-2xs border border-transparent focus:outline-none"
            />

            {error && <div className="text-red-500 text-xs px-2">{error}</div>}
        </div>
        );
    }
);

export default FormInput;
