import {Meta, StoryObj} from '@storybook/react'
import EditProfileButton from '../components/EditProfileButton'

const meta: Meta<typeof EditProfileButton> = {
    component: EditProfileButton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered'
    }
}

export default meta;

type Story = StoryObj<typeof EditProfileButton>

export const Default:Story = {}  