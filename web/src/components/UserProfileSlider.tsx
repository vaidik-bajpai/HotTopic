import { useLocation, useNavigate, useParams } from "react-router";
import UserProfileSliderItem from "./UserProfileSliderItem";

export default function UserProfileSlider() {
    const { userID } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    return (
        <div className="flex justify-around items-center w-full">
            <UserProfileSliderItem itemText="posts" selected={location.pathname === `/user-profile/${userID}`} onClick={() => navigate(`/user-profile/${userID}`)}/>
            <UserProfileSliderItem itemText="followers"  styles="border-x-1 border-x-black" selected={location.pathname === `/user-profile/${userID}/followers`} onClick={() => navigate(`/user-profile/${userID}/followers`)}/>
            <UserProfileSliderItem itemText="following" selected={location.pathname === `/user-profile/${userID}/followings`} onClick={() => navigate(`/user-profile/${userID}/followings`)}/>
        </div>
    )
}