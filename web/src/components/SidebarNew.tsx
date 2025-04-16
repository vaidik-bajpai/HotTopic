import { useState } from "react"

export default function SidebarNew() {
    const [search, setSearch] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<boolean>(true);

    function openSearch() {
        setSearch(true);
        setExpanded(false);
    }

    function closeSearch() {
        setSearch(false);
        setExpanded(true);
    }

    function handleMouseEnter() {
        if(search) {
            return 
        }

        setExpanded(true)
    }

    function handleMouseLeave() {
        if(search) {
            return 
        }

        setExpanded(false)
    }

    return (
        <div className={`fixed top-0 left-0 flex h-screen z-[200]`}>
            {/* Sidebar */}
            <div
                className={`bg-indigo-100 w-full transition-all duration-500 ease-in-out
                md:${expanded ? "w-72" : "w-18"} lg:${search ? "w-18" : "w-72" }`}
                onClick={openSearch}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                Sidebar
            </div>

            {/* UserSearch */}
            {search && <div
                className={`w-90 bg-white h-full shadow-md transform transition-transform duration-300 ease-in-out
                ${search ? "-translate-x-0" : "-translate-x-100"}`}
                onClick={closeSearch}
            >
                Search
            </div>}
        </div>
    );
}
