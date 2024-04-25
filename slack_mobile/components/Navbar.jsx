import { View, Pressable } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrent } from "../store/slice/navbar";

import { useNavigation } from "@react-navigation/native";

import { useAuth } from "./AuthProvider";
import { useTranslation } from "react-i18next";

import { isTokenValid } from "../utils/token";

const Navbar = () => {
    const current = useSelector((state) => state.navbar.current);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { token, setToken } = useAuth();
    const { t } = useTranslation();

    return (
        <View style={GlobalStyles.navContainer}>
            <Pressable
                style={{ padding: 15 }}
                onPress={() => {
                    navigation.navigate("home");
                    dispatch(setCurrent(0));
                }}>
                <FontAwesome5
                    style={
                        current == 0
                            ? GlobalStyles.navElementCurrent
                            : GlobalStyles.navElement
                    }
                    size={30}
                    name="home"
                />
            </Pressable>
            <Pressable
                style={{ padding: 15 }}
                onPress={() => {
                    navigation.navigate("browse");
                    dispatch(setCurrent(1));
                }}>
                <FontAwesome5
                    style={
                        current == 1
                            ? GlobalStyles.navElementCurrent
                            : GlobalStyles.navElement
                    }
                    size={30}
                    name="search"
                />
            </Pressable>
            <Pressable
                style={{ padding: 15 }}
                onPress={() => {
                    if (isTokenValid(token)) {
                        navigation.navigate("my-gardens");
                        dispatch(setCurrent(2));
                    } else {
                        navigation.navigate("login");
                        dispatch(setCurrent(3));
                    }
                }}>
                <FontAwesome
                    style={
                        current == 2
                            ? GlobalStyles.navElementCurrent
                            : GlobalStyles.navElement
                    }
                    size={30}
                    name="list"
                    solid
                />
            </Pressable>
            <Pressable
                style={{ padding: 15 }}
                onPress={() => {
                    if (isTokenValid(token)) {
                        navigation.navigate("my-account");
                    } else {
                        navigation.navigate("login");
                    }
                }}>
                <FontAwesome5
                    style={
                        current == 3
                            ? GlobalStyles.navElementCurrent
                            : GlobalStyles.navElement
                    }
                    size={30}
                    name="user"
                    solid
                />
            </Pressable>
        </View>
    );
};

export default Navbar;
