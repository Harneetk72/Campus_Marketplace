import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Authrouter from "./Api/Routes/auth.route.js";
import collegeRouter from "./Api/Routes/college.route.js";
import cookieParser from "cookie-parser";
import ProductRouter from "./Api/Routes/product.route.js";
import chatRoutes from "./Api/Routes/chatRoutes.js";
import wishlistRoutes from "./Api/Routes/Wishlist.route.js";
import orderRoutes from "./Api/Routes/Order.route.js";

const app = express();
dotenv.config(); //ye process naam ka object dega jisme env ka data access krr skte hai
//middleware
var corsOptions = {
  origin: [
    "http://localhost:5173", // user frontend
    "http://localhost:5174", // admin frontend
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
//routes

app.use("/api/auth", Authrouter);
app.use("/api/college", collegeRouter);
app.use("/api/product", ProductRouter);
app.use("/api/chat", chatRoutes);

app.use("/api/admin", Authrouter);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/order", orderRoutes);
// http://localhost5000/api/auth/signup

export default app;
