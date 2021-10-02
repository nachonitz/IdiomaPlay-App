import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { CustomHeaderScreen } from '../components/CustomHeaderScreen'
import { styles } from '../theme/appTheme'
import { Card } from 'react-native-elements'
import { CustomExercise } from '../components/CustomExercise';
import { ParamListBase, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from '../navigator/Screens';

// TODO: mejorar tipos en el route
// interface Props {
//   finishLesson: () => void

// }

export const ExercisesScreen = ({route}:any) => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setcurrentExercise] = useState(0)

  const getExercises = async () => {
    try {
      const respondLessons = await fetch(
        "https://tp-tdp2.herokuapp.com/lessons/" + route.params.lessonId
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
      navigation.navigate(Screens.home)
      route.params.finishLesson()
    }
  }

  useEffect(() => {
    getExercises();
  }, []);

  return (
    <CustomHeaderScreen logo  back>
      <View style={homeStyles.container}>
        {exercises.length > 0 && 
          <CustomExercise 
            exercise={exercises[currentExercise]} 
            finishExercise={finishExercise}
          />}
      </View>
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
  cardDescription: {
    fontSize: 17,
    marginBottom: 15
  },
  cardSubtitle: {
    fontSize: 15,
    color: 'grey'
  }, 
  spacer: {
    height: 100
  }
})