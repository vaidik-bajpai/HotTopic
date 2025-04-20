interface GetStartedButtonInterface {
    onClick: () => void
}

function GetStartedButton({onClick}: GetStartedButtonInterface) {
    return (
        <button 
            onClick={onClick}
            className="cursor-pointer font-mono text-xs px-2 py-2 md:text-base bg-indigo-400 font-bold transition-all duration-500 hover:text-indigo-800 hover:bg-indigo-100 hover:ring-2 hover:ring-indigo-500">
                Get Started
        </button>
    )
}

export default GetStartedButton;