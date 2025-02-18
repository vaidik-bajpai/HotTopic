import { MainHeader } from "../components/Header";

export default {
    component: MainHeader,
    title: 'Main Header',
    tags: ['autodocs'],
    excludeStories: /.*Data$/,
    args: {
        headerText: "HotTide"
    },
}

export const Default = {
    args: {
        headerText: "HotTopic",
        NotificationCount: 0,
    }
}