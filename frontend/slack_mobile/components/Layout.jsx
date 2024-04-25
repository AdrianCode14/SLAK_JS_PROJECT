import { Text, View, SafeAreaView, ScrollView } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import { useState } from "react";
import Navbar from "./Navbar";

const Layout = ({ children, title, scroll, style }) => {
    return (
        <View style={GlobalStyles.baseContainer}>
            <SafeAreaView style={GlobalStyles.pageTitleContainer}>
                <Text numberOfLines={1} style={GlobalStyles.pageTitle}>
                    {title}
                </Text>
            </SafeAreaView>

            <View style={[GlobalStyles.slideContainer, { height: "85%" }]}>
                <SafeAreaView style={GlobalStyles.mainContainer}>
                    {scroll && (
                        <ScrollView
                            style={[GlobalStyles.content, style]}
                            allowStartFade={true}>
                            {children}
                        </ScrollView>
                    )}

                    {!scroll && (
                        <View
                            style={[
                                GlobalStyles.content,
                                style,
                                {
                                    height: "100%",
                                },
                            ]}
                            allowStartFade={true}>
                            {children}
                        </View>
                    )}
                </SafeAreaView>
                <Navbar />
            </View>
        </View>
    );
};

export default Layout;
