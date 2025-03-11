import {Meta, StoryObj} from "@storybook/react"

import UserProfileSlider from "../components/UserProfileSlider"

const meta: Meta<typeof UserProfileSlider> =  {
    component: UserProfileSlider,
    tags: ['autodocs'],
    parameters: {
        layout: "centered"
    },
}

export default meta

type Story = StoryObj<typeof UserProfileSlider>

export const Default: Story = {}
