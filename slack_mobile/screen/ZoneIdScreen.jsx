import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import Layout from "../components/Layout";
import TaskItem from "../components/TaskItem";
import GlobalStyles from "../styles/GlobalStyles";
import colors from "../styles/GlobalStyles";
import axios from "axios";
import getApiUrl from "../utils/routing";
import { useDispatch } from "react-redux";
import { setCurrent } from "../store/slice/navbar";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ZoneIdScreen = ({ route }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [areaDescription, setAreaDescription] = useState("");
    const [selectedTask, setSelectedTask] = useState("");
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { params } = route;

    const onTaskSelect = (selectedTask) => {
        setSelectedTask(selectedTask.id);
    };

    const fetchData = async () => {
        try {
            dispatch(setCurrent(1));
            setLoading(true);

            const tasksResponse = await axios.get(
                getApiUrl(`/v1/task/${params.id}`)
            );
            setTasks(tasksResponse.data);

            const areaResponse = await axios.get(
                getApiUrl(`/v1/area/from-area/${params.id}`)
            );
            setAreaDescription(areaResponse.data);

            setLoading(false);
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                navigation.navigate("home");
                alert(t("error-messages.error-timeout"));
            } else if (
                (error.response.status === 401 &&
                    error.response.data === "TOKEN_EXPIRED") ||
                (error.response.status === 401 &&
                    error.response.data === "TOKEN_INVALID")
            ) {
                navigation.navigate("home");
                alert(t("errors-messages.error-not-logged"));
            } else if (
                error.response.status === 403 &&
                error.response.data === "NOT_AFFILIATE"
            ) {
                navigation.navigate("home");
                alert(t("error-messages.error-not-affiliate"));
            } else if (error.response.status === 401) {
                navigation.navigate("home");
                alert(t("error-messages.error-fetch"));
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [dispatch, navigation, params.id]);

    const validateTask = () => {
        if (!selectedTask) {
            return;
        }

        axios
            .patch(getApiUrl(`/v1/task/validate/${params.id}`), {
                taskID: selectedTask.id,
            })
            .then(() => {
                setTasks(tasks.filter((task) => task.id !== selectedTask.id));
                alert(t("success-messages.task-validated"));
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

        setSelectedTask(undefined);
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

    return (
        <Layout title={areaDescription.name}>
            <View>
                <Text
                    style={{
                        marginHorizontal: 20,
                        marginBottom: 10,
                        ...GlobalStyles.textHighlighted,
                    }}>
                    {t("pages.zonePage.descriptionText")}
                </Text>
                <Text
                    style={{
                        fontSize: 20,
                        fontFamily: font.medium,
                        color: colors.gray1,
                        marginHorizontal: 13,
                        marginVertical: 10,
                    }}>
                    {areaDescription.description}
                </Text>
            </View>
            <View style={{ flexDirection: "row", marginVertical: 20 }}>
                <Text
                    style={{
                        marginHorizontal: 20,
                        ...GlobalStyles.textHighlighted,
                    }}>
                    {t("pages.zonePage.tasksText")}
                </Text>
                <Text
                    style={{
                        marginTop: 13,
                        marginLeft: "auto",
                        marginRight: 30,
                        ...GlobalStyles.textGardenSearchCount,
                    }}>
                    {tasks.length} {t("pages.zonePage.activeTasksText")}
                </Text>
            </View>
            <FlatList
                data={tasks}
                renderItem={({ item }) => (
                    <TaskItem
                        task={item}
                        onTaskSelect={onTaskSelect}
                        selectedTask={selectedTask}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
            />

            <LinearGradient
                colors={["#009A61", "#B6D752"]}
                style={{ height: 55, minWidth: 160, borderRadius: 25 }}
                start={{ x: -1, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <TouchableOpacity
                    onPress={validateTask}
                    style={GlobalStyles.capsuleButton}>
                    <Text style={GlobalStyles.textButton}>
                        {t("success-messages.validate")}
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        </Layout>
    );
};

export default ZoneIdScreen;
