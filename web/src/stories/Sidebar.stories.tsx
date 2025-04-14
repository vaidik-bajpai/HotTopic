import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom"; 
import Sidebar from "../components/Sidebar";
import { UserProvider } from "../context/UserContext"; // Adjust path if needed

const meta: Meta<typeof Sidebar> = {
  title: "Side Bar",
  component: Sidebar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <UserProvider>
        <div className="relative flex flex-col md:flex-row w-fit"><Story /></div>
        </UserProvider>
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: { active: true },
};
