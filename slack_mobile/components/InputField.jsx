import { TextInput } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import React from "react";

const InputField = ({style, secureTextEntry, placeHolder, keyboardType, onChangeText, defaultValue}) => {
    return (
        <TextInput
            keyboardType={keyboardType}
            placeholder={placeHolder}
            style={[GlobalStyles.inputField, style]}
            secureTextEntry={secureTextEntry??false}
            onChangeText={onChangeText}
            defaultValue={defaultValue}
        />
    );
}

export default InputField;