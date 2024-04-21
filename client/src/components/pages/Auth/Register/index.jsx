/* eslint-disable no-unused-vars */
// hooks 
import { useState, useContext } from "react";

// context
import { UserContext } from "../../../../context/UserContext";

// modules
import { Link } from "react-router-dom"; 

// components
import Input from "../../../form/Input";

// styles
import styles from "../../../form/Form.module.css"; 


export default function Register() {
    // context
    const { register } = useContext(UserContext);  

    // state
    const initialState = {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    }
    const [user, setUser] = useState(initialState); 

    // event handlers
    const handleChange = (e) => {
        const inputName = e.target.name; 
        const inputValue = e.target.value; 
        
        setUser(prevState => {
            return { 
                ...prevState, 
                [inputName]: inputValue
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();         
        console.log(user); 
        await register(user); 
    }


    return (
        <section className={styles.form_container}>
            <h1>Register</h1>
            <form action="#" onSubmit={handleSubmit}>
                <Input
                    text="Name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name..."
                    value={user.name || ""}
                    handleOnChange={handleChange}
                />

                <Input
                    text="Email"
                    type="email"
                    name="email"
                    placeholder="Enter your email..."
                    value={user.email || ""}
                    handleOnChange={handleChange}
                />

                <Input
                    text="Phone"
                    type="text"
                    name="phone"
                    placeholder="Enter your phone..."
                    value={user.phone || ""}
                    handleOnChange={handleChange}
                />

                <Input
                    text="Password"
                    type="password"
                    name="password"
                    placeholder="Enter the password..."
                    value={user.password || ""}
                    handleOnChange={handleChange}
                />

                <Input
                    text="Password confirmation"
                    type="password"
                    name="confirmPassword"
                    placeholder="Enter the password again..."
                    value={user.confirmPassword || ""}
                    handleOnChange={handleChange}
                />
                <button type="submit">Register</button>    
            </form>
            <p>Already have an account? <Link to="/login">Click here</Link></p>
        </section>
    )
} 