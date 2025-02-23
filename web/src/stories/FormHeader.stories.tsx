import type { Meta, StoryObj } from '@storybook/react';
import FormHeader from '../components/FormHeader';
 
const meta: Meta<typeof FormHeader> = {
    title: "Form Header",
    component: FormHeader,
    tags: ["autodocs"]
};
 
export default meta;
type Story = StoryObj<typeof FormHeader>;
 
export const Typical: Story = {
    args: {
        headerText: "Sign up"
    },
};