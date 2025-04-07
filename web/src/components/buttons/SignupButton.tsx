interface SignupButtonInterface {
    onClick: () => void
}

function SignupButton({onClick}: SignupButtonInterface) {
    return (
        <button 
            onClick={onClick}
            className="cursor-pointer text-blue-400 border-2 bg-blue-50 border-blue-400 font-mono px-2 py-2 rounded font-bold">
                Signup
        </button>
    )
}

export default SignupButton;