import mongoose from "mongoose"; 
import { config } from "dotenv"; 
config(); 

const { DB_URI } = process.env; 

async function main() {
    try {
        await mongoose.connect(`${DB_URI}`); 
        console.log("Successfully connected."); 
    } catch (error) {
        console.log("Connection failure."); 
        console.log(error); 
    }
}


main(); 
export default mongoose; 


