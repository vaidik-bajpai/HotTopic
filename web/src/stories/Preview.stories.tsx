import { Preview } from "../components/forms/Preview";

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