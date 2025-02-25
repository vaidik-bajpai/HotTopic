import EditProfileButton from "./EditProfileButton";
import UserBio from "./UserBio";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileMetadata from "./UserProfileMetadata";
import UserProfileName from "./UserProfileName";
import UserProfilePic from "./UserProfilePic";

function UserProfile() {
    return (
        <div className="min-h-screen">
            <div className="">
                {/* profile container */}
                <UserProfileHeader username="vaidik_bajpai"/>
                <div className="flex-col">

                    <div className="basis-[30%] w-full px-4 ">
                        <div className="flex flex-col mx-auto justify-center w-xs rounded-lg shadow-[6px_6px_0px_rgba(147,197,253,1)] border-2 border-blue-400 gap-3 p-4 sm:p-4 sm:w-sm md:w-lg md:gap-4">
                            <div className="flex gap-3 sm:gap-4 md:gap-8">
                                <UserProfilePic profilePic="https://res.cloudinary.com/drg9zdr28/image/upload/v1739635652/co82d4cgoyr2uvaf03xt.jpg"/>
                                
                                <div className="flex flex-col justify-center gap-1 sm:gap-2">
                                    <UserProfileName name="Vaidik Bajpai" pronouns={["he", "him"]}/>
                                    <div className="flex justify-around gap-4">
                                        <UserProfileMetadata metadata="posts" count={134}/>
                                        <UserProfileMetadata metadata="followers" count={256}/>
                                        <UserProfileMetadata metadata="following" count={103}/>
                                    </div>
                                </div>
                            </div>
                            <UserBio bio="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, libero eget venenatis scelerisque, risus velit consequat sapien, eget efficitur sapien nunc nec felis. Sed ut orci." />
                            <EditProfileButton />
                        </div>
                    </div>

                    <div className="grow-1 "></div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile;