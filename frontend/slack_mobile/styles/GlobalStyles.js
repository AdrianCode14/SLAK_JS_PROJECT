import { StyleSheet } from "react-native";

import colors from "../utils/colors";
import font from "../utils/font";

export default globalStyles = StyleSheet.create({
    baseContainer: {
        backgroundColor: colors.green0,
        flexDirection: "column",
        alignItems: "flex-end",
        flex: 1,
    },
    pageTitleContainer: {
        color: colors.white,
        flex: 1,
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    pageTitle: {
        color: colors.white,
        fontSize: 25,
        fontFamily: font.bold,
        paddingRight: 40,
        paddingLeft: 40,
    },
    slideContainer: {
        backgroundColor: colors.grayBG,
        width: "100%",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingTop: 30,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.8,
        shadowRadius: 11,

        elevation: 24,
        flex: 8,
    },
    mainContainer: {
        height: "100%",
        width: "100%",
        justifyContent: "flex-end",
        flex: 7,
    },
    navContainer: {
        backgroundColor: colors.white,
        height: 90,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",

        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.6,
        shadowRadius: 6.27,
        elevation: 24,
        flex: 1,
    },
    navElement: {
        color: colors.gray1,
    },
    navElementCurrent: {
        color: colors.green0,
    },
    content: {
        height: "auto",
        width: "100%",
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    componentCard: {
        width: "95%",
        height: 100,
        backgroundColor: colors.white,
        borderRadius: 30,
        marginVertical: 30,

        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,

        flexDirection: "col",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignSelf: "center",
    },
    capsuleButtonGradient: {
        height: 55,
        minWidth: 160,
        borderRadius: 25,
    },
    capsuleButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    textButton: {
        color: colors.white,
        fontFamily: font.bold,
        fontSize: 18,
        letterSpacing: 1,
    },
    textBase: {
        color: colors.gray0,
        fontFamily: font.medium,
        fontSize: 18,
    },
    textHighlighted: {
        fontSize: 30,
        fontWeight: "bold",
    },
    textTitle: {
        color: colors.gray0,
        fontFamily: font.medium,
        fontSize: 18,
        paddingLeft: 20,
    },
    textSubTitle: {
        color: colors.gray0,
        fontFamily: font.medium,
        fontSize: 18,
        paddingLeft: 20,
    },
    loadingContainer: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    capsuleContainer: {
        width: "95%",
        height: 70,
        backgroundColor: colors.white,
        borderRadius: 30,
        marginTop: 10,
        marginBottom: 30,
        shadowColor: colors.black,

        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,

        flexDirection: "col",
        justifyContent: "space-between",
        paddingHorizontal: 25,
        paddingVertical: 10,
        alignSelf: "center",
    },
    inputField: {
        width: "75%",
        height: "10%",
        paddingLeft: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.green0,
        backgroundColor: colors.white,

        shadowColor: colors.green0,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    textGardenCapsule: {
        color: colors.gray0,
        fontFamily: "Montserrat-Medium",
        fontSize: 17,
    },
    textGardenCapsuleId: {
        color: colors.green0,
        fontFamily: "Montserrat-Medium",
        fontSize: 12,
        textAlign: "right",
    },
    textGardenCapsuleAddress: {
        color: colors.gray0,
        fontFamily: "Montserrat-Medium",
        fontSize: 12,
    },
    textGardenSearchCount: {
        color: colors.gray0,
        fontFamily: "Montserrat-Medium",
        fontSize: 12,
        textAlign: "right",
    },
    loadingContainer: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    inputField: {
        width: "75%",
        height: "10%",
        paddingLeft: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.green0,
        backgroundColor: colors.white,

        shadowColor: colors.green0,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
});
