import { View } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import React from "react";

const Card = (
    { children, width, height, marginVertical, style, onLayout },
    ref
) => {
    return (
        <View
            ref={ref}
            style={[
                GlobalStyles.componentCard,
                width ? { width: width } : null,
                height ? { height: height } : null,
                marginVertical ? { marginVertical: marginVertical } : null,
                style,
            ]}
            onLayout={onLayout}>
            {children}
        </View>
    );
};

export default React.forwardRef(Card);
