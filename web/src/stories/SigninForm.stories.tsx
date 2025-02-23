import { Meta, StoryObj } from "@storybook/react";
import SigninForm from "../components/SigninForm";


const meta: Meta<typeof SigninForm> = {
    component: SigninForm,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    }
}

export default meta;

type Story = StoryObj<typeof SigninForm>

export const Signin: Story = {}