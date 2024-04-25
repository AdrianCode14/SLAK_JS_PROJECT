import { Text, View, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import GlobalStyles from "../styles/GlobalStyles";
import Colors from "../utils/colors";
import Layout from "../components/Layout";
import CapsuleButton from "../components/CapsuleButton";
import InputField from "../components/InputField";
import { useAuth } from "../components/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import getApiUrl from "../utils/routing";
import { useTranslation } from "react-i18next";

import { setCurrent } from "../store/slice/navbar";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { ActivityIndicator } from "react-native";

const MyAccountScreen = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(userData.name || "");
    const [newFirstName, setNewFirstName] = useState(userData.first_name || "");
    const navigation = useNavigation();
    const authContext = useAuth();
    const [loading, setLoading] = useState(true);

    const handleLogoutPress = () => {
        authContext.setToken(null);
        navigation.navigate("home");
    };

    useEffect(() => {
        dispatch(setCurrent(3));
    }, []);

    const getUserData = () => {
        setLoading(true);
        axios
            .get(getApiUrl("/v1/user/userdata"))
            .then((reponse) => {
                setUserData(reponse.data);
                setLoading(false);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigation.navigate("register");
                    alert(t("error-messages.error-timeout"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_EXPIRED"
                ) {
                    navigation.navigate("registerScreen");
                    alert(t("error-messages.error-not-logged"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_INVALID"
                ) {
                    setToken();
                    navigation.navigate("registerScreen");
                    alert(t("error-messages.error-not-logged"));
                } else if (reason.response.status !== 401) {
                    alert(t("error-messages.error-fetch"));
                }
            });
    };

    useEffect(() => {
        getUserData();
    }, []);

    const changeEditingPageState = () => {
        setIsEditing(!isEditing);
    };

    const handleSavePress = () => {
        const updateUserData = async () => {
            try {
                const response = await axios.patch(
                    getApiUrl("/v1/user/updateUserData"),
                    {
                        newName: newName,
                        newFirstName: newFirstName,
                    }
                );
                getUserData(response.data);
                setIsEditing(false);
            } catch (error) {
                alert(t("error-messages.error-fetch"));
            }
        };
        updateUserData();
    };

    if (loading) {
        return (
            <Layout title={t("pages.myGardens.title")}>
                <View style={GlobalStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3AAF5C" />
                </View>
            </Layout>
        );
    }

    return !isEditing ? (
        <Layout title={t("pages.account.title")}>
            <View
                style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Text style={GlobalStyles.textHighlighted}>
                    {userData.name + " " + userData.first_name}
                </Text>

                <View style={{ marginVertical: 30 }}>
                    <Text style={{ color: Colors.green0, fontSize: 20 }}>
                        {userData.email}
                    </Text>
                </View>

                <Text style={GlobalStyles.textHighlighted}>
                    {t("pages.account.options")}
                </Text>

                <Picker
                    selectedValue={i18n.language}
                    onValueChange={(value) => i18n.changeLanguage(value)}
                    style={{
                        width: 200,
                        height: 220,
                    }}>
                    <Picker.Item label="Français" value="fr" />
                    <Picker.Item label="English" value="en" />
                </Picker>

                <View style={{ marginTop: 20, marginBottom: 10 }}>
                    <CapsuleButton
                        style={{ width: 320 }}
                        title={t("pages.account.btn-modify")}
                        onClick={changeEditingPageState}
                    />
                </View>
                <View style={{ marginTop: 20, marginBottom: 10 }}>
                    <CapsuleButton
                        style={{ width: 320 }}
                        title={t("pages.account.btn-log-out")}
                        onClick={handleLogoutPress} //ca marche mais ca re render pas instant
                    />
                </View>
            </View>
        </Layout>
    ) : (
        <Layout>
            <View>
                <InputField
                    placeHolder={t("pages.account.newName")}
                    style={{ height: 50, width: "100%", marginVertical: 20 }}
                    defaultValue={userData.name}
                    onChangeText={(text) => setNewName(text)}
                />
                <InputField
                    placeHolder={t("pages.account.newFirstName")}
                    style={{ height: 50, width: "100%" }}
                    defaultValue={userData.first_name}
                    onChangeText={(text) => setNewFirstName(text)}
                />
            </View>
            <View>
                <CapsuleButton
                    style={{ marginVertical: 40 }}
                    title={t("pages.account.btn-save")}
                    onClick={handleSavePress} //ca marche, mais pas instant faut aller sur une autre page et revenir (genre faire save puis aller sur home puis revenir)
                />
                <CapsuleButton
                    title={t("pages.account.btn-cancel")}
                    onClick={changeEditingPageState}
                />
            </View>
        </Layout>
    );
};

export default MyAccountScreen;
