import Layout from "./Layout";
import { Text } from "react-native";
import InputField from "./InputField";
import GlobalStyles from "../styles/GlobalStyles";
import { useState } from "react";
import CapsuleButton from "./CapsuleButton";
import { useTranslation } from "react-i18next";

const PasswordInfo = ({isEmptyField, setPasswordInfoLayer, register}) => {
    const {t} = useTranslation();
    const [errorMessage, setErrorMessage] = useState();
    const [password, setPassword] = useState();
    const [verifyPassword, setVerifyPassword] = useState();
    const passwordRegExp = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,}$/g;

    function isPasswordSame() {
        return password === verifyPassword;
    }

    function isPasswordValid(value) {
        return passwordRegExp.test(value);
    }

    function passwordInfoRequirements() {
        if (isEmptyField(password) || isEmptyField(verifyPassword)) {
            alert(t("error-messages.empty-field"))
            return false;
        }

        if (!isPasswordSame()) {
            alert(t("error-messages.error-conflict-password"));
            return false;
        }

        if (isPasswordValid(password) && isPasswordValid(verifyPassword)) {
            setErrorMessage(t("error-messages.error-password-title") + "\n" + t("error-messages.error-password-0")+ "\n" + t("error-messages.error-password-1")+ "\n" + t("error-messages.error-password-2"));
            return false;
        }

        return true;
    }

    function onClickCreate() {
        if (!passwordInfoRequirements()) {
            return;
        }
        register(password);
        return;
    }

    return (
        <Layout>
            <Text
                style={[GlobalStyles.textBase, {alignSelf: "center", paddingTop:20, paddingBottom:20, fontFamily: font.semiBold}]}
            >
                {t("pages.register.password")}
            </Text>
            <InputField
                style={[{alignSelf: "center"}]}
                onChangeText={(password) => setPassword(password)}
            />
            <Text
                style={[GlobalStyles.textBase, {alignSelf: "center", paddingTop:40, paddingBottom:20, fontFamily: font.semiBold}]}
            >
                {t("pages.register.confirm-password")}
            </Text>
            <InputField
                style={[{alignSelf: "center"}]}
                onChangeText={(verifyPassword) => setVerifyPassword(verifyPassword)}
            />
            <Text
                style={[GlobalStyles.textBase, {alignSelf: "center", paddingTop:40, paddingBottom:20, color: colors.red}]}
            >
                {errorMessage}
            </Text>
            <CapsuleButton 
                style={{width:"70%", alignSelf: "center"}}
                title={t("pages.register.create")}
                onClick={onClickCreate}
            />
        </Layout>
    );
}

export default PasswordInfo;