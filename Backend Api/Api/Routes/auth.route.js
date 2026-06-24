  import express from "express"
  import { signin, signup, getUser, getAllusers ,isVerifiedUser, signout,getProfile,createAdmin, deleteUser,getPendingUsers,getDashboardStats } from "../Controllers/auth.controller.js"
  import { isAdmin, protect } from "../Middleware/auth.middleware.js"


  const router = express.Router()


  router.post("/signup",signup)
  router.post("/signin",signin)
  router.get("/get-user",protect,getUser)
  router.get("/get-profile/:id",protect,getProfile)
  router.post("/signout",signout )
  // https:localhost:5000/Auth/signin
  //https:localhost:5000/Api/Auth/signup
  // admin 

router.post(
 "/create-admin",
 createAdmin
);
 router.get(
  "/all-users",
  protect,
  isAdmin,
  getAllusers
);
  router.delete(
    "/delete-user/:id",
    protect,
    isAdmin,
    deleteUser
  )
  router.get(
    "/pending-users",
    protect,
    isAdmin,
    getPendingUsers
  )
  router.get(
    "/dashboard-stats",
    protect,  
    isAdmin,
    getDashboardStats
  );
  router.post("/is-verified/:id",protect ,isAdmin,isVerifiedUser)
  export default router  