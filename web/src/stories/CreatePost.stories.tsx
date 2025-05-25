import type { Meta, StoryObj } from "@storybook/react";
import CreatePost from "../components/forms/CreatePost";
import { UserProvider } from "../context/UserContext"; // If needed
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof CreatePost> = {
  component: CreatePost,
  title: "Forms/CreatePost",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <UserProvider>
          <div className="p-4 max-w-2xl mx-auto">
            <Story />
          </div>
        </UserProvider>
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CreatePost>;

export const Default: Story = {
  args: {
    // If CreatePost accepts props like setCreatePost or any state props,
    // you can mock them here:
    // setCreatePost: () => {},
  },
};
