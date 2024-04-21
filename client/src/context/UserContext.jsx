/* eslint-disable react/prop-types */
import { createContext } from "react";
import useAuth from "../hooks/useAuth";

const UserContext = createContext();


function UserProvider({children}) {
    const { authenticated, register, logout, login } = useAuth();
    
    const contextTemplate = {
        authenticated,
        register, 
        logout, 
        login
    }

    return (
        <UserContext.Provider value={{...contextTemplate}}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }; 