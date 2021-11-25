import React, { useContext } from "react";
import { Text, Image, View } from "react-native";
import { StyleSheet } from "react-native";
import { CustomButton } from "../components/CustomButton";
import { styles } from "../theme/appTheme";
import { colors } from "../theme/colors";
import { ParamListBase, useNavigation } from "@react-navigation/core";
import { Screens } from "../navigator/Screens";
import { StackNavigationProp } from "@react-navigation/stack";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { AuthContext } from "../context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

export const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const context = useContext(AuthContext);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "1039607438247-8ganubrmrmbd8ar0knjhs9rhltdal3u8.apps.googleusercontent.com",
    // iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    androidClientId:
      "1039607438247-8ganubrmrmbd8ar0knjhs9rhltdal3u8.apps.googleusercontent.com",
    webClientId:
      "1039607438247-8ganubrmrmbd8ar0knjhs9rhltdal3u8.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      context.status != "authenticated" && context.logIn("google token");
    }
  }, [response]);

  return (
    <View style={{ ...styles.globalMargin, justifyContent: "center" }}>
      <Image
        source={require("../assets/logo_white.jpg")}
        resizeMode={"contain"}
        style={homeStyles.logo}
      />
      <Text style={homeStyles.text}>IdiomaPlay</Text>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Image
          source={require("../assets/google.png")}
          style={{
            width: 50,
            height: 50,
          }}
        />
        <CustomButton
          label={"Sign in with Google"}
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      </View>
    </View>
  );
};

const homeStyles = StyleSheet.create({
  logo: {
    height: "40%",
    marginBottom: 50,
    alignSelf: "center",
  },
  text: {
    color: colors.primary,
    fontSize: 35,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 50,
  },
});
