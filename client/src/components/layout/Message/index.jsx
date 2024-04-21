//hooks
import { useState, useEffect } from "react";
import bus from "../../../utils/bus"; 

// styles
import styles from "./Message.module.css"; 


export default function Message() {
    // state
    const [visibiilty, setVisibility] = useState(false); 
    const [type, setType] = useState(""); 
    const [message, setMessage] = useState(""); 

    //effects
    useEffect(() => {
        bus.addListener("flash", ({message, type}) => {
            setVisibility(true); 
            setMessage(message); 
            setType(type); 

            setTimeout(() => {
                setVisibility(false); 
            }, 3000); 
        }); 
    }, []); 

    // ui / render
    return (
        visibiilty && (
            <div className={`${styles.message} ${styles[type]}`}>
                {message}
            </div>
        )
    )
}