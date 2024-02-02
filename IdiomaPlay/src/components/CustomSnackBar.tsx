import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

interface Props {
  visible: boolean;
  message: string;
  error?: boolean;
}

export const CustomSnackBar = ({ visible, message, error = false }: Props) => {
  return (
    <>
      {visible && (
        <View
          style={{
            ...snackStyles.container,
            backgroundColor: error ? colors.wrong : colors.correct,
          }}
        >
          <Text style={snackStyles.text}>{message}</Text>
        </View>
      )}
    </>
  );
};

const snackStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 70,
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  text: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
