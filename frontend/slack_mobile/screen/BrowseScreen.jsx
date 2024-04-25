import { Text, View, FlatList, ActivityIndicator } from "react-native";
import Layout from "../components/Layout";

import GardenItem from "../components/GardenItem";
import GlobalStyles from "../styles/GlobalStyles";
import axios from "axios";
import getApiUrl from "../utils/routing";
import colors from "../utils/colors";

import { useDispatch } from "react-redux";
import { setCurrent } from "../store/slice/navbar";
import { useEffect, useState } from "react";
import { SearchBar } from "@rneui/themed";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

const BrowseScreen = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [gardens, setGardens] = useState([]);
    const [gardenOpened, setGardenOpened] = useState(-1);
    const { t } = useTranslation();
    const navigation = useNavigation();

    const updateSearch = async (query) => {
        setSearch(query);
        axios
            .post(getApiUrl("/v1/garden/search"), { query: query })
            .then((response) => {
                setGardens(response.data);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigation.navigate("home");
                    alert(t("error-messages.error-timeout"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_EXPIRED"
                ) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-not-logged"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_INVALID"
                ) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-not-logged"));
                } else if (reason.response.status === 401) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-fetch"));
                }
            });
    };

    useEffect(() => {
        dispatch(setCurrent(1));
        setLoading(true);
        axios
            .get(getApiUrl("/v1/garden"))
            .then((response) => {
                setGardens(response.data);
                setLoading(false);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigation.navigate("home");
                    alert(t("error-messages.error-timeout"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_EXPIRED"
                ) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-not-logged"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_INVALID"
                ) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-not-logged"));
                } else if (reason.response.status === 401) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-fetch"));
                }
            });
    }, []);

    if (loading) {
        return (
            <Layout title={t("pages.browse.title")}>
                <View style={GlobalStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3AAF5C" />
                </View>
            </Layout>
        );
    }

    return (
        <Layout title={t("pages.browse.title")}>
            <SearchBar
                placeholder={t("pages.browse.search")}
                onChangeText={updateSearch}
                value={search}
                containerStyle={{
                    backgroundColor: "#00000000",
                    borderBottomColor: "transparent",
                    borderTopColor: "transparent",
                    shadowColor: colors.grayShadow,
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                    elevation: 40,
                }}
                inputContainerStyle={{
                    backgroundColor: colors.white,
                }}
                round
                placeholderTextColor={colors.gray0}
            />
            <Text style={GlobalStyles.textGardenSearchCount}>
                {gardens.length} {t("pages.browse.results")}
            </Text>
            <FlatList
                data={gardens}
                renderItem={({ item }) => (
                    <GardenItem
                        garden={item}
                        stateContext={{
                            value: gardenOpened,
                            set: setGardenOpened,
                        }}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
        </Layout>
    );
};

export default BrowseScreen;
