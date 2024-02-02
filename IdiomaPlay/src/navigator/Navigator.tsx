import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { LessonsScreen } from "../screens/LessonsScreen";
import { ExercisesScreen } from "../screens/ExercisesScreen";
import { UnitsScreen } from "../screens/UnitsScreen";
import { AuthContext } from "../context/AuthContext";
import { ChallengesScreen } from "../screens/ChallengesScreen";
import { SlidesScreen } from "../screens/SlidesScreen";

const Stack = createStackNavigator();

export const Navigator = () => {
  const context = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: "white",
        },
      }}
    >
      {context.status == "authenticated" ? (
        <>
          <Stack.Screen name="ChallengesScreen" component={ChallengesScreen} />
          <Stack.Screen name="UnitsScreen" component={UnitsScreen} />
          <Stack.Screen name="LessonsScreen" component={LessonsScreen} />
          <Stack.Screen name="ExercisesScreen" component={ExercisesScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="SlideScreen" component={SlidesScreen} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
