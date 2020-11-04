import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import dotenv from 'dotenv'


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'chiji',
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const editUpload = multer({ dest: 'uploads/' })


const parser = multer({ storage: storage})
export { parser, cloudinary, editUpload }