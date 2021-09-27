import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const CustomKeyboardAvoidingView = ({children}:any) => {
  const {top} = useSafeAreaInsets()
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? top+10 : 25}
    >
      {children}
    </KeyboardAvoidingView>
  )
}
