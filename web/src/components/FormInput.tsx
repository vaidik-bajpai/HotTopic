interface FormInputInterface {
    labelText: string
    placeholder: string
    error?:string
} 

export default function FormInput({labelText, placeholder, error, ...props}: FormInputInterface) {
    return (
        <div className="flex flex-col gap-1 font-mono">
            <label 
                htmlFor=""
                className="px-2 font-bold text-sm"
            >{labelText}</label>

            <input
                {...props}
                type="text"
                placeholder={placeholder}
                className="px-2 py-2  rounded bg-blue-100 appearance-none min-w-2xs border border-transparent focus:outline-none"/>

            {error && <div className="text-red-500 text-xs px-2">{error}</div>}
        </div>
    )
}