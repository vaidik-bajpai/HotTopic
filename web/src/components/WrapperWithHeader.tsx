import { Outlet } from "react-router";
import { MainHeader } from "./Header";

function WrapperWithHeader() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <MainHeader headerText="HotTopic" notificationCount={0}/>
            <div className="flex-1 flex justify-center items-center">
                <Outlet /> 
            </div>
        </div>
    )
}

export default WrapperWithHeader;