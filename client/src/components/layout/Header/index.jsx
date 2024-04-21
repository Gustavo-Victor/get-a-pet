// hooks
import { useContext, useState } from "react";

// modules
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { FaBars } from "react-icons/fa";

// context
import { UserContext } from "../../../context/UserContext";

// styles
import styles from "./Header.module.css"; 


export default function Header() {
    // hooks
    const { authenticated, logout } = useContext(UserContext);
    const [activeMenu, setActiveMenu] = useState(false); 

    // event handlers
    const toggleMenu = () => {
        setActiveMenu(!activeMenu); 
    }

    return (
        <header>
            <nav className={styles.navbar}>
                <Link to="/">
                    <div className={styles.navbar_logo}>
                            <img src={logo} alt="Get a Pet" title="Get a Pet" />
                            <h2>Get A Pet</h2>
                    </div>
                </Link>
                <ul className={ activeMenu ? styles.active : '' }>
                    <li>
                        <Link to={"/"}>Adopt</Link>
                    </li>
                    {authenticated ? (
                        <>
                            <li>
                                <Link to="pet/mypets">My Pets</Link>
                            </li>
                            <li>
                                <Link to="pet/myadoptions">My Adoptions</Link>
                            </li>
                            <li>
                                <Link to="user/profile">Profile</Link>
                            </li>
                            <li onClick={() => logout()}>
                                <Link>Logout</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to={"/register"}>Register</Link>
                            </li>
                            <li>
                                <Link to={"/login"}>Login</Link>
                            </li>
                        </>
                    )}
                </ul>
                <FaBars onClick={toggleMenu} className={styles.nav_icon} />
            </nav>
        </header>
    )
}