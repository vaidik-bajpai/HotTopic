interface SubmitButton {
    buttonText: string
    isSubmitting: boolean
}

export default function SubmitButton({buttonText, isSubmitting}: SubmitButton) {
    return (
        <button type="submit" disabled={isSubmitting} className="border-2 w-full text-blue-400 font-bold p-2 font-mono shadow-[6px_6px_0_rgba(30,85,180,0.6),_-2px_-2px_0_rgba(255,255,255,0.5)] 
            border-blue-400 hover:shadow-[4px_4px_0_rgba(30,85,180,0.6),_-2px_-2px_0_rgba(255,255,255,0.5)] transition-all duration-300 cursor-pointer">
                {buttonText}
        </button>
    )
}
           