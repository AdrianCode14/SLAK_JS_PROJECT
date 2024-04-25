import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Layout from "../components/Layout";

import GardenItem from "../components/GardenItem";
import GlobalStyles from "../styles/GlobalStyles";
import axios from "axios";
import getApiUrl from "../utils/routing";

import { useDispatch } from "react-redux";
import { setCurrent } from "../store/slice/navbar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const MyGardensScreen = () => {
    const [ownGarden, setOwnGarden] = useState(undefined);
    const [affiliateGardens, setAffiliateGardens] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        dispatch(setCurrent(2));
        setLoading(true);

        axios
            .get(getApiUrl("/v1/garden/user-affiliated-gardens"))
            .then((response) => {
                setAffiliateGardens([...response.data]);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigation.navigate("home");
                    alert(t("errors-messages.error-timeout"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_EXPIRED"
                ) {
                    navigation.navigate("home");
                    alert(t("errors-messages.error-not-logged"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_INVALID"
                ) {
                    navigation.navigate("home");
                    alert(t("errors-messages.error-not-logged"));
                } else if (reason.response.status === 401) {
                    navigation.navigate("home");
                    alert(t("errors-messages.error-fetch"));
                }
            });

        axios
            .get(getApiUrl("/v1/garden/own-created-garden"))
            .then((response) => {
                if (response.data) setOwnGarden(response.data);
                setLoading(false);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigation.navigate("home");
                    alert(t("errors-messages.error-timeout"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_EXPIRED"
                ) {
                    navigation.navigate("home");
                    alert(t("errors-messages.error-not-logged"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_INVALID"
                ) {
                    navigation.navigate("home");
                    alert(t("errors-messages.error-not-logged"));
                } else if (reason.response.status !== 401) {
                    navigation.navigate("home");
                    alert(t("errors-messages.error-fetch"));
                }
            });
    }, [isFocused]);

    if (loading) {
        return (
            <Layout title={t("pages.myGardens.title")}>
                <View style={GlobalStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3AAF5C" />
                </View>
            </Layout>
        );
    }

    if (ownGarden) {
        return (
            <Layout title={t("pages.myGardens.title")}>
                <Text style={GlobalStyles.textTitle}>
                    {t("pages.myGardens.garden")}
                </Text>
                <GardenItem
                    onClick={() =>
                        navigation.navigate("my-garden", {
                            id: ownGarden.id,
                        })
                    }
                    garden={ownGarden}
                />

                <Text style={[GlobalStyles.textTitle, { width: "100%" }]}>
                    {t("pages.myGardens.affiliations")}
                </Text>

                <FlatList
                    data={affiliateGardens}
                    renderItem={({ item }) => (
                        <GardenItem
                            onClick={() =>
                                navigation.navigate("my-garden", {
                                    id: item.id,
                                })
                            }
                            garden={item}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                />
            </Layout>
        );
    }

    return (
        <Layout title={t("pages.myGardens.title")}>
            <Text style={GlobalStyles.textBase}>
                {t("pages.myGardens.affiliations")}
            </Text>
            <FlatList
                data={affiliateGardens}
                renderItem={({ item }) => (
                    <GardenItem
                        onClick={() =>
                            navigation.navigate("my-garden", {
                                id: item.id,
                            })
                        }
                        garden={item}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
        </Layout>
    );
};

export default MyGardensScreen;
