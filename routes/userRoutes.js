// modules
import { Router } from "express";
import { UserController } from "../controllers/userController.js"; 
import { checkToken } from "../helpers/user-helpers.js"; 
import { imageUpload } from "../helpers/image-upload.js"; 


// router object
const router = Router();


// routes
router.get("/", UserController.getAll); 
router.get("/checkuser", UserController.checkUser); 
router.post("/register", UserController.create); 
router.post("/login", UserController.login); 
router.get("/:id", UserController.getUserById); 
router.patch("/:id", checkToken, imageUpload.single("photo"), UserController.update); 


// export router
export default router; 