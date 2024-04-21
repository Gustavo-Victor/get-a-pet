import { model, Schema } from "mongoose";


const PetSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        images: {
            type: Array,
            required: true
        },
        available: {
            type: Boolean,
            required: true
        },
        user: Object,
        adopter: Object
    },
    {
        timestamps: true
    }
);


export const Pet = model("Pet", PetSchema); 