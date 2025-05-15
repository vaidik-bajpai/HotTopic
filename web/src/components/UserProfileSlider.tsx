import { useLocation, useNavigate, useParams } from "react-router";
import UserProfileSliderItem from "./UserProfileSliderItem";

export default function UserProfileSlider() {
    const { userID } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const basePath = `/user-profile/${userID}`;

    return (
        <div className="flex justify-center items-center w-full rounded-md overflow-hidden divide-x sm:divide-x-2 divide-indigo-400 border sm:border-2 border-indigo-400">
            <UserProfileSliderItem
                itemText="posts"
                selected={location.pathname === basePath}
                onClick={() => navigate(basePath)}
            />
            <UserProfileSliderItem
                itemText="followers"
                selected={location.pathname === `${basePath}/followers`}
                onClick={() => navigate(`${basePath}/followers`)}
            />
            <UserProfileSliderItem
                itemText="following"
                selected={location.pathname === `${basePath}/followings`}
                onClick={() => navigate(`${basePath}/followings`)}
            />
        </div>
    );
}
