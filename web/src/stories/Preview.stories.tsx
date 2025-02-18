import { Preview } from "../components/Preview";

export default {
    component: Preview,
    tags: ['autodocs'],
    excludeStories: /.*Data$/,
}

export const TypicalPreview= {
    args: {
        userImage: "",
        username: "vaidik_bajpai",
        postImages: "",

    }
}