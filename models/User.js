import { model, Schema } from "mongoose";


const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        photo: {
            type: String,
            required: false
        },
        phone: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);


export const User = model("User", UserSchema); 