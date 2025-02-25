import { Meta, StoryObj } from "@storybook/react";
import UserProfile from "../components/UserProfile";

const meta: Meta<typeof UserProfile> = {
    component: UserProfile,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof UserProfile>

export const Default: Story = {} 