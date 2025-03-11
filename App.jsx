import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "./src/redux/store";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

import HomeIcon from "react-native-vector-icons/AntDesign";
import AbilityListIcon from "react-native-vector-icons/FontAwesome5";
import AbilityDetailIcon from "react-native-vector-icons/MaterialIcons";

import AbilityList from "./src/screen/AbilityList";
import AbilityDetail from "./src/screen/AbilityDetail";
import PokemonDetail from "./src/screen/PokemonDetail";
import Home from "./src/screen/Home";
import Login from "./src/screen/Login";

import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setDarkMode, setLightMode } from "./src/redux/theme/themeAction";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AbilityDetailStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ABILITY_DETAIL" component={AbilityDetail} />
      <Stack.Screen name="POKEMON_DETAILS" component={PokemonDetail} />
    </Stack.Navigator>
  );
};

const MainApp = () => {
  const dispatch = useDispatch();

  const { theme, isDark } = useSelector(state => state.theme);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('app_theme_mode');
        console.log(value)
        if (value == 'dark') {
          dispatch(setDarkMode());
        } else {
          dispatch(setLightMode());
        }
      }
      catch (error) {
        console.error('Error retrieving data:', error);
      }
    };
    getData()
  }, [])

  if (!isAuthenticated) {
    return <Login />;
  }



  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.headerBackground}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <NavigationContainer >
          <Tab.Navigator
            initialRouteName="ABILITY_LIST"
            screenOptions={{
              headerShown: false,
              tabBarShowLabel: false,
              tabBarActiveTintColor: theme.primary,
              tabBarInactiveTintColor: theme.textMuted,
              tabBarStyle: {
                backgroundColor: theme.card,
                borderTopColor: theme.border,
              },
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
};

export default App;