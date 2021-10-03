import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { CustomHeaderScreen } from '../components/CustomHeaderScreen'
import { styles } from '../theme/appTheme'
import { Card } from 'react-native-elements'
import { CustomExercise } from '../components/CustomExercise';
import { ParamListBase, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '../navigator/Screens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// TODO: mejorar tipos en el route
// interface Props {
//   finishLesson: () => void

// }

export const ExercisesScreen = ({route}:any) => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setcurrentExercise] = useState(0)
  const {bottom} = useSafeAreaInsets()

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
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };


  const finishExercise = () => {
    if(currentExercise < exercises.length - 1){
      setcurrentExercise(currentExercise + 1)
    }else{
      route.params.finishLesson()
      navigation.navigate(Screens.home)
    }
  }

  useEffect(() => {
    if (route.params.isExam){
      getExam();
    } else {
      getExercises();
    }
  }, []);

  return (
    <CustomHeaderScreen back>
      <View style={homeStyles.container}>
        {exercises.length > 0 && 
          <CustomExercise 
            exercise={exercises[currentExercise]} 
            finishExercise={finishExercise}
          />}
      </View>
      <View style={homeStyles.spacer}/>
    </CustomHeaderScreen>
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