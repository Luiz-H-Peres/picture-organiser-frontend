import { useState, useCallback, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchByApiToken } from "../services/api";
import { jwtDecode } from "jwt-decode";

export function AuthProvider({ children, isPublicPage }) {

    const [isLoading, setIsLoading] = useState(true);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [userId, setUserId] = useState("");
    const [token, setToken] = useState("");

    const navigate = useNavigate();
    
    const signin = useCallback(async (email, password) => {

      setIsLoading(true);
      const result = await fetchByApiToken(email, password);

      if (result.token) {

        localStorage.setItem("token", result.token);

        setIsAuthenticated(true);
        setToken(result.token);
        setUserId(result.userId);

        navigate('/albums');
      }

      setIsLoading(false);
    }, [navigate]);

    const logout = useCallback(() => {
        localStorage.removeItem("token");

        // Redirect to login page
        if(!isPublicPage) {
            navigate('/login');
        }
    }, [isPublicPage, navigate]);

    const checkToken = useCallback(() => {
        try {
            const token = localStorage.getItem("token") ?? '';
            
            const decodedToken = jwtDecode(token);

            const expiresAt = new Date(decodedToken.exp * 1000);

            if (new Date() > expiresAt) {
                // Token is expired, log out the user
                logout();
                return;
            }

            setIsAuthenticated(true);
            setToken(token);
            setUserId(decodedToken.userId);
            return decodedToken;

        } catch (error) {
            console.error("Error checking token:", error);
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    // Initial load
    useEffect(() => {
        checkToken();
    }, [checkToken]);

    // Validate auth on every page load
    useEffect(() => {
       
        if (isLoading || isPublicPage) {
            return;
        }

        if (!isAuthenticated || !checkToken()) {
            logout();
            return;
        }

        //Should set an interval to check if the token is expired
        const interval = setInterval(() => {
            const decodedToken = checkToken();
            if (!decodedToken) {
                logout();
            }
        }, 60000);

        return () => clearInterval(interval);

    }, [isLoading, isAuthenticated, logout, isPublicPage, checkToken]);
    
    return (
        <AuthContext.Provider value={{ isLoading, isAuthenticated, setIsAuthenticated, token, setToken, userId, setUserId, signin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}