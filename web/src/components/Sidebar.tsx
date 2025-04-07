import React, { useState } from "react"
import { House, BookMarked, BookHeart, LogOut, User, PlusSquare, Flame, Search} from 'lucide-react';
import { useLocation, useNavigate } from "react-router";
import {  useRecoilValue } from "recoil";
import { userAtom } from "../state/atoms/userAtom";

export default function Sidebar() {
    const [expanded, setExpanded] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const user = useRecoilValue(userAtom)

    return (
        <>
            {/* Top bar with hamburger icon */}
            <div className="flex w-full py-2 px-4 md:hidden">
                <div className="flex justify-between items-center w-full">
                    <h1 className="font-bold text-lg">Feed</h1>
                    <div className="cursor-pointer" onClick={() => setExpanded(true)}>
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
                fixed top-0 left-0 h-screen z-30 bg-white
                transition-transform duration-500 p-4
                ${expanded ? "translate-x-0 w-full" : "-translate-x-full"} md:transition-[width]
                md:translate-x-0 md:w-18 md:hover:w-72 md:overflow-hidden md:border-r md:border-r-2 md:border-black
                lg:w-72 group
            `}>
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
                    <LogoAppName icon={<Flame fill="#3730a3" size={40}/>} name="HotTopic" active={location.pathname == ""}/>

                    <SidebarItem icon={<House />} name="Home" active={location.pathname.includes("/dashboard")} onClick={() => {console.log(location.pathname); navigate("/dashboard")}}/>

                    <SidebarItem icon={<PlusSquare />} name="Create" active={location.pathname.includes("/create-post")} onClick={() => {console.log(location.pathname); navigate("create-post")}}/>

                    <SidebarItem icon={<Search />} name="Search" active={location.pathname.includes("/search")} onClick={() => {console.log(location.pathname); navigate("search")}}/>

                    <SidebarItem icon={<User />} name="Profile" active={location.pathname.includes(`user-profile/${user.id}`)} onClick={() => {console.log(location.pathname); console.log(user); navigate(`user-profile/${user.id}`)}}/>

                    <SidebarItem icon={<BookMarked />} name="Saved Posts" active={location.pathname.includes("/saved-gallery")} onClick={() => {console.log(location.pathname); navigate("saved-gallery")}}/>

                    <SidebarItem icon={<BookHeart />} name="Liked Posts" active={location.pathname.includes("/liked-gallery")} onClick={() => {console.log(location.pathname); navigate("liked-gallery")}}/>

                    <SidebarItem icon={<LogOut />} name="Logout"/>
                </ul>
            </div>
        </>
    )
}

interface SidebarItemInterface {
    icon: React.ReactNode
    name: string
    onClick?: () => void
    active?: boolean
}

function SidebarItem({icon, name, onClick, active}: SidebarItemInterface) {
    return (
        <li className={`flex gap-4 py-2 px-2 rounded-lg group transition-[background] duration-500 cursor-pointer hover:text-indigo-800 hover:bg-indigo-100 md:gap-0 md:group-hover:gap-4 lg:gap-4
        ${active ? "bg-indigo-200 text-indigo-800" : ""}`}
        onClick={onClick}>
            {icon}

            <div className="overflow-hidden whitespace-nowrap transition-opacity duration-300 md:w-0 md:group-hover:w-full lg:w-full ">{name}</div>
        </li>
    )
}

function LogoAppName({icon, name}: SidebarItemInterface) {
    return (
        <h1 className="flex gap-3 items-center mb-2 md:gap-0 md:group-hover:gap-4 lg:gap-4">
            {icon}

            <p className="overflow-hidden whitespace-nowrap transition-opacity duration-300 md:w-0 md:group-hover:w-full text-lg font-bold lg:w-full ">{name}</p>
        </h1>
    )
}