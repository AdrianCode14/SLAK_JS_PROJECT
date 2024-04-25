import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken_] = useState(undefined);

    const setToken = (newToken) => {
        setToken_(newToken);
    };

    const setInitialToken = async () => {
        setToken(await AsyncStorage.getItem("token"));
    };

    const onTokenChanged = async () => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            await AsyncStorage.setItem("token", token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            await AsyncStorage.removeItem("token");
        }
    };

    useEffect(() => {
        setInitialToken();
    }, []);

    useEffect(() => {
        onTokenChanged();
    }, [token]);

    const contextValue = useMemo(
        () => ({
            token,
            setToken,
        }),
        [token]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
