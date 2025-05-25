import 'dotenv/config';

const required = ['CLOUDINARY_UPLOAD_URI'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
});
