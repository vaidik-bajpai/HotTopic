interface SigninButtonInterface {
    buttonText: string
}

function SigninButton({buttonText}: SigninButtonInterface) {
    return (
        <button className="font-mono px-2 py-2 bg-blue-300 rounded-lg font-bold ring ring-blue-500 hover:shadow-[0px_0px_20px_rgba(147,197,253,1)]">
            {buttonText}
        </button>
    )
}

export default SigninButton;