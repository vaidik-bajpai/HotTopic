interface MainHeaderInterface {
    headerText: string
    notificationCount: number
}

export function MainHeader({headerText, notificationCount}: MainHeaderInterface) {
    return (
        <div className="flex justify-between items-center max-h-md px-2 py-2">
            <h1 className="font-mono font-bold text-2xl">{headerText}</h1>
            <div className="flex gap-4">
                <button className="pointer-cursor">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-plus"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                </button>
                <button className="pointer-cursor relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
                    <div className={`${notificationCount === 0 ? "" : "hidden"} absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full text-white`}>{notificationCount}</div>
                </button>
            </div>
        </div>
    )
}


