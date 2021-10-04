import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Touchable, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { CustomHeaderScreen } from '../components/CustomHeaderScreen'
import { styles } from '../theme/appTheme'
import { Card } from 'react-native-elements'
import { CustomExercise } from '../components/CustomExercise';
import { ParamListBase, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '../navigator/Screens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IdiomaPlayApi from '../api/IdiomaPlayApi';
import CountDown from 'react-native-countdown-component';

import { colors } from '../theme/colors';
import { color } from 'react-native-elements/dist/helpers';
import { CustomExerciseHeader } from '../components/CustomExerciseHeader';
import Icon from 'react-native-vector-icons/Ionicons';


// TODO: mejorar tipos en el route
// interface Props {
//   finishLesson: () => void

// }



export const ExercisesScreen = ({route}:any) => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setcurrentExercise] = useState(0)
  const [failedExercises, setFailedExercises] = useState(0)
  const [duration, setDuration] = useState()
  const [clockRunning, setClockRunning] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [messageModal, setMessageModal] = useState("")
  const MAX_FAILED_EXERCISES = route.params.isExam? 4 : 2
  const [failedLesson, setfailedLesson] = useState(false)

  const getExercises = async () => {
    try {
      const respondLessons = await fetch(
        "https://tp-tdp2.herokuapp.com/lessons/" + route.params.lessonId
      );
      const exercises = await respondLessons.json();
      //console.log(exercises)
      setExercises(exercises.exercises)
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };

  const getExam = async () => {
    try {
      const respondLessons = await fetch(
        "https://tp-tdp2.herokuapp.com/exams/" + 1
      );
      const exercises = await respondLessons.json();
      console.log(exercises)
      setExercises(exercises.exercises)
      setDuration(exercises.examTimeInSeconds)
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };

  const failExercise = () => {
    finishExercise(true)
    setFailedExercises(failedExercises + 1)
  }


  const finishExercise = async (failed?: boolean) => {
    if(failedExercises >= MAX_FAILED_EXERCISES && failed){
      // Failed lesson
      setfailedLesson(true)
      if (route.params.isExam) {
        setMessageModal("No has logrado completar correctamente el examen, vuelve a intentarlo!")
      } else {
        setMessageModal("No has logrado completar correctamente la lección, vuelve a intentarlo!")
      }
      setShowModal(true)
    }else {
      if(currentExercise < exercises.length - 1){
        setcurrentExercise(currentExercise + 1)
      }
      else{
        try {
        const resp = await IdiomaPlayApi.post('/participations',
        {
          'userId': 1,
          'unitId': 1,
          'lessonId': route.params.isExam? undefined : route.params.lessonId,
          'examId': route.params.isExam? 1 : undefined,
          'correctExercises': 1
        })
        if (route.params.isExam){
          setMessageModal("Felicitaciones! Has completado el examen correctamente")
        } else {
          setMessageModal("Felicitaciones! Has completado la lección correctamente")
        }
        setShowModal(true)
        } catch (error) {
          console.error(error);
        }
      }
    }
    
  }

  useEffect(() => {
    if (route.params.isExam){
      getExam();
    } else {
      getExercises();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setClockRunning(false)
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <CustomExerciseHeader
      lives={MAX_FAILED_EXERCISES - failedExercises + 1}
      currentExercise={currentExercise + 1}
      maxExercises={exercises.length}
      // lives={0}
      // currentExercise={0}
      // maxExercises={0}
    >
      {duration && route.params.isExam && <CountDown
        until={duration}
        onFinish={() => {
          setMessageModal("Te has quedado sin tiempo");
          setShowModal(true);
        }}
        timeToShow={['M', 'S']}
        digitStyle={{backgroundColor: 'transparent'}}
        timeLabels={{m: '', s: ''}}
        separatorStyle={{color: colors.darkPrimary, fontSize:20}}
        showSeparator={true}
        digitTxtStyle={{color: colors.darkPrimary, fontSize:25}}
        running={clockRunning}
        size={20}
      />}
      <View style={homeStyles.container}>
        {exercises.length > 0 && 
          <CustomExercise 
            exercise={exercises[currentExercise]} 
            finishExercise={finishExercise}
            failExercise={failExercise}
            isExam={route.params.isExam}
          />}
      </View>
      <View style={homeStyles.spacer}/>
      
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
            height:Dimensions.get('window').height * 0.55,
            width:Dimensions.get('window').width * 0.8,
            alignItems:'center',
            justifyContent:'space-evenly',
            paddingHorizontal:20,
            paddingVertical:30},
            homeStyles.card]}>  
            {failedLesson
              ? <Icon name='sad-outline' size={90} color={colors.wrong}/>
              : <Icon name='happy-outline' size={90} color={colors.correct}/>
            }
            
            <Text style={{fontSize:23, color:colors.darkPrimary, textAlign:'center'}}>{messageModal}</Text>

            <TouchableOpacity
              style={[{ backgroundColor: colors.primary, width:'80%',height:50,justifyContent:'center',alignItems:'center' },homeStyles.card]}
              onPress={() => {
                navigation.navigate(Screens.home)
                setShowModal(false)
              }}>
              <Text style={{fontSize:20, fontWeight:'bold', color: 'white'}}>Volver a la unidad</Text>
            </TouchableOpacity>

          </View>

        </View>
      </Modal>
      
    </CustomExerciseHeader>
  )
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
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
  },
  cardTitle: {
    fontSize: 20
  },
  spacer: {
    height: 100
  }
})