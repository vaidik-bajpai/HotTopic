import {Meta, StoryObj} from "@storybook/react"

import FollowButton from "../components/buttons/FollowButton"

const meta: Meta<typeof FollowButton> =  {
    component: FollowButton,
    tags: ['autodocs'],
    parameters: {
        layout: "centered"
    },
}

export default meta

type Story = StoryObj<typeof FollowButton>

export const Default: Story = {}
