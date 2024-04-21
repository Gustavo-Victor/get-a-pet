// modules
import express from "express";
import cors from "cors"; 
import userRouter from "./routes/userRoutes.js";  
import petRouter from "./routes/petRoutes.js"; 
import url from "node:url";
import conn from "./db/conn.js";


// dist config
const __dirname = url.fileURLToPath(new URL(".", import.meta.url)); 
const baseDir = `${__dirname}/dist/`; 



// express config and other config 
const app = express();
const port = process.env.PORT || 4000; 
const frontEndHost = "http://localhost:5173";


// middlewares
app.use(cors({ credentials: true, origin: frontEndHost }));
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 
app.use(express.static("public")); 
app.use(express.static(`dist/assets`)); 


// routes
app.use("/users", userRouter); 
app.use("/pets", petRouter); 
// index
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: baseDir }); 
}); 


// listen port
app.listen(port, () => {
    console.log(`Backend is running...`); 
}); 