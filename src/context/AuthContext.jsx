import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";
import storage from "../utils/storage";
import authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = storage.getToken();
            const storedUser = storage.getUser();
            if (token && storedUser) {
                setUser(storedUser);
                try {
                    const response = await authService.profile();
                    const updatedUser = response.data?.user || response.data;
                    if (updatedUser) {
                        setUser(updatedUser);
                        storage.saveUser(updatedUser);
                    }
                } catch (err) {
                    console.error("Token verification failed:", err);
                    storage.clearAuth();
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (userData, token) => {
        storage.saveToken(token);
        storage.saveUser(userData);
        setUser(userData);
    };

    const logout = () => {
        storage.clearAuth();
        setUser(null);
    };

    const isAuthenticated = !!user;

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ⭐ This is what you're probably missing
export const useAuth = () => useContext(AuthContext);

export default AuthContext;