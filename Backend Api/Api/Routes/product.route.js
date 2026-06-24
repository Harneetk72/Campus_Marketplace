import express from "express";
import upload from "../middleware/Multer.js";
import { AllProducts, CreateProducts, MyProducts ,SingleProduct,DeleteProduct } from "../Controllers/Products.controller.js";
import { isUser,protect } from "../middleware/Auth.middleware.js";


const router = express.Router();
router.post("/create" , protect, isUser, upload.array("images", 5) ,CreateProducts) 
router.get("/" ,AllProducts)
router.get("/my-listing" ,protect, isUser, MyProducts )
router.get(
  "/:id",
  SingleProduct
);
router.delete("/delete/:id", protect, isUser, DeleteProduct);

export default router
    