import 'dotenv/config';

const required = ['VITE_CLOUDINARY_UPLOAD_URI', "VITE_CLOUD_PRESET", "VITE_CLOUD_NAME", "VITE_BACKEND_BASE_URI"];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
});
