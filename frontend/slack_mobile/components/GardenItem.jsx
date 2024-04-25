import { TouchableOpacity, Text, View } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import CapsuleButton from "./CapsuleButton";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import getApiUrl from "../utils/routing";
import { useTranslation } from "react-i18next";

const GardenItem = ({ garden, onClick, stateContext }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const getAddressSplitted = (address) => {
        return address.split("#");
    };

    const changeStateContext = () => {
        if (stateContext) {
            if (stateContext.value == garden.id) stateContext.set(-1);
            else stateContext.set(garden.id);
        }
    };

    const onAddGarden = () => {
        axios
            .post(getApiUrl("/v1/garden/join"), {
                gardenID: garden.id,
            })
            .then(() => {
                navigation.navigate("my-garden", {
                    id: garden.id,
                });
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
                } else if (reason.response.status === 409) {
                    navigation.navigate("my-garden", { id: garden.id });
                    alert(t("error-messages.error-already-affiliated"));
                } else if (reason.response.status === 401) {
                    navigation.navigate("home");
                    alert(t("error-messages.error-fetch"));
                }
            });
    };

    if (stateContext && stateContext.value == garden.id) {
        return (
            <View style={[GlobalStyles.capsuleContainer, { height: 158 }]}>
                <TouchableOpacity onPress={changeStateContext}>
                    <Text
                        style={[
                            GlobalStyles.textGardenCapsule,
                            { marginRight: 20 },
                        ]}
                        numberOfLines={1}>
                        {garden.name}
                    </Text>
                    <View>
                        <Text style={GlobalStyles.textGardenCapsuleAddress}>
                            {getAddressSplitted(garden.address)[0]}
                        </Text>
                        <Text style={GlobalStyles.textGardenCapsuleAddress}>
                            {getAddressSplitted(garden.address)[1]}
                        </Text>
                        <Text style={GlobalStyles.textGardenCapsuleAddress}>
                            {getAddressSplitted(garden.address)[2]}
                        </Text>
                    </View>
                    <CapsuleButton
                        title={t("pages.browse.join")}
                        onClick={onAddGarden}
                        style={{ alignSelf: "flex-end" }}
                    />
                    <Text style={GlobalStyles.textGardenCapsuleId}>
                        {garden.id}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View style={[GlobalStyles.capsuleContainer]}>
                <TouchableOpacity
                    onPress={stateContext ? changeStateContext : onClick}>
                    <Text
                        style={[
                            GlobalStyles.textGardenCapsule,
                            { marginRight: 20 },
                        ]}
                        numberOfLines={1}>
                        {garden.name}
                    </Text>
                    {garden.address ? (
                        <Text style={GlobalStyles.textGardenCapsuleAddress}>
                            {getAddressSplitted(garden.address)[1]}
                        </Text>
                    ) : (
                        <Text />
                    )}
                    <Text style={GlobalStyles.textGardenCapsuleId}>
                        {garden.id}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
};

export default GardenItem;
