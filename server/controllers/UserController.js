import { User } from "../models/User.js"; 
import { createUserToken, getToken, getUserByToken, TOKEN_SECRET } from "../helpers/user-helpers.js"; 
import { Types } from "mongoose"; 
import jwt from "jsonwebtoken"; 
import bcrypt from "bcrypt"; 

const { ObjectId } = Types;


export class UserController {
    static async getAll(req, res) {
        res.json({ message: "Users' page" });
    }

    static async getUserById(req, res) {
        // get url query data
        const { id } = req.params; 

        // validations
        if(!id) {
            res.status(422).json({message: "Id is required."}); 
            return ;
        }

        // check if id is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: "Id is invalid."}); 
            return ;
        }

        // check if user exists
        const user = await User.findById(id).select("-password"); 
        if(!user) {
            res.status(404).json({message: "User not found."}); 
            return ;
        }
 
        // return user if exists
        res.status(200).json({ user }); 
    }

    static async create(req, res) {
        // get body data
        const { name, email, password, confirmPassword, phone } = req.body; 
        let photo = ""; 

        // validations
        if(!name) { 
            res.status(422).json({ message: "Name is required."}); 
            return ; 
        }

        if(!email) { 
            res.status(422).json({ message: "Email is required."}); 
            return ; 
        }

        if(!password) { 
            res.status(422).json({ message: "Password is required."}); 
            return ; 
        }

        if(!confirmPassword) { 
            res.status(422).json({ message: "Confirm password is required."}); 
            return ; 
        }

        if(!phone) { 
            res.status(422).json({ message: "Phone is required."}); 
            return ; 
        }

        if(password != confirmPassword) { 
            res.status(422).json({ message: "Passwords don't match."}); 
            return ; 
        }

        // check is user exists
        const userExists = await User.findOne({ email: email }); 

        if(userExists) {
            res.status(422).json({ message: "This email is already registered." }); 
            return ; 
        }

        // generate hasehd password
        const salt = await bcrypt.genSalt(12); 
        const hashedPassword = await bcrypt.hash(password, salt); 


        // generate user object
        const userData = { name, email, password: hashedPassword, phone, photo }
        const user = new User(userData); 
        
        // insert user
        try {
            const newUser = await user.save(); 
            await createUserToken(newUser, req, res); 
        } catch (e) {
            console.log(e); 
            res.status(500).json({message: "Failed to insert user. Try again later"});
            return ;
        }

    }

    static async login(req, res) {
        // get
        const { email, password } = req.body; 

        // validations
        if(!email) {
            res.status(422).json({ message: "Email is required."}); 
            return ; 
        }

        if(!password) {
            res.status(422).json({ message: "Password is required."}); 
            return ;
        } 

        // check if user exists 
        const userExists = await User.findOne({email: email}).lean(); 
        if(!userExists) {
            res.status(422).json({ message: "This user does not exist." });
            return ;
        }


        // chech if passwords match 
        const passwordsMath = await bcrypt.compare(password, userExists.password); 
        if(!passwordsMath) {
            res.status(422).json({ message: "Wrong password." });
            return ;
        }

        // generate token
        await createUserToken(userExists, req, res); 
    }
    
    static async checkUser(req, res) {
        let currentUser; 

        // check if authorization exists
        if(req.headers.authorization) {
            const token = getToken(req); 
            const decoded = jwt.verify(token, TOKEN_SECRET); 
            currentUser = await User.findById(decoded.id); 
            currentUser.password = undefined; 
        } else {
            currentUser = null; 
        }

        // return response
        res.status(200).send(currentUser); 

    }

    static async update(req, res) {
        // get query data 
        const { id } = req.params; 

        // get body data
        const { name, email, phone, password, confirmPassword } = req.body;
        let newPassword = ""; 


        // validations
        if(!id) { 
            res.status(422).json({ message: "Id is required."}); 
            return ; 
        }

        // check if id is valid
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: "Id is invalid."}); 
            return ;
        }

        if(!name) { 
            res.status(422).json({ message: "Name is required."}); 
            return ; 
        }

        if(!email) { 
            res.status(422).json({ message: "Email is required."}); 
            return ; 
        }

        if(!password) { 
            res.status(422).json({ message: "Password is required."}); 
            return ; 
        }

        if(!confirmPassword) { 
            res.status(422).json({ message: "Confirm password is required."}); 
            return ; 
        }

        if(!phone) { 
            res.status(422).json({ message: "Phone is required."}); 
            return ; 
        }

        if(password != confirmPassword) { 
            res.status(422).json({ message: "Passwords don't match."}); 
            return ; 
        } else if (password == confirmPassword && password != null && String(password).length != 0) {
            const salt = await bcrypt.genSalt(12); 
            newPassword = await bcrypt.hash(password, salt); 
        }

        // verify if user exists
        const token = getToken(req); 
        const user = await getUserByToken(token); 
        if(!user) {
            res.status(404).json({message: "This user does not exist."}); 
            return ;
        } 

        // check image file
        let photo = ""; 
        if(req.file) {
            photo = req.file.filename;  
        }

        // check if email is already registered
        const emailIsAlreadyRegistered = await User.findOne({email: email}).lean(); 
        if(email != user.email && emailIsAlreadyRegistered && email == emailIsAlreadyRegistered.email && emailIsAlreadyRegistered.email != user.email) {
            res.status(422).json({message: "This email is already registered."}); 
            return ;
        }

        // update
        try {
            const userData = { name, email, phone, password: newPassword, photo: String(photo) }; 
            console.log(photo); 
            // const result = await User.updateOne({_id: id}, userData);  
            const result = await User.updateOne({_id: id, }, userData); 
            res.status(200).json({message: "User successfully updated.", user: result}); 
        } catch(e) {    
            console.log(e);
            res.status(500).json({message: "Failed to update user."}); 
        }

    }
}

