import { Meta, StoryObj } from "@storybook/react";
import UserProfileName from "../components/UserProfileName";

const meta: Meta<typeof UserProfileName> = {
    component: UserProfileName,
    tags: ['autodocs'],
    parameters: {
        layout: "centered"
    },
}

export default meta

type Story = StoryObj<typeof UserProfileName>

export const Male: Story = {
    args: {
        name: "Vaidik Bajpai",
        pronouns: ["he", "him"],
    }
}  

export const Female: Story = {
    args: {
        name: "Priyanka",
        pronouns: ["she","her","hers"]
    }
}