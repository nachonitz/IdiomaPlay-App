import React from 'react'
import { StyleProp, TouchableOpacity, ViewStyle, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  label: string
  onPress?: () => void
  secondary?: boolean
  disabled?: boolean
}

export const CustomButton = ({label, onPress, secondary, disabled = false}: Props) => {
  return (
    <TouchableOpacity
      style={{
        ...buttonStyles.button,
        backgroundColor: secondary? colors.lightPrimary: colors.primary
      }}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={buttonStyles.text}>{label}</Text>
    </TouchableOpacity>
  )
}

const buttonStyles = StyleSheet.create({
  text:{
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold'
  },
  button: {
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    paddingHorizontal: 15
  }
})