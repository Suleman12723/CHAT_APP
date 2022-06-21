import { createContext, useReducer, useState } from "react";
import AuthReducer from "./AuthReducer";


const INITIAL_STATE = {
    user:null,
    // token:null,
    isFetching:false,
    error:false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) =>{
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    

    return (
        <AuthContext.Provider
        value={{
            user:state.user,
            // token:state.token,
            isFetching: state.isFetching,
            error: state.error,
            dispatch,
        }}>
            {children}
        </AuthContext.Provider>
    )
}