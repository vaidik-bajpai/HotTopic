import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react"
import { toast } from "react-toastify";

interface PreviewInterface {
    userImage: string
    username: string
}

export function Preview({userImage, username}: PreviewInterface) {
    const [medias, setMedias] = useState<File[]>([]);
    const [caption, setCaption] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isCaption, setIsCaption] = useState<boolean>(false);

    function handleAddMedia(e: ChangeEvent<HTMLInputElement>) {
        const selectedMedias = e.target.files
        if(!selectedMedias) {
            return
        }

        setMedias((prevMedias) => [...prevMedias, ...selectedMedias])
    }

    async function handlePost() {
        if(!caption || medias.length == 0) {
            toast.error("Caption and media are required!", { position: "top-right" });
            return
        }

        try {
            const formData = new FormData()
            let uploadedImagesURLs: string[] = []

            for(let i = 0; i < medias.length; i++) {
                formData.append('file', medias[i])
                formData.append('upload_preset', 'Cloudinary-demo')
                formData.append('cloud_name', 'drg9zdr28')

                const res = await axios.post("https://api.cloudinary.com/v1_1/drg9zdr28/image/upload", formData)
                uploadedImagesURLs.push(res.data.url)
            }

            const res = await axios.post("some url", {
                caption: caption,
                media: uploadedImagesURLs,
            })
            console.log(res)
            toast.success("Posted", {
                position: "top-right", 
            })

            setCaption(""); 
            setMedias([]);  
        } catch(err) {
            console.error("Error Occurred!")
            toast.error("Your post could not happen", {
                position: "top-right",
            })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const newImages = medias.map((media) => URL.createObjectURL(media));
        setPreviewImages(newImages);
    
        return () => {
            newImages.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [medias]);

    return (
        <div className="font-mono">
            <div className="px-2 flex justify-end">
                <button className="my-2 py-2 px-3 rounded bg-blue-400 font-semibold" onClick={handlePost}>
                    Post
                </button>
            </div>

            <div className="flex py-2 px-2 gap-3 items-center">
                <h2 className="rounded-full w-8 h-8 bg-blue-300">{userImage}</h2>
                <p className="font-bold text-sm">{username}</p>
            </div>

            <div className="w-full h-80 bg-blue-100 flex items-center justify-center">
                <Renderer images={previewImages}/>
                <AddComponent onChange={handleAddMedia}/>
            </div>

            <div className="flex justify-between px-2 py-2">
                <div className="flex gap-8">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </button>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                    </button>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
                    </button>
                </div>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
            </div>

            <textarea 
                className={`text-sm px-2 font-medium focus:outline-none focus:border-none   
                            ${isCaption ? "w-full h-max break-words" : "w-2xs whitespace-nowrap overflow-hidden text-ellipsis"}
                            appearance-none border-none background-transparent resize-none`} 
                onFocus={() => setIsCaption(true)} 
                onBlur={() => setIsCaption(false)}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCaption(e.target.value)}
                placeholder="Enter the caption here..." 
            />
        </div>
    )
}

interface RendererInterface {
    images: string[]
}

function Renderer({images}: RendererInterface) {
    return (
        <>
        {
            images.map((image, index) => (
                <div className="bg-black w-full h-full flex justify-center">
                    <img
                        key={index}
                        src={image}
                        className="max-w-full max-h-full object-contain" />
                </div>
            ))
        }
        </>
    )
}

interface AddComponentInterface {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function AddComponent({onChange}: AddComponentInterface) {
    return (
        <div className="border-dashed border-3 p-8" onChange={onChange}>
            <label htmlFor="media" className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-images"><path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/></svg>
                <div>Add Images</div>
            </label>
            <input type="file" name="media" className="hidden" id="media"/>
        </div>
    )
}