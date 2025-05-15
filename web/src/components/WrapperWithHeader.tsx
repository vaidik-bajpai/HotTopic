import { Outlet } from "react-router";
import { MainHeader } from "./Header";

function WrapperWithHeader() {
    return (
        <div className="flex flex-col min-h-screen w-full bg-indigo-100">
            <MainHeader headerText="HotTopic" />
            <main className="flex-grow flex justify-center items-center md:px-4">
                <Outlet />
            </main>
        </div>
    );
}

export default WrapperWithHeader;
