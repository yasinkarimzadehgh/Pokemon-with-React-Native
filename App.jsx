import React from "react";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, StyleSheet } from "react-native";

import HomeIcon from "react-native-vector-icons/AntDesign";
import AbilityListIcon from "react-native-vector-icons/FontAwesome5";
import AbilityDetailIcon from "react-native-vector-icons/MaterialIcons";

import AbilityList from "./src/screen/AbilityList";
import AbilityDetail from "./src/screen/AbilityDetail";
import PokemonDetail from "./src/screen/PokemonDetail";
import Home from "./src/screen/Home";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";

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

const AppContent = () => {
  const { theme, isDark } = useTheme();

  // Create custom navigation theme based on our theme
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.headerBackground}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <Provider store={store}>
          <NavigationContainer theme={navigationTheme}>
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
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;