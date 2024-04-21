// hooks
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import useFlashMessage from "./useFlashMessage"; 

// utils
import api from "../utils/api"; 


export default function useAuth() {
    // state 
    const [authenticated, setAuthenticated] = useState(false); 

    // hooks
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate(); 

    // effects 
    useEffect(() => {
        const token = localStorage.getItem("token"); 

        if(token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`; 
            setAuthenticated(true); 
        }
    }, []);

    // operations
    async function register(user) {
        let msgText = "User successfully registered"; 
        let msgType = "success"; 

        try {
            const data = await api.post("/users/register", user)
                .then(response => {
                    return response.data;
                }); 
            console.log(data); 
            await authUser(data); 
        } catch(e) {
            msgText = String(e.response.data.message); 
            msgType = "error"; 
            console.log(e); 
        }

        setFlashMessage(msgText, msgType);
    }

    async function authUser(data) {
        setAuthenticated(true); 
        localStorage.setItem("token", JSON.stringify(data.token)); 
        navigate("/")
    }

    async function login(user) {
        let msgText = "User successfully logged in"; 
        let msgType = "success"; 

        try {
            const data = await api.post("/users/login", user)
                .then(response => {
                    return response.data;
                }); 
            console.log(data); 
            await authUser(data); 
        } catch(e) {
            console.log(e); 
            msgText = e.response.data.message; 
            msgType = "error"; 
            setAuthenticated(false);     
        }
        setFlashMessage(msgText, msgType);
    }

    function logout() {
        const msgText = "User successfully logged out"; 
        const msgType = "success"; 

        localStorage.removeItem("token"); 
        setAuthenticated(false); 
        api.defaults.headers.Authorization = undefined;
        navigate("/"); 
        setFlashMessage(msgText, msgType); 
    }

    return { authenticated, register, logout, login };
}