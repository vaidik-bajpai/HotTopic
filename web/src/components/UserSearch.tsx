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
                className={`absolute top-0 right-0 w-screen md:w-100 z-100 h-full shadow-md bg-white text-black`}
                initial={{ x: "-100%" }}     
                animate={search ? { x: "100%" } : { x: "-100%" }}        
                exit={{ x: "-100%"}}        
                transition={{ duration: 0.5 }}
            >
                <div>
                    <div className="p-3 flex flex-col border-b-1 py-4 px-4">
                        <div className="flex justify-between items-center">
                            <h1 className="font-semibold text-2xl mb-10 px-2">Search</h1>
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
                            className="appearance-none border-none outline-none bg-indigo-100 w-full p-2 text-black rounded-lg placeholder:text-gray-700"
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                            placeholder="Search"
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
        <li className="flex justify-between" onClick={handleClick}>
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
        <li className="flex gap-4 animate-pulse py-2">
            <div className="w-11 aspect-square bg-indigo-300 rounded-full" />
            <div className="flex flex-col justify-center gap-2 w-full">
                <div className="h-3 bg-indigo-300 rounded w-2/3"></div>
                <div className="h-2 bg-indigo-200 rounded w-3/5"></div>
            </div>
        </li>
    )
}

