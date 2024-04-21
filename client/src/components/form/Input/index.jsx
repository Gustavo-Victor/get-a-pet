/* eslint-disable react/prop-types */
import styles from './Input.module.css'; 

export default function Input({type, text, name, placeholder, handleOnChange, value, multiple }) {
    return (
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}: </label>
            <input 
                className={styles.input}
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                // required={true}
                multiple={multiple}
                onChange={handleOnChange}
            />
        </div>
    )
}