import { createContext } from "react";

export const AuthContext = createContext({
    isLoading: true,
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    token: "",
    setToken: () => {},
    userId: "",
    setUserId: () => {},
    signin: () => {},
    logout: () => {},
});