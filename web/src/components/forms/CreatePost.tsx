import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    CopyPlus,
    Images,
    X,
} from "lucide-react";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { motion } from 'framer-motion';
import { showToast } from "../../utility/toast";

const schema = yup.object().shape({
    caption: yup.string().required("Caption is required"),
});

export default function CreatePost({
    setCreatePost,
}: {
    setCreatePost: Dispatch<SetStateAction<boolean>>;
}) {
    const navigate = useNavigate()
    const [medias, setMedias] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isNext, setIsNext] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    function handleAddMedia(e: ChangeEvent<HTMLInputElement>) {
        const selectedMedias = e.target.files;
        if (!selectedMedias) {
            return;
        }
        setMedias((prevMedias) => [...prevMedias, ...Array.from(selectedMedias)]);
    }

    
    const onSubmit = async (data: { caption: string }) => {
        if (medias.length === 0) {
            showToast("Media is required!", "error");
            return;
        }

        setIsLoading(true);

        try {
            const uploadedImagesURLs: string[] = [];

            for (let i = 0; i < medias.length; i++) {
                try {
                    const formData = new FormData();
                    formData.append("file", medias[i]);
                    formData.append("upload_preset", "Cloudinary-demo");
                    formData.append("cloud_name", "drg9zdr28");

                    const res = await axios.post(import.meta.env.VITE_CLOUDINARY_UPLOAD_URI!, formData);
                    uploadedImagesURLs.push(res.data.url);
                } catch (uploadErr) {
                    showToast(`Failed to upload file: ${medias[i].name}`, "error");
                    throw uploadErr;
                }
            }

            await axios.post(
                "http://localhost:3000/post/create",
                {
                    caption: data.caption,
                    medias: uploadedImagesURLs,
                },
                { withCredentials: true }
            );

            showToast("Post created");

            reset();
            setMedias([]);
            setIsNext(false);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    showToast("Unauthorized. Please login again.", "error");
                    navigate("/");
                } else {
                    console.error("Error Occurred!", err.response?.data || err.message);
                }
            } else {
                console.error("Unknown error occurred!", err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMedia = (index: number) => {
        setMedias((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const newImages = medias.map((media) => URL.createObjectURL(media));
        setPreviewImages(newImages);

        return () => {
            newImages.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [medias]);

    return (
        <div className="fixed flex flex-col z-200 inset-0 p-2 backdrop-blur-sm bg-indigo-100/50">
            <div className="w-full cursor-pointer" onClick={() => setCreatePost(false)}>
                <X className="ml-auto" />
            </div>  
            <div className="flex-grow flex flex-col justify-center items-center">
                {medias.length === 0 && (
                    <>
                        <h1 className="font-semibold mb-1">Create new post</h1>
                        <div className="w-full max-w-lg aspect-square bg-white flex justify-center items-center">
                            <label
                                htmlFor="media"
                                className="border-dashed border-2 border-indigo-800 w-3/4 aspect-square flex flex-col justify-center items-center gap-2"
                            >
                                <Images className="w-1/4 h-1/4" strokeWidth={1} />
                                <div className="text-md md:text-xl">
                                    Click to share photos
                                </div>
                                <motion.span className="text-xs bg-indigo-600 text-white px-4 py-1.5 rounded-lg md:text-sm font-semibold mt-2"
                                    whileHover={{
                                        y: -2,
                                        boxShadow: "0px 6px 16px rgba(79, 70, 229, 0.3)",
                                }}>
                                    Upload
                                </motion.span>
                            </label>
                            <input
                                type="file"
                                className="hidden"
                                name="media"
                                id="media"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleAddMedia(e)}
                            />
                        </div>
                    </>
                )}

                {medias.length > 0 && (
                    <form className="w-fit" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex justify-between w-full px-2 font-semibold mb-1">
                            <ArrowLeft />
                            <h1 className="">Preview</h1>
                            {isNext ? (
                                <button
                                    className="text-indigo-800 cursor-pointer"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Posting..." : "Share"}
                                </button>
                            ) : (
                                <button
                                    className="text-indigo-800 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsNext(true);
                                    }}
                                >
                                    Next
                                </button>
                            )}
                        </div>

                        <div className="relative flex-col bg-white flex justify-center items-center">
                            {previewImages.map((image, i) => (
                                <div className="max-w-lg" key={i}>
                                    {index === i && (
                                        <img
                                            src={image}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    {!isNext && (
                                        <>
                                            <X
                                                className="absolute top-0 right-0 m-2 cursor-pointer"
                                                onClick={() => handleRemoveMedia(index)}
                                            />
                                            <label htmlFor="media">
                                                <CopyPlus className="absolute bottom-0 right-0 -scale-x-100 m-2 cursor-pointer" />
                                            </label>
                                            <input
                                                type="file"
                                                className="hidden"
                                                name="media"
                                                id="media"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => handleAddMedia(e)}
                                            />
                                        </>
                                    )}
                                    {!isNext && index !== 0 && (
                                        <button
                                            className="z-10 absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full opacity-50 md:p-0.5 mx-1"
                                            onClick={() => setIndex(index - 1)}
                                        >
                                            <ChevronLeft />
                                        </button>
                                    )}
                                    {!isNext && index !== previewImages.length - 1 && (
                                        <button
                                            className="z-10 absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full opacity-50 md:p-0.5 mx-1"
                                            onClick={() => setIndex(index + 1)}
                                        >
                                            <ChevronRight />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {isNext && (
                                <div className="w-full pt-2 pb-3 px-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-indigo-800 font-semibold">
                                            Caption
                                        </label>
                                        <input
                                            type="text"
                                            className="appearance-none border-none outline-none bg-indigo-300 p-2 rounded-lg"
                                            {...register("caption")}
                                        />
                                        {errors.caption && (
                                            <span className="text-red-600 text-sm">
                                                {errors.caption.message}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
