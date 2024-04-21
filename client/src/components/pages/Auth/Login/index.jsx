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


export default function Login() {
    // context
    const { login } = useContext(UserContext); 

    // state
    const initialState = {
        email: "",
        password: ""
    }
    const [user, setUser] = useState(initialState);

    // vent handlers
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log(user);
        await login(user); 
    }

    const handleChange = (e) => {
        const inputName = e.target.name; 
        const inputValue = e.target.value; 

        setUser(prevState => {
            return {...prevState, [inputName]: inputValue}; 
        })
    }

    // ui / render 
    return (
        <section className={styles.form_container}>
            <h1>Login</h1>
            <form action="#" onSubmit={handleSubmit}>
                <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    text="Email"
                    value={user.email || ""}
                    handleOnChange={handleChange}
                />

                <Input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    text="Password"
                    value={user.password || ""} 
                    handleOnChange={handleChange}                   
                />

                <button type="submit" id="login-btn">Enter</button>
            </form>
            <p>Don{"'"}t have an account? <Link to="/register">Click here</Link></p>
        </section>
    )
} 