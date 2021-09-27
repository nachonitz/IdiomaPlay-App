import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ExercisesScreen } from "../screens/ExercisesScreen";

const Stack = createStackNavigator();

export const Navigator = () => {
  

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white'
        }
      }}
    >
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ExercisesScreen" component={ExercisesScreen} />
    </Stack.Navigator>
  );
}