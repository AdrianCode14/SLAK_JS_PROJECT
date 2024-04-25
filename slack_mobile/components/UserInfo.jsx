import { Text } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import InputField from "./InputField";
import Layout from "./Layout";
import { useState } from "react";
import CapsuleButton from "./CapsuleButton";
import { useTranslation } from "react-i18next";

const UserInfo = ({setCurrentLayer, isEmptyField, setUserInfoLayer}) => {
    const [emailAddress, setEmailAddress] = useState();
    const [name, setName] = useState();
    const [firstName, setFirstName] = useState();
    const {t} = useTranslation();
    const emailRegExp = /^[a-zA-Z0-9_.+-âàéèêùûî]+@[a-zA-Z0-9-]+\.[\w-]{2,4}$/g;

    const onClickNext = function () {
        if (!userInfoRequirements()) {
            return;
        }
        setUserInfoLayer({email: emailAddress, name: name, firstName: firstName});
        setCurrentLayer(2);
    }

    function isEmailValid() {
        return emailRegExp.test(emailAddress);
    }

    function userInfoRequirements() {
        if (isEmptyField(emailAddress) || isEmptyField(name) || isEmptyField(firstName)) {
            alert(t("error-messages.empty-field"));
            return false; 
        }

        if (!isEmailValid()) {
            alert(t("error-messages.error-email-invalid"));
            return false;
        }
        return true;
    }

    return (
        <Layout>
            <Text
                style={[GlobalStyles.textBase, {alignSelf: "center", paddingTop:20, paddingBottom:20, fontFamily: font.semiBold}]}
            >
                {t("pages.register.name")}
            </Text>
            <InputField
                style={[{alignSelf: "center"}]}
                onChangeText={(name) => setName(name)}
            />
            <Text
                style={[GlobalStyles.textBase, {alignSelf: "center", paddingTop:40, paddingBottom:20, fontFamily: font.semiBold}]}
            >
                {t("pages.register.first-name")}
            </Text>
            <InputField
                style={[{alignSelf: "center"}]}
                onChangeText={(firstName) => setFirstName(firstName)}
            />
            <Text
                style={[GlobalStyles.textBase, {alignSelf: "center", paddingTop:40, paddingBottom:20, fontFamily: font.semiBold}]}
            >
                {t("pages.register.email-address")}
            </Text>
            <InputField
                keyboardType={"email-address"}
                style={[{alignSelf: "center"}]}
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
            <Text style={[{paddingBottom: 20}]}></Text>
            <CapsuleButton
                title={t("pages.register.next")}
                style={{width:"70%", alignSelf: "center"}}
                onClick={onClickNext}
            />
        </Layout>
    );
}

export default UserInfo;