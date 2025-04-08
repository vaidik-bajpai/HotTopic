import { useState } from "react"
import FollowerList from "../types/FollowerList"
import axios from "axios"

export default function SearchUser() {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [userList, setUserList] = useState<FollowerList[]>([])
    const [lastID, setLastID] = useState<string>("")

    async function handleGetUsers() {
        try {
            const res = await axios.get(`http://localhost:3000/user?page_size=10&searchTerm=${searchTerm}&lastID=${lastID}`)
            setUserList((prev) => [...prev, ...res.data])
            if(res.data.length) {
                setLastID(res.data[res.data.length-1].id)
            }
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <div>
                <input type="text" onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-blue-800"/>
            </div>

            <div>

            </div>
        </div>
    )
}