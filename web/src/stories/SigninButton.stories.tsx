import { Meta, StoryObj } from "@storybook/react";

import SigninButton from "../components/SigninButton";

const meta: Meta<typeof SigninButton> = {
    component: SigninButton,
    tags: ['autodocs'],
    parameters: {
        layout: "centered"
    }
}

export default meta

type Story = StoryObj<typeof SigninButton>

export const Default: Story = {
    args: {
        buttonText: "Sign in"
    }
}