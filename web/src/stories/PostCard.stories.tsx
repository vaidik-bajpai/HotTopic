import { PostCard } from "../components/PostCard";

export default {
    component: PostCard,
    tags: ['autodocs'],
    excludeStories: /.*Data$/,
}

export const TypicalPost = {
    args: {
        userImage: "",
        username: "vaidik_bajpai",
        images: ["some url"],
        caption: "Inside city palace, Udaipur"
    }
}

export const LongCaption = {
    args: {
        userImage: "",
        username: "vaidik_bajpai",
        images: ["some url"],
        caption: "Embracing the chaos, chasing the dreams, and finding beauty in every little moment. Life’s a journey—make it unforgettable! ✨🌍 #StayInspired"
    }
}

export const LongUsername = {
    args: {
        userImage: "",
        username: "the_destroyer_of_the_universe_and_the_protector",
        images: ["some url"],
        caption: "Inside city palace, Udaipur"
    }
}