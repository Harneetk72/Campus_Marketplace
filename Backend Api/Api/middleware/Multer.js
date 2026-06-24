import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudnary.js";

const storage = new CloudinaryStorage({
cloudinary , 
params:{
    folder : "campus-market-place",
    allowed_formats : ["jpg", "jpeg" , "webp", "png"]
}
})
const upload = multer({storage})
export default upload; 