import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Navigator } from "./src/navigator/Navigator";
import { AuthProvider } from "./src/context/AuthContext";
import { LogBox } from "react-native";

const AppState = ({ children }: any) => {
  return <AuthProvider>{children}</AuthProvider>;
};

// Ignore log notification by message:
LogBox.ignoreLogs(["Warning: ..."]);

// Ignore all log notifications:
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  );
}
