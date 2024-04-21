/* eslint-disable react/prop-types */
// styles
import styles from "./Select.module.css"; 


export default function Select({name, text, options, handleOnChange, value}) {
    return (
        <div className={`${styles.form_control} ls-custom-select`}>
            <label htmlFor={name}>{text}: </label>
            <select id={name} name={name} onChange={handleOnChange} value={value}>
                <option defaultValue={"Select one"} value="Select one" key="select">Select one</option>
                {options.map((option) => (
                    <option value={option} key={option}>{option}</option>
                ))}
            </select>

        </div>
    )
}