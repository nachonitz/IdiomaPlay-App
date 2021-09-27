import React from 'react'
import { Text,Image, View } from 'react-native'
import { StyleSheet } from 'react-native'
import { CustomButton } from '../components/CustomButton'
import { styles } from '../theme/appTheme'
import { colors } from '../theme/colors'
import { ParamListBase, useNavigation } from '@react-navigation/core';
import { Screens } from '../navigator/Screens';
import { StackNavigationProp } from '@react-navigation/stack'

export const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
  return (
    <View style={{...styles.globalMargin, justifyContent: 'center'}}>
      <Image source={require('../assets/logo_white.jpg')} resizeMode={'contain'} style={homeStyles.logo}/>
      <Text style={homeStyles.text}>IdiomaPlay</Text>
      <CustomButton label={'Comenzar'} onPress={()=>{navigation.navigate(Screens.home)}}/>
    </View>
  )
}

const homeStyles = StyleSheet.create({
  logo: {
    height: '40%',
    marginBottom: 50,
    alignSelf: 'center'
  },
  text: {
    color: colors.primary,
    fontSize: 35,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 50,
  }
})