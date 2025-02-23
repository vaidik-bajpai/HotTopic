import { Meta, StoryObj } from "@storybook/react";
import SubmitButton from "../components/SubmitButton";


const meta: Meta<typeof SubmitButton> = {
    component: SubmitButton,
    parameters: {
        layout: "centered"
    }
}

export default meta;

type Story = StoryObj<typeof SubmitButton>

export const Typical: Story = {
    args: {
        buttonText: "Start Trending",
    }
}