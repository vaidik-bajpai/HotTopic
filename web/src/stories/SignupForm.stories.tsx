import { Meta, StoryObj } from "@storybook/react";
import SignupForm from "../components/forms/SignupForm";


const meta: Meta<typeof SignupForm> = {
    component: SignupForm,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    }
}

export default meta;

type Story = StoryObj<typeof SignupForm>

export const Signup: Story = {}