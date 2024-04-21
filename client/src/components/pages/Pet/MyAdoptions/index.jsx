// hooks
import { useState, useEffect } from "react";

// utils
import api from "../../../../utils/api"; 

// components
import RoundedImage from "../../../layout/RoundedImage";

// environment variables
const { VITE_REACT_APP_API } = import.meta.env;

// styles
import styles from "../Dashboard.module.css"; 


export default function MyAdoptions() {
    // state
    const [pets, setPets] = useState();
    const [token] = useState(localStorage.getItem("token") || ""); 
    

    // effects
    useEffect(() => {
        api.get(`/pets/myadoptions`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then(response => {
            setPets(response.data.pets); 
        })
    }, [token]);


    return (
        <>
            {!pets && <p>Loading...</p>}
            {pets && 
                <section>
                    <div className={styles.petlist_header}>
                        <h1>My Adoptions</h1>
                    </div>
                    <div className={styles.petlist_container}>
                        {pets.length > 0 
                            ? pets.map((pet) => (
                                <div key={pet._id} className={styles.petlist_row}>
                                    <div className={styles.align}>
                                        <RoundedImage
                                            alt={pet.name}
                                            src={`${VITE_REACT_APP_API}/images/pets/${pet.images[0]}`}
                                            width="px75"
                                        />
                                        <h3 className="bold">{pet.name}</h3>
                                    </div>
                                    <div className={styles.petlist_user_info}>
                                        <p><span className="bold">Call to: </span>{pet.user.phone}</p>
                                        <p><span className="bold">Talk to: </span>{pet.user.name}</p>
                                    </div>
                                    <div className={styles.actions}>
                                        {pet.available 
                                            ? <p className={styles.process}>Adoption in process</p>
                                            : <p className={styles.success}>Adoption completed</p>
                                        }
                                    </div>
                                </div>
                            ))
                            : <p>You have not adopted any pets yet...</p>
                        }
                    </div>
                </section>
            }
        </>
    )
}