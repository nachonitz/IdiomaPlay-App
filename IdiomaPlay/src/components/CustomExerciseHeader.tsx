import { ParamListBase, useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { StatusBar, TouchableOpacity, View, Text, ScrollView, StyleSheet, Modal, Dimensions } from 'react-native'
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
    points,
    currentExercise,
    maxExercises,
  }: React.PropsWithChildren<{
    lives: number,
    points: number,
    currentExercise: number,
    maxExercises : number,
  }>) => {
  
  const {top} = useSafeAreaInsets()
  const margin = top || 20
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
  const [showModal, setshowModal] = useState(false)

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
                  onPress={() => {setshowModal(true)}}
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
                <Text style={{fontSize: 17, fontWeight: '700', color: 'grey'}}>Puntuación: {points}</Text>
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

          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            // onRequestClose={() => {
            //   navigation.navigate(Screens.home)
            // }}
            >
            <View style={{backgroundColor:'rgba(0,0,0,0.6)',justifyContent:'center',flex:1,alignItems:'center'}}>
              <View style={[{
                backgroundColor:'white',
                height:Dimensions.get('window').height * 0.4,
                width:Dimensions.get('window').width * 0.8,
                alignItems:'center',
                justifyContent:'space-evenly',
                paddingHorizontal:20,
                paddingVertical:30},
                customScreenStyles.card]}>  
                
                <Text style={{fontSize:23, color:colors.darkPrimary, fontWeight: 'bold',textAlign:'center'}}>
                  Se perderá el progreso
                </Text>
                
                <Text style={{fontSize:23, color:colors.darkPrimary, textAlign:'center'}}>
                  Deseas continuar?
                </Text>

                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly'}}>
                  <TouchableOpacity
                    style={[{ backgroundColor: colors.primary, width:'40%',height:50,justifyContent:'center',alignItems:'center' },customScreenStyles.card]}
                    onPress={() => {
                      setshowModal(false)
                    }}>
                    <Text style={{fontSize:20, fontWeight:'bold', color: 'white'}}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[{ backgroundColor: colors.wrong, width:'40%',height:50,justifyContent:'center',alignItems:'center' },customScreenStyles.card]}
                    onPress={() => {
                      navigation.navigate(Screens.units)
                      setshowModal(false)
                    }}>
                    <Text style={{fontSize:20, fontWeight:'bold', color: 'white'}}>Salir</Text>
                  </TouchableOpacity>
                </View>

              </View>

            </View>
          </Modal>
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
  },
  card: {
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
  }
})
