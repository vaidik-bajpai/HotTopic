import { Meta, StoryObj } from "@storybook/react";
import AccountActivationModal from "../components/AccountActivationModal";

const meta: Meta<typeof AccountActivationModal> = {
    component: AccountActivationModal,
    parameters: {
        layout: "centered"
    },
    tags: ["autodocs"]
}

export default meta;

type Story = StoryObj<typeof AccountActivationModal>

export const Default: Story = {} 
 