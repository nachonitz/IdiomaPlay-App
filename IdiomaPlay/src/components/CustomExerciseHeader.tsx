import { ParamListBase, useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { StatusBar, TouchableOpacity, View, Text, ScrollView, StyleSheet } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { Screens } from '../navigator/Screens'
import { styles } from '../theme/appTheme'
import { colors } from '../theme/colors'
import { CustomKeyboardAvoidingView } from './CustomKeyboardAvoidingView'

export const CustomExerciseHeader = (
  {
    children,
    lives,
    currentExercise,
    maxExercises,
  }: React.PropsWithChildren<{
    lives: number,
    currentExercise: number,
    maxExercises : number,
  }>) => {
  
  const {top} = useSafeAreaInsets()
  const margin = top || 20
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>()

  return (
    <View style={{flex: 1}}>
        <View style={customScreenStyles.container_logo}>
          <StatusBar barStyle="light-content" />
          
          <View
            style={{
              ...customScreenStyles.headerContainer,
              paddingTop: top ? top : 10,
              height: 90 + (top ? top : 5),
              // backgroundColor: 'pink',
              flexDirection: 'column',
              alignItems: 'center',
              paddingHorizontal: styles.globalMargin.marginHorizontal,
              paddingBottom: 10
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: styles.globalMargin.marginHorizontal,
              paddingBottom: 5,
              width: '100%'
              }}>
              <View
                style={{
                  width: '9%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TouchableOpacity
                  onPress={() => {navigation.navigate(Screens.home)}}
                  activeOpacity={0.6}
                >
                  <Icon name='close' size={27} color={'grey'}/>
                </TouchableOpacity>

              </View>

              <View style={{width: '70%'}}>
                {maxExercises != 0 && <ProgressBar progress={(currentExercise) /maxExercises} color={colors.lightPrimary} style={{height: 8, borderRadius: 100}}/>}
              </View>

              <View
                style={{
                  width: '9%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{fontSize: 17, fontWeight: '700', color: 'grey'}}>{currentExercise}/{maxExercises}</Text>
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: styles.globalMargin.marginHorizontal,
              width: '100%',
              marginTop: 10
            }}>
              <View>
                <Text style={{fontSize: 17, fontWeight: '700', color: 'grey'}}>Vidas restantes: {lives}</Text>
              </View>
              <View>
                <Text style={{fontSize: 17, fontWeight: '700', color: 'grey'}}>Puntuación: 70</Text>
              </View>
            </View>
          </View>
          

          <CustomKeyboardAvoidingView>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
            >
              <View style={customScreenStyles.container}>
                {children}
              </View>
            </ScrollView>
          </CustomKeyboardAvoidingView>
        </View>
  </View>
  )
}

const customScreenStyles = StyleSheet.create({
  container: {
    ...styles.globalMargin, 
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    alignItems: 'center',
    flex: 1,
    marginRight: 25
  },
  container_logo: {
    flex: 1,
  },
  headerContainer: {
    // backgroundColor: colors.primary,
    width: '100%',
  },
  idiomaPlay: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  }
})
