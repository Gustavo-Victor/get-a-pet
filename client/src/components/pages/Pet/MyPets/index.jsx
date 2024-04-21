// hooks
import { useState, useEffect } from "react";
import useFlashMessage from "../../../../hooks/useFlashMessage";

// utils
import api from "../../../../utils/api";

// components
import RoundedImage from "../../../layout/RoundedImage"; 

// environment variables
const { VITE_REACT_APP_API } = import.meta.env;

// modules
import { Link, useNavigate } from "react-router-dom"; 

// styles
import styles from "../Dashboard.module.css"; 



export default function MyPets() {
    // state
    const [pets, setPets] = useState([]); 
    const [token] = useState(localStorage.getItem("token") || ""); 

    // hooks 
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate(); 

    // event handlers
    const removePet = async (id) => {
        let msgType = "success"; 

        const data = await api.delete(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            const updatedPets = pets.filter(pet => pet._id != id); 
            setPets(updatedPets); 
            return response.data; 
        })
        .catch(err => {
            msgType = "error"
            return err.response.data; 
        }); 
        setFlashMessage(data.message, msgType); 
    }

    const concludeAdoption = async (id) => {
        let msgType = "success"; 

        const data = await api.patch(`/pets/conclude/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then(response => {
            return response.data; 
        })
        .catch(err => {
            msgType = "error"; 
            return err.response.data; 
        })

        setFlashMessage(data.message, msgType);
        navigate("/pet/mypets");  
    }

    // effects
    useEffect(() => {
        api.get("/pets/mypets", {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then(response => {
            setPets(response.data.pets); 
            console.log(response.data.pets); 

        })
    }, [token]);


    return (
        <section>
            <div className={styles.petlist_header}>
                <h1>My Pets</h1>
                <Link to="/pet/add">+ Add Pet</Link>
            </div>
            <div className={styles.petlist_container}>
                {pets.length > 0 ? (
                    pets.map(pet => (
                        <div className={styles.petlist_row} key={pet._id}>
                            <div className={styles.align}>
                                <RoundedImage 
                                    alt={pet.name}
                                    src={`${VITE_REACT_APP_API}/images/pets/${pet.images[0]}`} 
                                    width="px75"
                                />
                                <span className="bold">{pet.name}</span>
                            </div>
                            <div className={styles.actions}>
                                {pet.available ? (
                                    <>
                                        {pet.adopter && 
                                            <button onClick={() => concludeAdoption(pet._id)} className={styles.conclude_btn}>Conclude Adoption</button>
                                        }
                                        <Link to={`/pet/edit/${pet._id}`}>Edit</Link>
                                        <button onClick={() => removePet(pet._id)}>Delete</button>
                                    </>
                                )  
                                :
                                 <p className={styles.not_available}>Not available</p>}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have not registered any pets yet...</p>
                )}
            </div>
        </section>
    )
}