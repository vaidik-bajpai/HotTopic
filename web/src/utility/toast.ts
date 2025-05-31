import { toast } from "react-toastify";

export function showToast(
  message: string,
  type: "success" | "error" | "info" = "success",
  autoClose: number = 1000
) {
  toast.dismiss();

  const options = { autoClose };

  if (type === "success") {
    toast.success(message, options);
  } else if (type === "error") {
    toast.error(message, options);
  } else if (type === "info") {
    toast.info(message, options);
  }
}

