import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { UserProvider } from "../context/UserContext";
import { useState } from "react";
import UserSearch from "../components/UserSearch"; // Make sure it's correctly imported

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <UserProvider>
          <div className="relative flex flex-col md:flex-row w-fit min-h-screen bg-gray-50">
            <Story />
          </div>
        </UserProvider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    expanded: {
      control: "boolean",
      defaultValue: true,
    },
    search: {
      control: "boolean",
      defaultValue: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

interface SidebarStoryWrapperProps {
  expanded: boolean;
  search: boolean;
}

// 👇 Interactive Wrapper
const SidebarStoryWrapper = ({ expanded, search }: SidebarStoryWrapperProps) => {
  const [isExpanded, setExpanded] = useState(expanded);
  const [isSearch, setSearch] = useState(search);

  return (
    <div className={`relative flex flex-col md:flex-row w-full md:${isExpanded ? "w-72" : "w-18"} lg:${isSearch ? "w-18" : "w-72"}`}>
      <Sidebar
        search={isSearch}
        setSearch={setSearch}
        expanded={isExpanded}
        setExpanded={setExpanded}
      />
      {isSearch && <UserSearch search={isSearch} />}
    </div>
  );
};

// 👇 Default story with interactive controls
export const Default: Story = {
  render: (args) => <SidebarStoryWrapper {...args} />,
};
