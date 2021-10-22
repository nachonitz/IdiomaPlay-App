import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { LessonsScreen } from "../screens/LessonsScreen";
import { ExercisesScreen } from "../screens/ExercisesScreen";
import { UnitsScreen } from "../screens/UnitsScreen";

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
      <Stack.Screen name="UnitsScreen" component={UnitsScreen} />
      <Stack.Screen name="LessonsScreen" component={LessonsScreen} />
      <Stack.Screen name="ExercisesScreen" component={ExercisesScreen} />
    </Stack.Navigator>
  );
}