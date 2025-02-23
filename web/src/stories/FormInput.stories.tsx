import { Meta, StoryObj } from "@storybook/react";

import FormInput from "../components/FormInput";

const meta: Meta<typeof FormInput> = {
    component: FormInput,
    decorators: [
        (Story) => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Story />
            </div>
        )
    ]
}

export default meta;
type Story = StoryObj<typeof FormInput>

export const Typical: Story = {
    args: {
        labelText:"Email",
        placeholder: "Enter your email"
    }
}