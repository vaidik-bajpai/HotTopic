import {Meta, StoryObj} from "@storybook/react"

import UnFollowButton from "../components/UnFollowButton"

const meta: Meta<typeof UnFollowButton> =  {
    component: UnFollowButton,
    tags: ['autodocs'],
    parameters: {
        layout: "centered"
    },
}

export default meta

type Story = StoryObj<typeof UnFollowButton>

export const Default: Story = {}
