import React, { useState } from "react"
import { House, BookMarked, BookHeart, LogOut, User, PlusSquare, Flame, Search} from 'lucide-react';
import { useLocation, useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import axios from "axios";
import CreatePost from "./CreatePost";
import UserSearch from "./UserSearch";

interface SidebarInterface {
    search: boolean,
    setSearch: (val: boolean) => void,
    expanded: boolean,
    setExpanded: (val: boolean) => void
}

export default function Sidebar({search, setSearch, expanded, setExpanded}: SidebarInterface) {
    const [createPost, setCreatePost] = useState<boolean>(false)
    const location = useLocation()
    const navigate = useNavigate()
    const user = useUser()

    function handleClickWrapper(fn: () => void) {
        if(search === true) {
            setSearch(false)
            setExpanded(true)
        }
        fn()
    }

    async function handleLogout() {
        try {
            await axios.post(
                `http://localhost:3000/auth/logout`, null, 
                { withCredentials: true }
            );           
            user.logout()
        } catch(err) {
            console.error(err)
        }
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
        <>
            {/* Top bar with hamburger icon */}
            <div className="flex flex-col w-full md:hidden py-2 px-4">
                <div className="flex justify-between items-center w-full">
                    <h1 className="font-bold text-lg">Feed</h1>
                    <div className="cursor-pointer " onClick={() => setExpanded(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                            <line x1="4" x2="20" y1="12" y2="12" />
                            <line x1="4" x2="20" y1="6" y2="6" />
                            <line x1="4" x2="20" y1="18" y2="18" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Full screen sidebar overlay */}
            <div className={`
                fixed top-0 left-0 md:relative h-screen z-100 bg-white
                transition-transform duration-500 p-4
                ${expanded ? "translate-x-0 w-full" : "-translate-x-full"} md:transition-[width]
                md:translate-x-0 md:w-${expanded ? "72" : "18"} md:border-r md:border-r-2 md:border-black
                lg:w-${search ? "18" : "72"} group
            `}  
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
                {/* Close button on top right */}
                <div className="flex justify-end md:hidden">
                    <div className="cursor-pointer" onClick={() => setExpanded(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </div>
                </div>

                {/* Sidebar content */}
                <ul className="h-full flex flex-col gap-6 mt-4 px-2 md:px-0">
                    <LogoAppName icon={<Flame fill="#3730a3" size={40}/>} name="HotTopic" active={location.pathname == ""} expanded={expanded} search={search}/>

                    <SidebarItem icon={<House />} name="Home" active={location.pathname.includes("/dashboard")} onClick={() => {handleClickWrapper(() => navigate("/dashboard"))}} expanded={expanded} search={search}/>

                    <SidebarItem icon={<PlusSquare />} name="Create" active={location.pathname.includes("/create-post")} onClick={() => {handleClickWrapper(() => setCreatePost(true))}} expanded={expanded} search={search}/>

                    <SidebarItem icon={<Search />} name="Search" active={location.pathname.includes("/search")} onClick={() => {setExpanded(false); setSearch(true)}} expanded={expanded} search={search}/>

                    <SidebarItem icon={<User />} name="Profile" active={location.pathname.includes(`user-profile/${user.id}`)} onClick={() => {handleClickWrapper(() => navigate(`user-profile/${user.id}`))}} expanded={expanded} search={search}/>

                    <SidebarItem icon={<BookMarked />} name="Saved Posts" active={location.pathname.includes("/saved-gallery")} onClick={() => {handleClickWrapper(() => navigate("saved-gallery"))}} expanded={expanded} search={search}/>

                    <SidebarItem icon={<BookHeart />} name="Liked Posts" active={location.pathname.includes("/liked-gallery")} onClick={() => {handleClickWrapper(() => navigate("liked-gallery"))}} expanded={expanded} search={search}/>

                    <SidebarItem icon={<LogOut />} name="Logout" onClick={handleLogout} expanded={expanded} search={search}/>
                </ul>
                {search && <UserSearch search={search} setSearch={setSearch}/>}
            </div>
            {createPost && <CreatePost setCreatePost={setCreatePost}/>}
        </>
    )
}

interface SidebarItemInterface {
    icon: React.ReactNode
    name: string
    onClick?: () => void
    active?: boolean
    expanded: boolean
    search: boolean
}

function SidebarItem({icon, name, onClick, active, expanded, search}: SidebarItemInterface) {
    return (
        <li className={`flex gap-4 py-2 px-2 rounded-lg group transition-[background] duration-500 cursor-pointer hover:text-indigo-800 hover:bg-indigo-100 md:${expanded ? "gap-4" : "gap-0"} lg:${search ? "gap-0" : "gap-4"}
        ${active ? "bg-indigo-200 text-indigo-800" : ""}`}
        onClick={onClick}>
            {icon}

            <div
                className={`overflow-hidden whitespace-nowrap transition-[width] duration-300
                    ${expanded ? "md:w-auto md:block" : "md:w-0 md:hidden"}
                    ${!search ? "lg:w-auto lg:block" : "lg:w-0 lg:hidden"}`}
            >
                {name}
            </div>

        </li>
    )
}

function LogoAppName({icon, name, expanded, search}: SidebarItemInterface) {
    return (
        <h1 className="flex gap-3 items-center mb-2 md:gap-0 md:group-hover:gap-4 lg:gap-4">
            {icon}

            <p className={`overflow-hidden whitespace-nowrap transition-opacity duration-300 ${expanded ? "md:w-auto md:block" : "md:w-0 md:hidden"}
            ${!search ? "lg:w-auto lg:block" : "lg:w-0 lg:hidden"} text-lg font-bold`}>
                {name}
            </p>
        </h1>
    )   
}