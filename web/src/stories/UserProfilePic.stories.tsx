import { Meta, StoryObj } from "@storybook/react";
import UserProfilePic from "../components/UserProfilePic";

const meta: Meta<typeof UserProfilePic> = {
    component: UserProfilePic,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered'
    }
}

export default meta;

type Story = StoryObj<typeof UserProfilePic>

export const Default: Story = {
    args: {
        profilePic: "https://res.cloudinary.com/drg9zdr28/image/upload/v1739635652/co82d4cgoyr2uvaf03xt.jpg"
    }
}