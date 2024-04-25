import { Text, View } from "react-native";
import Layout from "../components/Layout";

import Card from "../components/Card";
import CapsuleButton from "../components/CapsuleButton";
import GlobalStyles from "../styles/GlobalStyles";

import { useDispatch } from "react-redux";
import { setCurrent } from "../store/slice/navbar";
import { useEffect } from "react";
import { useAuth } from "../components/AuthProvider";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { isTokenValid } from "../utils/token";

const HomeScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { token, setToken } = useAuth();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        dispatch(setCurrent(0));
    }, []);

    const onClickDiscover = () => {
        navigation.navigate("browse");
    };

    const onClickAccess = () => {
        if (isTokenValid(token)) {
            navigation.navigate("my-gardens");
        } else {
            navigation.navigate("login");
        }
    };

    return (
        <Layout title={t("pages.home.title")}>
            <Card height={170}>
                <Text style={[GlobalStyles.textBase, { width: "100%" }]}>
                    {t("pages.home.text-1")}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                    }}>
                    <CapsuleButton
                        onClick={onClickDiscover}
                        style={{ width: 180 }}
                        title={t("pages.home.btn-discover")}
                    />
                </View>
            </Card>

            <Card height={200} marginVertical={15}>
                <Text style={[GlobalStyles.textBase, { width: "100%" }]}>
                    {t("pages.home.text-2")}
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                    }}>
                    <CapsuleButton
                        onClick={onClickAccess}
                        style={{ width: 320 }}
                        title={t("pages.home.btn-access")}
                    />
                </View>
            </Card>
        </Layout>
    );
};

export default HomeScreen;
