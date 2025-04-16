import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useState } from "react";
import UserSearch from "./UserSearch";

function Page() {
  const [search, setSearch] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden relative">
      <div className={`flex flex-col md:flex-row w-full md:${expanded ? "w-72" : "w-18"} lg:w-72`}>
          <Sidebar search={search} setSearch={setSearch} expanded={expanded} setExpanded={setExpanded}/>
      </div>
      <div className="flex-1 overflow-y-auto w-full h-screen bg-indigo-100">
        <Outlet />
      </div>
    </div>
  )
}

export default Page
