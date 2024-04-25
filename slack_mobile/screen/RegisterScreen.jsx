import { Text } from "react-native";
import Layout from "../components/Layout";
import { useState } from "react";
import UserInfo from "../components/UserInfo";
import PasswordInfo from "../components/PasswordInfo";
import axios from "axios";
import getAPI from "../utils/routing";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
    const [currentLayer, setCurrentLayer] = useState(1);
    const [userInfoLayer, setUserInfoLayer] = useState();
    const [passwordInfoLayer, setPasswordInfoLayer] = useState();
    const { t } = useTranslation();
    const navigation = useNavigation();

    function isEmptyField(value) {
        return value === "" || value === undefined;
    }

    const register = async (password) => {
        const { email, name, firstName } = userInfoLayer;
        
        axios
            .post(getAPI("/v1/user/register"), {
                email: email,
                name: name,
                firstName: firstName,
                password: password,
            })
            .then(() => {
                alert(t("pages.register.account-created"));
                navigation.navigate("home");
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    alert(t("error-messages.error-timeout"));
                    navigation.navigate("home");
                } else if (reason.response.status === 409) {
                    alert(t("error-messages.error-already-exist"));
                    setCurrentLayer(1);
                } else {
                    alert(t("error-messages.error-fetch"));
                    navigation.navigate("home");
                }
            })
    }

    return currentLayer === 1 ? 
        <UserInfo
            setCurrentLayer={setCurrentLayer}
            isEmptyField={isEmptyField}
            setUserInfoLayer={setUserInfoLayer}
        /> : <PasswordInfo
            isEmptyField={isEmptyField}
            setPasswordInfoLayer={setPasswordInfoLayer}
            register={register}
        />
}

export default RegisterScreen;