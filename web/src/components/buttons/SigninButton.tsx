interface SigninButtonInterface {
    onClick: () => void
}

function SigninButton({onClick}: SigninButtonInterface) {
    return (
        <button 
            onClick={onClick}
            className="cursor-pointer font-mono px-2 py-2 bg-blue-300 rounded font-bold">
                Signin
        </button>
    )
}

export default SigninButton;