import UserProfileSliderItem from "./UserProfileSliderItem";

export default function UserProfileSlider() {
    return (
        <div className="flex justify-around items-center w-full border-b-2 ">
            <UserProfileSliderItem itemText="posts"/>
            <UserProfileSliderItem itemText="followers"  styles="border-x-1"/>
            <UserProfileSliderItem itemText="following"/>
        </div>
    )
}