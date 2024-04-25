import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screen/HomeScreen";
import BrowseScreen from "./screen/BrowseScreen";
import MyGardensScreen from "./screen/MyGardensScreen";
import MyAccountScreen from "./screen/MyAccountScreen";
import RegisterScreen from "./screen/RegisterScreen";
import LoginScreen from "./screen/LoginScreen";
import AuthProvider from "./components/AuthProvider";
import MyGardenScreen from "./screen/MyGardenScreen";
import ZoneIdScreen from "./screen/ZoneIdScreen";

import { useFonts } from "expo-font";

import store from "./store";
import { Provider } from "react-redux";

import "./i18n";

const Stack = createNativeStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({
        "Montserrat-Black": require("./assets/Fonts/Montserrat-Black.ttf"),
        "Montserrat-ExtraBold": require("./assets/Fonts/Montserrat-ExtraBold.ttf"),
        "Montserrat-Bold": require("./assets/Fonts/Montserrat-Bold.ttf"),
        "Montserrat-SemiBold": require("./assets/Fonts/Montserrat-SemiBold.ttf"),
        "Montserrat-Medium": require("./assets/Fonts/Montserrat-Medium.ttf"),
        "Montserrat-Regular": require("./assets/Fonts/Montserrat-Regular.ttf"),
        "Montserrat-Light": require("./assets/Fonts/Montserrat-Light.ttf"),
        "Montserrat-ExtraLight": require("./assets/Fonts/Montserrat-ExtraLight.ttf"),
        "Montserrat-Thin": require("./assets/Fonts/Montserrat-Thin.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Provider store={store}>
            <AuthProvider>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                        }}
                        initialRouteName="home">
                        <Stack.Screen name="home" component={HomeScreen} />
                        <Stack.Screen name="browse" component={BrowseScreen} />
                        <Stack.Screen
                            name="my-garden"
                            component={MyGardenScreen}
                        />
                        <Stack.Screen
                            name="my-account"
                            component={MyAccountScreen}
                        />
                        <Stack.Screen name="zone" component={ZoneIdScreen} />
                        <Stack.Screen name="login" component={LoginScreen} />
                        <Stack.Screen
                            name="register"
                            component={RegisterScreen}
                        />
                        <Stack.Screen
                            name="my-gardens"
                            component={MyGardensScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </AuthProvider>
        </Provider>
    );
}
