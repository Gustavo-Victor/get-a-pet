/* eslint-disable react/prop-types */
// hooks
import { useState } from "react";

// components
import Input from "../Input";
import Select from "../Select";

// environment variables
const { VITE_REACT_APP_API } = import.meta.env; 

// styles
import formStyles from "../Form.module.css";



export default function PetForm({ handleSubmit, petData, btnText }) {
    // state
    const [pet, setPet] = useState(petData || {});
    const [preview, setPreview] = useState([]);

    // constants / variables 
    const colors = ["White", "Black", "Gray", "Caramel", "Merged"];

    // event handlers
    const onFileChange = (e) => {
        setPreview(Array.from(e.target.files));
        setPet(prevState => {
            return { ...prevState, images: [...e.target.files] };
        });
    }

    const handleChange = (e) => {
        setPet(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    }

    const handleColor = (e) => {
        setPet(prevState => {
            return { ...prevState, color: e.target.options[e.target.selectedIndex].text };
        });
    }

    const submit = (e) => {
        e.preventDefault();
        console.log(pet);
        handleSubmit(pet); 
    }

    return (
        <form className={formStyles.form_container} onSubmit={submit} action="#" id="register-pet-form">
            <div className={formStyles.preview_pet_images}>
                {preview.length > 0 
                    ? preview.map((image, index) => (
                        <img 
                            src={URL.createObjectURL(image)}
                            alt={pet.name}
                            key={`${pet.name + String(index)}`}
                        />
                    ))
                    : pet.images && pet.images.map((image, index) => (
                        <img 
                            src={`${VITE_REACT_APP_API }/images/pets/${image}`}
                            alt={pet.name}
                            key={`${pet.name + String(index)}`}
                        />
                    ))}
            </div>

            <Input
                type="file"
                text="Pet images"
                name="images"
                handleOnChange={onFileChange}
                multiple={true}
            />

            <Input
                name="name"
                placeholder="Enter the pet's name..."
                text="Name"
                type="text"
                handleOnChange={handleChange}
                value={pet.name || ""}
            />
            <Input
                name="age"
                placeholder="Enter the pet's age..."
                text="Age"
                type="number"
                handleOnChange={handleChange}
                value={pet.age || ""}
            />
            <Input
                name="weight"
                placeholder="Enter the pet's weight..."
                text="Weight"
                type="text"
                handleOnChange={handleChange}
                value={pet.weight || ""}
            />

            <Select
                name="color"
                text="Color"
                options={colors}
                handleOnChange={handleColor}
                value={pet.color || ""}
            />
            <button type="submit">{btnText}</button>
        </form>
    )
}