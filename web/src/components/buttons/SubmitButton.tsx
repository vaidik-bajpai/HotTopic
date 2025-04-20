interface SubmitButtonProps {
    buttonText: string;
    isSubmitting: boolean;
}

export default function SubmitButton({ buttonText, isSubmitting }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-bold p-2 font-mono border-2 rounded-lg text-indigo-500 border-indigo-500
                bg-white shadow-[6px_6px_0_rgba(99,102,241,0.6),_-2px_-2px_0_rgba(255,255,255,0.5)]
                hover:shadow-[4px_4px_0_rgba(99,102,241,0.6),_-2px_-2px_0_rgba(255,255,255,0.5)]
                transition-all duration-300 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
        >
            {isSubmitting ? "Submitting..." : buttonText}
        </button>
    );
}
