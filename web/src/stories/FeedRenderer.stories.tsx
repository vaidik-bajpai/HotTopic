import {Meta, StoryObj} from "@storybook/react"

import FeedRenderer from "../components/FeedRenderer"

const meta: Meta<typeof FeedRenderer> =  {
    component: FeedRenderer,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof FeedRenderer>

export const Default: Story = {}
