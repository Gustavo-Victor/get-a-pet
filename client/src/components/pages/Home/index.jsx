// hooks
import { useState, useEffect } from "react";

// components
import { Link } from "react-router-dom";

// utils
import api from "../../../utils/api";

// environment variables
const { VITE_REACT_APP_API } = import.meta.env;

// styles
import styles from "./Home.module.css"; 



export default function Home() {
    // state
    const [pets, setPets] = useState(); 

    // event handlers

    // effects
    useEffect(() => {
        api.get("/pets")
            .then(response => {
                setPets(response.data.pets);
                console.log(response.data.pets); 
            })
            .catch(err => {
                console.log(err); 
            }); 
    }, []);

    return (
        <section>
            <div className={styles.pet_header}>
                <h1>Adopt a Pet</h1>
                <p>See the details of each pet and meet their owner.</p>
            </div>

            <div className={styles.pet_container}>
                {pets && 
                    (
                        pets.length > 0 ? 
                            pets.map((pet) => (                        
                                <div className={styles.pet_card} key={pet._id}>
                                    <div 
                                        className={styles.pet_card_image}
                                        style={{
                                            backgroundImage: `url(${VITE_REACT_APP_API}/images/pets/${pet.images[0]})`
                                        }}
                                        >
                                    </div>
                                    <h3>{pet.name}</h3>
                                    <p><span className="bold">Weight:</span> {pet.weight} kg</p>
                                    {pet.available ? <Link to={`/pet/${pet._id}`}>See more</Link> : <p className={styles.adopted_text} to="/">Adopted</p>}
                                </div>
                            ))
                        : 
                        <p>There are no pets registered in the system.</p>
                    )
                }
                {!pets && <p>Loading...</p>}
            </div>
        </section>
    )
} 