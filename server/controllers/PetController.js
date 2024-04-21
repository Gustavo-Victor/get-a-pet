// modules
import { Pet } from "../models/Pet.js";
import { getToken, getUserByToken } from "../helpers/user-helpers.js";
import { Types } from "mongoose";


const { ObjectId } = Types;


// class
export class PetController {
    static async getAll(req, res) {
        // get all pets sorted by creation date
        const pets = await Pet.find().sort("-createdAt")

        // check if array is empty
        if(pets.length == 0) {
            res.json({message: "There are no pets registered.", pets: []}); 
            return ;
        }

        // return response
        res.status(200).json({ pets }); 
    }

    static async getUserPets(req, res) {
        // get user by token
        const token = getToken(req); 
        const user = await getUserByToken(token); 

        // get user's pets 
        const pets = await Pet.find({'user._id': user._id}).sort("-createdAt"); 

        // return response
        res.status(200).json({pets});
    }

    static async getPetById(req, res) {
        // get query dat
        const { id } = req.params; 

        // check if id is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: "ID is invalid."});
            return;  
        }

        // get pet
        const pet = await Pet.findById(id); 

        if(!pet) {
            res.status(404).json({message: "Pet not found."});
            return; 
        }

        // return response
        res.status(200).json({pet}); 
    }

    static async getUserAdoptions(req, res) {
        // get user by token
        const token = getToken(req); 
        const user = await getUserByToken(token); 
       
        // get all user's adoptions
        const pets = await Pet.find({'adopter._id': user._id}).sort("-createdAt");       

        // return response
        res.status(200).json({pets});
    }

    static async create(req, res) {
        // get body data
        const { name, age, weight, color } = req.body; 
        const available = true; 

        // image uploads
        const images = req.files;  

        // validations
        if(!name) {
            res.status(422).json({message: "Name is required."}); 
            return ;
        }

        if(!age) {
            res.status(422).json({message: "Age is required."}); 
            return ;
        }

        if(!weight) {
            res.status(422).json({message: "Weight is required."}); 
            return ;
        }

        if(!color) {
            res.status(422).json({message: "Color is required."}); 
            return ;
        }

        if(!images || images.length == 0) {
            res.status(422).json({message: "Pet image is required."}); 
            return ;
        }
        
        // get pet owner
        const token = getToken(req); 
        const user = await getUserByToken(token); 
        const formattedUser = { _id: user._id, name: user.name, email: user.email, phone: user.phone, photo: user.photo }; 

        // define pet object
        const pet = new Pet({ name, age, weight, color, available, images: [], user: formattedUser }); 

        // get image names
        images.forEach(image => {
            pet.images.push(image.filename); 
        }); 

        // insert pet
        try {
            const newPet = await pet.save(); 
            res.status(201).json({message: "Pet successfully created.", newPet}); 
        } catch(e) {
            console.log(e); 
            res.status(500).json({message: "Failed to insert pet."});
        }
    }

    static async update(req, res) {
        // get data
        const { id } = req.params; 

        // check if pet exists
        if(!id) {
            res.status(422).json({message: "Id is required."});
            return ;
        }

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: "Id is invalid."});
            return ;
        }
        
        const pet = await Pet.findById(id); 
        if(!pet) {
            res.status(404).json({message: "Pet not found."});
            return ;
        }

        const { name, age, weight, color, available } = req.body; 

        // image uploads
        const images = req.files;

        // validations
        if(!name) {
            res.status(422).json({message: "Name is required."});
            return ;
        } else {
            pet.name = name; 
        }

        if(!age) {
            res.status(422).json({message: "Age is required."});
            return ;
        } else {
            pet.age = age;
        }

        if(!weight) {
            res.status(422).json({message: "Weight is required."});
            return ;
        } else {
            pet.weight = weight; 
        }

        if(!color) {
            res.status(422).json({message: "Color is required."});
            return ;
        } else {
            pet.color = color; 
        }

        // override pet images
        if(images.length > 0) {                        
            pet.images = images.map(image => {
                return image.filename; 
            }); 
        }

        
        // check if pet belongs to current user
        const token = getToken(req);
        const user = await getUserByToken(token); 
        if(pet.user._id.toString() != user._id.toString()) {
            res.status(422).json({message: "There was a problem processing the request. Try again later."});
            return ;
        }

        // update
        try {
            const updatedPet = await Pet.findByIdAndUpdate(id, pet);
            res.status(200).json({message: "Pet successfully updated.", pet}); 
            //res.status(200).json({message: "ok", pet: petData})
        } catch(e) {
            console.log(e);
            res.status(500).json({message: "Failed to update pet."});
        }

    }

    static async delete(req, res) {
        // get query data
        const { id } = req.params;

        // check if is exists
        if(!id) {
            res.status(422).json({message: "Id is required."});
            return; 
        }

        // check if id is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: "Id is invalid."});
            return; 
        }
        
        // check if pet exists
        const pet = await Pet.findById(id);
        if(!pet) {
            res.status(404).json({message: "Pet not found."});
            return ; 
        }

        // check if pet belongs to current user
        const token = getToken(req);
        const user = await getUserByToken(token); 
       
        if(pet.user._id.toString() != user._id.toString()) {
            res.status(422).json({message: "There was a problem processing the request. Try again later."});
            return ;
        }


        // delete pet
        try {
            const deletedPet = await Pet.findByIdAndDelete(id); 
            res.status(200).json({message: "Pet successfully deleted."});
        } catch(e) {
            console.log(e);
            res.status(500).json({message: "Failed to delete pet."});
        }
    }

    static async schedule(req, res) {
        // get data
        const { id } = req.params;

        // validations
        if(!id) {
            res.status(422).json({message: "Id is required."});
            return ;
        }

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: "Id is invalid."});
            return ;
        }

        // check if pet exists
        const pet = await Pet.findById(id); 
        if(!pet) {
            res.status(404).json({message: "Pet not found."});
            return ;
        }

        // check if pet belongs to current user
        const token = getToken(req);
        const user = await getUserByToken(token); 
        if(pet.user._id.equals(user._id)) {
            res.status(422).json({message: "The user cannot schedule appointments with their own pet."}); 
            return ; 
        } 

        // check if user has already adopted the pet
        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)) {
                res.status(422).json({message: "The user has already scheduled a visit."}); 
                return ; 
            }
        }

        // add user to pet 
        pet.adopter = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            photo: user.photo
        }

        // schedule
        try {
            const result = await Pet.findByIdAndUpdate(id, pet); 
            res.status(200).json({message: `Appointment scheduled successfully. Contact the user '${pet.user.name}' by phone: ${pet.user.phone}`}); 
        } catch(e) {
            console.log(e);
            res.status(500).json({message: "Failed to schedule pet."});
        }
    }

    static async conclude(req, res) {
        // get data
        const { id } = req.params;

        // validations
        // check if id is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: "Id is invalid."});
            return ;
        }

        // check if pet exists
        const pet = await Pet.findById(id); 
        if(!pet) {
            res.status(404).json({message: "Pet not found."});
            return ;
        }

        // check if current user has scheduled a visit
        const token = getToken(req);
        const user = await getUserByToken(token); 
        if(!pet.user._id.equals(user._id)) {
            res.status(422).json({message: "Only the pet owner can conclude adoptions."});
            return ;
        }

        // check if pet has already been adopted
        if(!pet.available || pet.available == false) {
            res.status(422).json({message: "The pet has already been adopted."});
            return ;
        }
        
        // conclude adoption
        try {
            pet.available = false;
            await Pet.findByIdAndUpdate(id, pet); 
            res.status(200).json({message: "Pet adoption completed successfully."}); 
        } catch(e) {
            console.log(e);
            res.status(500).json({message: "Failure to complete pet adoption."}); 
        }
        
    }
}  