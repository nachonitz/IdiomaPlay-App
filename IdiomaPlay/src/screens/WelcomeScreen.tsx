import React from 'react'
import { Text,Image, View } from 'react-native'
import { StyleSheet } from 'react-native'
import { CustomButton } from '../components/CustomButton'
import { styles } from '../theme/appTheme'
import { colors } from '../theme/colors'
import { ParamListBase, useNavigation } from '@react-navigation/core';
import { Screens } from '../navigator/Screens';
import { StackNavigationProp } from '@react-navigation/stack'
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();


export const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>()

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '1039607438247-8ganubrmrmbd8ar0knjhs9rhltdal3u8.apps.googleusercontent.com',
    // iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    androidClientId: '1039607438247-8ganubrmrmbd8ar0knjhs9rhltdal3u8.apps.googleusercontent.com',
    webClientId: '1039607438247-8ganubrmrmbd8ar0knjhs9rhltdal3u8.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log(response)
      navigation.navigate(Screens.units)
    }
  }, [response]);

  return (
    <View style={{...styles.globalMargin, justifyContent: 'center'}}>
      <Image source={require('../assets/logo_white.jpg')} resizeMode={'contain'} style={homeStyles.logo}/>
      <Text style={homeStyles.text}>IdiomaPlay</Text>
      <CustomButton label={'Google Login'} disabled={!request} onPress={()=>{promptAsync()}}/>
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