import { toast } from "react-toastify";

export function showToast(message: string, type: "success" | "error" | "info"= "success") {
    toast.dismiss();
    if (type === "success") {
        toast.success(message);
    } else if (type === "error") {
        toast.error(message);
    } else if (type === "info") {
        toast.info(message)
    }
}
