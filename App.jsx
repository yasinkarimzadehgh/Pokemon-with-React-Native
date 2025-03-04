import React from "react";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import HomeIcon from "react-native-vector-icons/AntDesign";
import AbilityListIcon from "react-native-vector-icons/FontAwesome5";
import AbilityDetailIcon from "react-native-vector-icons/MaterialIcons";

import AbilityList from "./src/screen/AbilityList";
import AbilityDetail from "./src/screen/AbilityDetail";
import PokemonDetail from "./src/screen/PokemonDetail";
import Home from "./src/screen/Home";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AbilityDetailStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ABILITY_DETAIL" component={AbilityDetail} />
      <Stack.Screen name="POKEMON_DETAILS" component={PokemonDetail} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={store}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#2980b9",
              }}
            >
              <Tab.Screen
                name="ABILITY_DETAIL_STACK"
                component={AbilityDetailStack}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <AbilityDetailIcon name="catching-pokemon" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="ABILITY_LIST"
                component={AbilityList}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <AbilityListIcon name="list-ul" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="HOME"
                component={Home}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <HomeIcon name="home" color={color} size={size} />
                  ),
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;




