import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar, useColorScheme } from "react-native";
import { useAuth } from "./AuthContext";

import Home from "./screens/Home";
import Search from "./screens/Search";
import Library from "./screens/Library";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Starting from "./screens/Starting";
import Account from "./screens/Account";
import EditInfo from "./screens/EditInfo";
import Genre from "./screens/Genre";
import Player from "./screens/Player";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function StartScreens() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "black" : "white";
  const statusBarStyle =
    colorScheme === "dark" ? "light-content" : "dark-content";

  return (
    <>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: "vertical",
          headerTintColor: colorScheme === "light" ? "black" : "white",
          headerStyle: {
            backgroundColor: backgroundColor,
            shadowColor: "transparent",
          },
        }}
      >
        <Stack.Screen
          name="AudioAlcove"
          component={Starting}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Sign In"
          component={SignIn}
          options={{ gestureResponseDistance: 1000, gestureVelocityImpact: 0.1, presentation: "modal", headerLeft: () => null }}
        />
        <Stack.Screen
          name="Sign Up"
          component={SignUp}
          options={{ gestureResponseDistance: 1000, gestureVelocityImpact: 0.1, presentation: "modal", headerLeft: () => null }}
        />
      </Stack.Navigator>
    </>
  );
}

function TabScreens() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "black" : "white";
  const GenreColor = colorScheme === "dark" ? "#202123" : "#f5f5f5";
  const statusBarStyle =
    colorScheme === "dark" ? "light-content" : "dark-content";

  return (
    <>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: "vertical",
          headerTintColor: colorScheme === "light" ? "black" : "white",
          headerStyle: {
            backgroundColor: backgroundColor,
            shadowColor: "transparent",
          },
        }}
      >
        <Stack.Screen
          name="TabGroup"
          component={TabGroup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{ gestureResponseDistance: 1000, gestureVelocityImpact: 0.1, presentation: "modal", headerLeft: () => null }}
        />
        <Stack.Screen
          name="Edit Info"
          component={EditInfo}
          options={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Genre"
          component={Genre}
          options={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
            headerShown: true,
            headerStyle: {
              backgroundColor: GenreColor,
              shadowColor: "transparent",
            },
          }}
        />
        <Stack.Screen
          name="Player"
          component={Player}
          options={{
            gestureEnabled: true,
            gestureDirection: "vertical", 
            headerShown: false,
            headerTransparent: true, 
            headerBackTitleVisible: false, 
            headerTintColor: 'white',
            cardStyle: {
              backgroundColor: 'transparent', 
            },
            cardOverlayEnabled: true, 
            cardShadowEnabled: true, 
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                transform: [
                  {
                    translateY: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [850, 0], 
                    }),
                  },
                ],
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1], 
                  extrapolate: 'clamp',
                }),
              },
            }),
            gestureResponseDistance: 1000, 
            gestureVelocityImpact: 0.3,
            presentation: 'modal', 
          }}
        />
      </Stack.Navigator>
    </>
  );
}

function TabGroup() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "#202123" : "#f5f5f5";
  const statusBarStyle =
    colorScheme === "dark" ? "light-content" : "dark-content";
  const headerTitleColor = colorScheme === "dark" ? "white" : "black";

  return (
    <>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: backgroundColor,
            shadowColor: "transparent",
          },
          tabBarStyle: {
            backgroundColor: backgroundColor,
            borderTopWidth: 0,
          },
          headerTintColor: headerTitleColor,
          tabBarIcon: ({ color, focused, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "ios-home" : "ios-home-outline";
            } else if (route.name === "Search") {
              iconName = focused ? "ios-search" : "ios-search-outline";
            } else if (route.name === "Library") {
              iconName = focused
                ? "ios-musical-notes"
                : "ios-musical-notes-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#19bfb7",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Library" component={Library} />
      </Tab.Navigator>
    </>
  );
}

export default function Navigation() {
  const { authState } = useAuth();

  return (
    <NavigationContainer>
      {authState?.isAuthenticated ? <TabScreens /> : <StartScreens />}
    </NavigationContainer>
  );
}
