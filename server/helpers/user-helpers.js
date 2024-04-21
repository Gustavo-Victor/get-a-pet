// modules
import jwt from "jsonwebtoken"; 
import { User } from "../models/User.js"; 
import { config } from "dotenv"; 
config(); 

// get environment variable
export const { TOKEN_SECRET } = process.env;


// generate token
export const createUserToken = async(user, req, res) => {
    const token = jwt.sign({
        name: user.name, 
        id: user._id
    }, TOKEN_SECRET); 

    // return token
    res.json({
        message: "You are authenticated.",
        token: token, 
        userId: user._id
    }); 
}

// get token
export const getToken = (req) => {
    return req.headers.authorization.split(" ")[1]; 
}

// middleware to validate token
export const checkToken = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(401).json({message: "Accesss denied."}); 
    }

    const token = getToken(req); 
    if(!token) {
        return res.status(401).json({message: "Accesss denied."}); 
    }

    try {
        const verified = jwt.verify(token, TOKEN_SECRET); 
        req.user = verified; 
        next(); 
    } catch (e) {
        console.log(e); 
        return res.status(401).json({message: "Invalid token."}); 
    } 
}

// get user by jwt token 
export const getUserByToken = async(token) => {
    if(!token) {
        return rs.status(401).json({message: "Access denied."}); 
    }

    const decoded = jwt.verify(token, TOKEN_SECRET);
    const userId = decoded.id; 
    const user = await User.findOne({_id: userId}); 
    return user;
}