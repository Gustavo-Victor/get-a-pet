// hooks and components
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useFlashMessage from "../../../../hooks/useFlashMessage";

//utils
import api from "../../../../utils/api";

// environment variables
const { VITE_REACT_APP_API } = import.meta.env;

// styles
import styles from "./PetDetails.module.css"; 



export default function PetDetails() {
    // state
    const [pet, setPet] = useState(); 
    const [token] = useState(localStorage.getItem("token") || ""); 
    
    // hooks
    const { id } = useParams(); 
    const { setFlashMessage } = useFlashMessage();

    // event handlers
    const scheduleVisit = async () => {
        let msgType = "success"; 

        const data = await api.patch(`/pets/schedule/${id}`, {
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
        }); 

        setFlashMessage(data.message, msgType); 
    }
    
    // effects
    useEffect(() => {
        api.get(`/pets/${id}`)
        .then(response => {
            setPet(response.data.pet); 
            console.log(response.data.pet)
        })
        .catch(err => {
            console.log(err);
        })
    }, [token, id]);

    return (
        <>
            {pet && (
                <section className={styles.pet_details_container}>
                    <div className={styles.pet_details_header}>
                        <h1>Get to know {pet.name}</h1>
                        <p>If you are interested, schedule a visit to get to know this pet better.</p>
                    </div>
                    <div className={styles.pet_images}>
                        {pet.images.map((image, index) => (
                            <img 
                                key={`${pet.name + String(index)}`}
                                src={`${VITE_REACT_APP_API}/images/pets/${image}`}
                                alt={pet.name} />
                        ))}
                    </div>
                    <p><span className="bold">Weight: </span> {pet.weight} kg</p>
                    <p><span className="bold">Age: </span> {pet.age} years</p>
                    <p><span className="bold">Color: </span> {pet.color}</p>

                    {token 
                        ? <button onClick={scheduleVisit}>Schedule a Visit</button>
                        : <p>You need to be <Link to={"/login"}>logged in</Link> to be able to schedule a visit to this pet.</p>
                    }
                </section>
            )}

            {!pet && <p>Loading...</p>}
        </>
    )
}