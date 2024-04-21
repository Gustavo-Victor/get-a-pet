// hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFlashMessage from "../../../../hooks/useFlashMessage";

// utils
import api from "../../../../utils/api";

// components
import PetForm from "../../../form/PetForm";

// styles
import styles from "./AddPet.module.css";



export default function AddPet() {
    // state
    const [token] = useState(localStorage.getItem("token") || ""); 
    
    // hooks
    const navigate = useNavigate();
    const { setFlashMessage } = useFlashMessage();

    // event handlers
    const registerPet = async (pet) => {
        let msgType = "success"; 

        const formData = new FormData(); 
        Object.keys(pet).forEach(key => {
            if(key == "images") {
                for(let i=0; i<pet[key].length ; i++) {
                    formData.append("images", pet[key][i]); 
                }
            } else {
                formData.append(key, pet[key]); 
            }

        }); 

        const data = await api.post(`/pets/create`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                "Content-Type": "multipart/form-data"
            }
        }).then(response => {
            return response.data; 
        }).catch(err => {
            msgType = "error";
            return err.response.data; 
        }); 

        setFlashMessage(data.message, msgType); 
        if(msgType !== "error") {
            navigate("/pet/mypets"); 
        }
    }
    
    return (
        <section >
            <div className={styles.addpet_header}>
                <h1>Register a Pet</h1>
                <p>After registration, the animal will be available for adoption</p>
            </div>
            <PetForm btnText="Register" handleSubmit={registerPet} />
        </section>
    )
}