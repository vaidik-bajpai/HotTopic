import { Meta, StoryObj } from "@storybook/react";
import UserProfileMetadata from "../components/UserProfileMetadata";

const meta: Meta<typeof UserProfileMetadata> = {
    component: UserProfileMetadata,
    tags: ['autodocs'],
    parameters: {
        layout: "centered"
    }
}

export default meta

type Story = StoryObj<typeof UserProfileMetadata>

export const Post: Story = {
    args: {
        metadata: "posts",
        count: 107
    }
} 