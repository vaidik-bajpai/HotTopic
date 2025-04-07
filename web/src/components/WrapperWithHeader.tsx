import { Outlet } from "react-router";
import { MainHeader } from "./Header";

function WrapperWithHeader() {
    return (
        <div className="flex flex-col min-h-screen w-full bg-blue-50">
            <MainHeader headerText="HotTopic" notificationCount={0} />
            <main className="flex-1 flex justify-center items-start pt-12 sm:pt-20 px-4">
                <Outlet />
            </main>
        </div>
    );
}

export default WrapperWithHeader;
