import Layout from "../components/Layout";

import {
    Text,
    ActivityIndicator,
    View,
    FlatList,
    ScrollView,
} from "react-native";

import GlobalStyles from "../styles/GlobalStyles";

import Card from "../components/Card";
import { useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import colors from "../utils/colors";
import font from "../utils/font";

import { useTranslation } from "react-i18next";

import axios from "axios";

import ItemZone from "../components/ZoneItem";

const MyGardenScreen = () => {
    const squareSize = 40;
    const marginSize = 5;
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const params = route.params;
    const navigation = useNavigation();
    const [zones, setZones] = useState(undefined);
    const [sizeX, setSizeX] = useState(undefined);
    const [sizeY, setSizeY] = useState(undefined);
    const [content, setContent] = useState(undefined);
    const [gardenName, setGardenName] = useState(undefined);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        loadInitialState();
    }, []);

    const loadInitialState = async () => {
        await new Promise((r) => setTimeout(r, 1000));
        getZones();
        await getGardenData();
        setLoading(false);
    };

    const getGardenContentTrimmed = (baseContent) => {
        let contentTrimmedY = baseContent.filter((row) => {
            let rowFiltered = row.filter((element) => element !== null);
            return rowFiltered.length > 0;
        });

        let output = [];
        if (contentTrimmedY.length <= 0) {
            setSizeX(0);
            setSizeY(0);
        } else {
            setSizeY(contentTrimmedY.length);

            let newStart = 0;
            let newEnd = contentTrimmedY[0].length;

            let endTrimming = false;
            while (newEnd >= 0 && !endTrimming) {
                for (let y = 0; y < contentTrimmedY.length; y++) {
                    if (contentTrimmedY[y][newEnd - 1] !== null) {
                        endTrimming = true;
                    }
                }
                if (!endTrimming) newEnd--;
            }

            endTrimming = false;
            while (newStart < newEnd && !endTrimming) {
                for (let y = 0; y < contentTrimmedY.length; y++) {
                    if (contentTrimmedY[y][newStart] !== null) {
                        endTrimming = true;
                    }
                }
                if (!endTrimming) newStart++;
            }

            setSizeX(newEnd - newStart);
            for (let y = 0; y < contentTrimmedY.length; y++) {
                output.push(contentTrimmedY[y].slice(newStart, newEnd));
            }
        }

        return output;
    };

    const buildStyleForGardenCell = (x, y, elem) => {
        let hasUp = false;
        let hasDown = false;
        let hasLeft = false;
        let hasRight = false;
        //checkUpperCorner
        let style = [];

        if (y - 1 >= 0) {
            if (content[y - 1][x] === elem) {
                hasUp = true;
            }
        }

        if (y + 1 < sizeY) {
            if (content[y + 1][x] === elem) {
                hasDown = true;
            }
        }

        if (x - 1 >= 0) {
            if (content[y][x - 1] === elem) {
                hasLeft = true;
            }
        }

        if (x + 1 < sizeX) {
            if (content[y][x + 1] === elem) {
                hasRight = true;
            }
        }

        if (!hasUp) {
            style.push({ borderTopWidth: 2 });
            if (!hasLeft) {
                style.push({ borderTopStartRadius: 5 });
            }
            if (!hasRight) {
                style.push({ borderTopEndRadius: 5 });
            }
        }

        if (!hasDown) {
            style.push({ borderBottomWidth: 2 });
            if (!hasLeft) style.push({ borderBottomStartRadius: 5 });
            if (!hasRight) style.push({ borderBottomEndRadius: 5 });
        }

        if (!hasLeft) {
            style.push({ borderLeftWidth: 2 });
        }

        if (!hasRight) {
            style.push({ borderRightWidth: 2 });
        }

        return style;
    };

    const renderPlan = () => {
        return content.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
                if (cell === null) {
                    return (
                        <View
                            key={rowIndex * sizeX + cellIndex}
                            style={{
                                width: squareSize,
                                height: squareSize,
                            }}></View>
                    );
                } else
                    return (
                        <View
                            key={rowIndex * sizeX + cellIndex}
                            style={[
                                {
                                    width: squareSize,
                                    height: squareSize,
                                    backgroundColor: colors.grayBG,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderColor: colors.green0,
                                },
                                ...buildStyleForGardenCell(
                                    cellIndex,
                                    rowIndex,
                                    cell
                                ),
                            ]}>
                            <Text>{cell}</Text>
                        </View>
                    );
            });
        });
    };

    const onZoneClick = (areaID) => {
        navigation.navigate("zone", { id: areaID });
    };

    const getZones = async () => {
        await axios
            .get(getAPI(`/v1/area/${params.id}`))
            .then((response) => {
                setZones(response.data);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigation.navigate("home");
                    alert(t("error-messages.error-timeout"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.message == "TOKEN_EXPIRED"
                ) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-not-login"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_INVALID"
                ) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-not-login"));
                } else if (
                    reason.response.status === 403 &&
                    reason.response.data === "NOT_AFFILIATE"
                ) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-not-affiliate"));
                } else if (reason.response.status !== 401) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-fetch"));
                }
            });
    };

    const getGardenData = async () => {
        await axios
            .get(getAPI(`/v1/garden/byID/${params.id}`))
            .then((response) => {
                const plan = response.data.plan;
                const sizeX = plan.meta.sizeX;
                const sizeY = plan.meta.sizeY;
                setContent(getGardenContentTrimmed(plan.content));
                setGardenName(response.data.name);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigation.navigate("home");
                    alert(t("error-messages.error-timeout"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.message == "TOKEN_EXPIRED"
                ) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-not-login"));
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_INVALID"
                ) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-not-login"));
                } else if (
                    reason.response.status === 403 &&
                    reason.response.data === "NOT_AFFILIATE"
                ) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-not-affiliate"));
                } else if (reason.response.status !== 401) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-fetch"));
                }
            });
    };

    if (loading)
        return (
            <Layout title="My Garden">
                <View style={GlobalStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.green0} />
                </View>
            </Layout>
        );
    else
        return (
            <Layout
                title={gardenName}
                style={{ flexDirection: "column", height: "100%" }}>
                <Text style={GlobalStyles.textTitle}>
                    {t("pages.myGarden.plan")}
                </Text>
                <Card height="30%" style={{ justifyContent: "center" }}>
                    <ScrollView
                        style={{ width: "100%", height: "100%" }}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}>
                        <ScrollView
                            contentContainerStyle={{
                                alignItems: "center",
                            }}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            <View
                                style={{
                                    width: sizeX * squareSize,
                                    height: sizeY * squareSize,
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                }}>
                                {renderPlan()}
                            </View>
                        </ScrollView>
                    </ScrollView>
                </Card>
                <Text style={GlobalStyles.textSubTitle}>
                    {t("pages.myGarden.zones")}
                </Text>
                <FlatList
                    data={zones}
                    renderItem={({ item }) => (
                        <ItemZone zone={item} onClick={onZoneClick} />
                    )}
                    keyExtractor={(item) => item.area_index}
                />
            </Layout>
        );
};

export default MyGardenScreen;
