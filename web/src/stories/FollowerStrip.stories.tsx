import {Meta, StoryObj} from "@storybook/react"

import FollowerStrip from "../components/FollowerStrip"

const meta: Meta<typeof FollowerStrip> =  {
    component: FollowerStrip,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof FollowerStrip>

export const Default: Story = {
    args: {
        userID: "1",
        username: "vaidik bajpai",
        isFollowing: true,
    },
}
