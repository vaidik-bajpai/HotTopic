import {Meta, StoryObj} from "@storybook/react"

import MediaRenderer from "../components/renderers/MediaRenderer"

const meta: Meta<typeof MediaRenderer> =  {
    component: MediaRenderer,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof MediaRenderer>

export const Default: Story = {
    args: {
        media : [
            "https://www.vedantawakeup.com/wp-content/uploads/2019/07/Fateh-Sagar-Lake-Udaipur-rj.jpg", // Santorini, Greece
            "https://i0.wp.com/www.tusktravel.com/blog/wp-content/uploads/2021/12/Fateh-Sagar-Lake-Udaipur.jpg?resize=800%2C575&ssl=1", // Bora Bora, French Polynesia
            "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/2b/f0/f7/img-20181018-104236-01.jpg?w=1200&h=1200&s=1", // Machu Picchu, Peru
            "https://hindi.cdn.zeenews.com/hindi/sites/default/files/2024/11/26/3447765-5.gif", // Kyoto, Japan
            "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/d3/67/e4/sas-bahu.jpg?w=1200&h=700&s=1", // Maldives
            "https://www.vedantawakeup.com/wp-content/uploads/2019/07/Fateh-Sagar-Lake-Udaipur-rj.jpg", // Santorini, Greece
            "https://i0.wp.com/www.tusktravel.com/blog/wp-content/uploads/2021/12/Fateh-Sagar-Lake-Udaipur.jpg?resize=800%2C575&ssl=1", // Bora Bora, French Polynesia
            "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/2b/f0/f7/img-20181018-104236-01.jpg?w=1200&h=1200&s=1", // Machu Picchu, Peru
            "https://hindi.cdn.zeenews.com/hindi/sites/default/files/2024/11/26/3447765-5.gif", // Kyoto, Japan
            "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/d3/67/e4/sas-bahu.jpg?w=1200&h=700&s=1" // Maldives
        ]
             
    }
}
