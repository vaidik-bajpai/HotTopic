import { Meta, StoryObj } from "@storybook/react";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";

const meta: Meta<typeof ResetPasswordForm> = {
    title: "Reset Password Form",
    component: ResetPasswordForm,
    tags: ['autodocs'],
    parameters: {
        layout: "centered"
    }
}

export default meta;

type Story = StoryObj<typeof ResetPasswordForm>

export const Default: Story = {}