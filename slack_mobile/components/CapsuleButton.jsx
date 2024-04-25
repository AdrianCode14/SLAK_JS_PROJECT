import { TouchableOpacity, Text } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import { LinearGradient } from "expo-linear-gradient";

const CapsuleButton = ({ title, onClick, style }) => {
    return (
        <LinearGradient
            colors={["#009A61", "#B6D752"]}
            style={[GlobalStyles.capsuleButtonGradient, style]}
            start={{ x: -1, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <TouchableOpacity
                onPress={onClick}
                style={GlobalStyles.capsuleButton}>
                <Text style={GlobalStyles.textButton}>{title}</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default CapsuleButton;
