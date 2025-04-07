import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

function Page() {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden relative">
      <div className="flex flex-col md:flex-row w-full md:w-18 lg:w-72">
          <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto w-full bg-indigo-100">
        <Outlet />
      </div>
    </div>
  )
}

export default Page
