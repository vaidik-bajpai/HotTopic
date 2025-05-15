import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { throttle } from "lodash";
import axios from "axios";
import { useNavigate } from "react-router";
import { FollowButton, UnFollowButton } from "./FollowerStrip";
import { motion, AnimatePresence } from "framer-motion";

interface ListInterface {
    id: string;
    user_pic: string;
    username: string;
    name: string;
    is_following: boolean;
}

export default function UserSearch({
    search,
    setSearch,
}: {
    search: boolean;
    setSearch: (val: boolean) => void;
}) {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [users, setUsers] = useState<ListInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUsers = async (query: string) => {
        try {   
            if(searchTerm.trim() === "") {
                return
            }
            setLoading(true)
            const res = await axios.get(`http://localhost:3000/user/list?search_term=${searchTerm}&page_size=5`, {
                withCredentials: true,
            })
            if(Array.isArray(res.data.results)) {
                setUsers(res.data.results)
            }
            setLoading(false)
        } catch(err) {
            console.log(err)
            setLoading(false)
        }
        
    };

    const throttledSearch = throttle((value: string) => {
        fetchUsers(value);
    }, 500);

    useEffect(() => {
        if (searchTerm) {
            throttledSearch(searchTerm);
        } else {
            setUsers([]);
        }
    }, [searchTerm]);

    return (
        <AnimatePresence mode="wait">
            {search && <motion.div
                key="user-search"
                className="absolute top-0 right-0 w-screen md:w-[28rem] h-full z-50 bg-gradient-to-br from-indigo-100 to-indigo-200 text-black shadow-xl sm:p-4 border-1 border-indigo-400 md:rounded-r-lg"
                initial={{ x: "-100%" }}     
                animate={search ? { x: "100%" } : { x: "-100%" }}        
                exit={{ x: "-100%"}}        
                transition={{ duration: 0.5 }}
            >
                <div>
                    <div className="p-3 flex flex-col border-b-1 py-4 px-4">
                        <div className="h-1 w-12 bg-indigo-300 rounded-full mx-auto mb-4 opacity-50" />
                        <div className="flex items-center justify-between mb-10">
                            <h1 className="font-semibold text-lg sm:text-2xl px-2 text-indigo-800">Search</h1>
                            <X
                                className="block md:hidden"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSearch(false);
                                }}
                            />
                        </div>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-md border border-indigo-300 bg-white placeholder:text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                            placeholder="Search for users"  
                        />
                    </div>
                    {loading ? <ul className="px-6 py-6">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <UserItemSkeleton key={idx} />
                        ))}
                    </ul> : <ul className="px-6 py-6 space-y-4">
                        {users.map((user) => (
                            <UserListItem userpic={user.user_pic} username={user.username} name={user.name} onClick={() => {setSearch(false); navigate(`/user-profile/${user.id}`)}} is_following={user.is_following}/>
                        ))}
                    </ul>}
                </div>  
            </motion.div>}
        </AnimatePresence>
    );
}

interface UserListItemInterface {
    userpic: string
    username: string
    name: string
    onClick: () => void
    is_following: boolean
}

function UserListItem({userpic, username, name, onClick: handleClick, is_following}: UserListItemInterface) {
    return (
        <li className="flex justify-between items-center bg-white hover:bg-indigo-50 border border-indigo-200 shadow-sm rounded-md px-4 py-3 transition-colors" onClick={handleClick}>
            <div className="flex gap-4">
                <img src={userpic} alt={`${username}'s profile pic`} className="w-11 aspect-square object-cover rounded-full border border-slate"/>
                <div className="flex flex-col justify-center">
                    <div className="font-semibold text-sm">{username}</div>
                    <div className="text-sm text-slate-100">{name}</div>
                </div>
            </div>
            {is_following ? <UnFollowButton onClick={handleClick}/> : <FollowButton onClick={handleClick}/>}
        </li>
    )
}

function UserItemSkeleton() {
    return (
        <li className="flex gap-4 animate-pulse py-3 px-4 bg-white rounded-md border border-indigo-200 shadow-sm">
            <div className="w-11 aspect-square bg-indigo-300 rounded-full" />
            <div className="flex flex-col justify-center gap-2 w-full">
                <div className="h-3 bg-indigo-300 rounded w-2/3"></div>
                <div className="h-2 bg-indigo-200 rounded w-3/5"></div>
            </div>
        </li>
    )
}

