// hooks
import { useState, useEffect } from "react";
import useFlashMessage from "../../../../hooks/useFlashMessage";

// utils
import api from "../../../../utils/api"; 

// components
import Input from "../../../form/Input";
import RoundedImage from "../../../layout/RoundedImage";

// environment variables
const { VITE_REACT_APP_API } = import.meta.env; 

// styles
import formStyles from "../../../form/Form.module.css";
import styles from "./Profile.module.css";




export default function Profile() {
    // state
    const [user, setUser] = useState({}); 
    const [token] = useState(localStorage.getItem("token")); 
    const [preview, setPreview] = useState(""); 

    // hooks
    const { setFlashMessage } = useFlashMessage(); 

    // event handlers
    const onFileChange = (e) => {
        setPreview(e.target.files[0]); 
        setUser(prevState => {
            return {...prevState, [e.target.name]: e.target.files[0]};
        }); 
    }

    const handleChange = (e) => {
        setUser(prevState => {
            return {...prevState, [e.target.name]: e.target.value};
        }); 
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log(user); 
        
        let msgType = "success";
        const formData = new FormData(); 
        const userFormData = Object.keys(user).forEach(key => {
            formData.append(key, user[key]); 
        }); 
        console.log(userFormData); 
        const data = await api.patch(`/users/${user._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                "Content-Type": "multipart/form-data"
            }
        }).then(response => {
            console.log(response.data); 
            return response.data;
        }).catch(err => {
            msgType = "error";
            return err.response.data; 
        }); 
        setFlashMessage(data.message, msgType); 

    }

    // effects 
    useEffect(() => {
        api
            .get("/users/checkuser", {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            })
            .then(response => {
                setUser(response.data); 
            })
    }, [token]);

    // render
    return (
        <section  onSubmit={handleSubmit}>
            <div className={styles.profile_header}>
                <h1>Profile</h1>
                {(user.photo || preview) && (
                    <RoundedImage 
                        src={preview ? URL.createObjectURL(preview) : `${VITE_REACT_APP_API}/images/users/${user.photo}`} 
                        alt={user.name}
                    />
                )}
            </div>
            <form className={formStyles.form_container} action="#" id="edit-user-form">
                <Input
                    text="Image"
                    type="file"
                    name="photo"
                    handleOnChange={onFileChange}
                />
                <Input
                    text="Email"
                    type="email"
                    name="email"
                    placeholder="Enter your email..."
                    handleOnChange={handleChange}
                    value={user.email || ""}
                />
                <Input
                    text="Name"
                    type="text"
                    name="name"
                    placeholder="Enter your name..."
                    handleOnChange={handleChange}
                    value={user.name || ""}
                />
                <Input
                    text="Phone"
                    type="text"
                    name="phone"
                    placeholder="Enter your phone number..."
                    handleOnChange={handleChange}
                    value={user.phone || ""}
                />
                <Input
                    text="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password..."
                    handleOnChange={handleChange}
                />
                <Input
                    text="Password confirmation"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password..."
                    handleOnChange={handleChange}
                />
                <button type="submit" id="edit-user-btn">Edit</button>
            </form>
        </section>
    )
}