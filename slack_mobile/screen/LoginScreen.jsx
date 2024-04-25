import { Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrent } from "../store/slice/navbar";
import Layout from "../components/Layout";
import GlobalStyles from "../styles/GlobalStyles";
import CapsuleButton from "../components/CapsuleButton";
import { useTranslation } from "react-i18next";
import InputField from "../components/InputField";
import font from "../utils/font";
import colors from "../utils/colors";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../components/AuthProvider";
import getAPI from "../utils/routing";

const LoginScreen = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [emailAddress, setEmailAddress] = useState();
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const { setToken } = useAuth();

    useEffect(() => {
        dispatch(setCurrent(3));
    });

    // If value isn't set yet value = undefined, if value is set and erased = ""
    function isEmptyField(value) {
        return value === "" || value === undefined;
    }

    function loginInRequirements() {
        if (isEmptyField(emailAddress) || isEmptyField(password)) {
            return false;
        }
        return true;
    }

    const loginIn = async () => {
        if (!loginInRequirements()) {
            alert(t("error-messages.empty-field"));
            return;
        }

        axios
            .post(getAPI("/v1/user/login"), {
                email: emailAddress,
                password: password,
            })
            .then((reponse) => {
                if (reponse.data) {
                    setToken(reponse.data);
                }
                navigation.navigate("home");
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    setErrorMessage(t("error-messages.error-timeout"));
                } else {
                    if (reason.response.status === 403) {
                        setErrorMessage(t("error-messages.error-failed-login"));
                    }
                }
            });
    };

    function onClickNotRegistered() {
        navigation.navigate("register");
    }

    return (
        <Layout title="Login">
            <Text
                style={[
                    GlobalStyles.textBase,
                    {
                        alignSelf: "center",
                        paddingTop: 50,
                        paddingBottom: 20,
                        fontFamily: font.semiBold,
                    },
                ]}>
                {t("pages.login.email-address")}
            </Text>
            <InputField
                keyboardType={"email-address"}
                style={[{ alignSelf: "center" }]}
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
            <Text
                style={[
                    GlobalStyles.textBase,
                    {
                        alignSelf: "center",
                        paddingTop: 50,
                        paddingBottom: 20,
                        fontFamily: font.semiBold,
                    },
                ]}>
                {t("pages.login.password")}
            </Text>
            <InputField
                style={[{ alignSelf: "center" }]}
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
            />
            <Text
                style={[
                    GlobalStyles.textBase,
                    {
                        alignSelf: "center",
                        paddingTop: 40,
                        paddingBottom: 20,
                        color: colors.red,
                    },
                ]}>
                {errorMessage}
            </Text>
            <CapsuleButton
                style={{ width: "70%", alignSelf: "center" }}
                title={t("pages.login.btn-login")}
                onClick={loginIn}
            />
            <TouchableOpacity onPress={onClickNotRegistered}>
                <Text
                    style={[
                        GlobalStyles.textBase,
                        {
                            fontSize: 14,
                            alignSelf: "center",
                            paddingTop: 20,
                            color: colors.green0,
                        },
                    ]}>
                    {t("pages.login.not-registered-button")}
                </Text>
            </TouchableOpacity>
        </Layout>
    );
};

export default LoginScreen;
