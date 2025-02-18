import { MainHeader } from "../components/Header";
import { Preview } from "../components/Preview";

export default {
    title: "Composite/Create Post",
    tags: ["autodocs"],
};

export const WithHeaderAndPreview = () => {
    return (
        <div className="flex flex-col gap-4">
            <MainHeader headerText="HotTide" notificationCount={0} />
            <Preview userImage="" username="vaidik_bajpai" />
        </div>  
    );
};
