import { View, TouchableOpacity, Text } from "react-native";

import GlobalStyles from "../styles/GlobalStyles";

const ItemZone = ({ zone, onClick }) => {
    return (
        <TouchableOpacity
            style={[
                GlobalStyles.capsuleContainer,
                {
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                },
            ]}
            onPress={() => onClick(zone.id)}>
            <Text
                style={[
                    GlobalStyles.textBase,
                    {
                        width: 30,
                        color: "#3AAF5C",
                        fontFamily: "Montserrat-Bold",
                    },
                ]}>
                {zone.area_index}
            </Text>
            <Text style={[GlobalStyles.textBase]}>{zone.name}</Text>
        </TouchableOpacity>
    );
};

export default ItemZone;
