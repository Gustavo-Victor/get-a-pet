// hooks
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFlashMessage from "../../../../hooks/useFlashMessage";

// components
import PetForm from "../../../form/PetForm"; 

// utils 
import api from "../../../../utils/api"; 

// styles
import styles from "../AddPet/AddPet.module.css"; 



export default function EditPet() {
    // state
    const [pet, setPet] = useState({}); 
    const [token] = useState(localStorage.getItem("token") || ""); 
    const { id } = useParams();

    // hooks
    const navigate = useNavigate();
    const { setFlashMessage } = useFlashMessage();

    // event handlers
    const editPet = async (pet) => {
        let msgType = "success"; 

        const formData = new FormData(); 
        Object.keys(pet).forEach(key => {
            if(key != 'images') {
                formData.append(key, pet[key])
            } else {
                for(let i = 0; i<pet[key].length; i++) {
                    formData.append("images", pet[key][i])
                }
            }
        })

        const data = await api.patch(`/pets/${pet._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                "Content-Type": "multipart/form-data"
            }
        })
        .then(response => response.data)
        .catch(err => {
            msgType = "error";
            return err.response.data; 
        }); 
        setFlashMessage(data.message, msgType); 
        if(msgType != "error") {
            navigate("/pet/mypets");
        }
    }

    // effects
    useEffect(() => {
        api.
            get(`/pets/${id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            })
            .then(response => {
                setPet(response.data.pet);  
            })
    }, [token, id]); 

    return (
        <section>
            <div className={styles.addpet_header}>
                <h1>Edit Pet: {pet.name}</h1>
                <p>After editing, the pet{"'"}s data will be updated.</p>
            </div>

            {pet.name && <PetForm btnText="Edit" handleSubmit={editPet} petData={pet} />}
        </section>
    )
}