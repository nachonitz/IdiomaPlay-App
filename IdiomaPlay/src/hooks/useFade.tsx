import React, { useRef } from 'react'
import { Animated } from 'react-native'

export const useFade = () => {
  
  const opacidad = useRef(new Animated.Value(0)).current

  const fadeIn = (callback?: Function) => {
    Animated.timing(
      opacidad,
      {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }
    ).start(() => callback ? callback() : null)
  }

  const fadeOut = () => {
    Animated.timing(
      opacidad,
      {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }
    ).start()
  } 
  
  return {
    opacidad,
    fadeIn,
    fadeOut
  }
}
