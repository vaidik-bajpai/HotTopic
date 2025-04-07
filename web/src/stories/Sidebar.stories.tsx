import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom"; 
import Sidebar from "../components/Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Side Bar",
  component: Sidebar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: { active: true },
};
