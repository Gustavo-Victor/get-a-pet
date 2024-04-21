// modules
import { Router } from "express";
import { PetController } from "../controllers/PetController.js";
import { checkToken } from "../helpers/user-helpers.js"; 
import { imageUpload } from "../helpers/image-upload.js";


// object Router
const router = Router(); 


// routes
router.get("/", PetController.getAll);
router.get("/mypets", checkToken, PetController.getUserPets); 
router.patch("/schedule/:id", checkToken, PetController.schedule);
router.get("/myadoptions", checkToken, PetController.getUserAdoptions);
router.post("/create", checkToken, imageUpload.array("images"), PetController.create); 
router.get("/:id", PetController.getPetById); 
router.patch("/:id", checkToken, imageUpload.array("images"), PetController.update); 
router.delete("/:id", checkToken, PetController.delete);
router.patch("/conclude/:id", checkToken, PetController.conclude); 


// export router
export default router; 