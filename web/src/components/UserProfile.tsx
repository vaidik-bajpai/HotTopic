import { Outlet } from "react-router";
import EditProfileButton from "./buttons/EditProfileButton";
import UserBio from "./UserBio";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileMetadata from "./UserProfileMetadata";
import UserProfileName from "./UserProfileName";
import UserProfilePic from "./UserProfilePic";
import UserProfileSlider from "./UserProfileSlider";

function UserProfile() {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <div className="bg-gray-100 shadow-md rounded-xl flex flex-col flex-grow">
                <UserProfileHeader username="vaidik_bajpai"/>
                <div className="flex flex-col flex-grow">
                    <div className="w-full px-4 border-b-2 bg-white shadow-none border-b border-gray-200">
                        <div className="flex flex-col max-w-6xl mx-auto justify-center rounded-lg gap-1 p-2 md:p-4">
                            <div className="flex gap-3 sm:gap-4 md:gap-8">
                                <UserProfilePic profilePic="https://res.cloudinary.com/drg9zdr28/image/upload/v1739635652/co82d4cgoyr2uvaf03xt.jpg"/>
                                <div className="flex flex-col justify-center gap-1 sm:gap-2 2xl:gap-8 2xl:ml-10 2xl:mb-5">
                                    <UserProfileName name="Vaidik Bajpai" pronouns={["he", "him"]}/>
                                    <div className="flex justify-around gap-4 2xl:gap-6">
                                        <UserProfileMetadata metadata="posts" count={134}/>
                                        <UserProfileMetadata metadata="followers" count={256}/>
                                        <UserProfileMetadata metadata="following" count={103}/>
                                    </div>
                                </div>
                            </div>
                            <UserBio bio="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, libero eget venenatis scelerisque, risus velit consequat sapien, eget efficitur sapien nunc nec felis. Sed ut orci." />
                            <EditProfileButton />
                        </div>
                        <div className="mt-2">
                            <UserProfileSlider />
                        </div>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}


export default UserProfile;