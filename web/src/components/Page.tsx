import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useState } from "react";

function Page() {
  const [search, setSearch] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [createPost, setCreatePost] = useState<boolean>(false);
  const [headerText, setHeaderText] = useState<string>("Feed");

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden relative">
      <div className={`flex flex-col md:flex-row md:${expanded ? "w-72" : "w-18"} lg:w-72`}>
          <Sidebar 
            search={search}
            setSearch={setSearch}
            expanded={expanded}
            setExpanded={setExpanded}
            createPost={createPost}
            setCreatePost={setCreatePost}
            headerText={headerText}
            setHeaderText={setHeaderText}/>
      </div>
      <div className="flex-1 overflow-y-auto w-full h-screen bg-indigo-100">
          <Outlet context={{ setSearch: setSearch, setCreatePost: setCreatePost, setHeaderText }} />
      </div>
    </div>
  )
}

export default Page
