export function getOptimizedCloudinaryUrl(
    originalUrl: string,
    options: { quality?: string; format?: string; width?: number; } = {}
): string {
    if (!originalUrl.includes("res.cloudinary.com")) return originalUrl;

    const quality = options.quality ?? "auto";
    const format = options.format ?? "auto";
    const width = options.width ?? 400; 

    return originalUrl.replace(
        "/upload/",
        `/upload/w_${width},q_${quality},f_${format}/`
    );
}
