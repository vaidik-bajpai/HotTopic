import { Meta, StoryObj } from "@storybook/react";
import { ForgotPasswordForm } from "../components/forms/ForgotPasswordForm";

const meta: Meta<typeof ForgotPasswordForm> = {
    component: ForgotPasswordForm,
    tags: ['autodocs'],
    parameters: {
        layout: "centered"
    }
}

export default meta;

type Story = StoryObj<typeof ForgotPasswordForm>

export const Default: Story = {}