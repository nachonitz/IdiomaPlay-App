import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { CustomHeaderScreen } from '../components/CustomHeaderScreen'
import { styles } from '../theme/appTheme'
import { Card } from 'react-native-elements'


export const ExercisesScreen = ({route}:any) => {
  const [exercises, setExercises] = useState([]);

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
    }r
  };

  useEffect(() => {
    getExercises();
  }, []);
  return (
    <CustomHeaderScreen logo  profile>
      <View style={homeStyles.container}>

      {exercises.length > 0 && exercises.map((exercise:any, index) => (
        <TouchableOpacity activeOpacity={0.8}>
          <Card containerStyle={homeStyles.card}>
            <Card.Title style={homeStyles.cardTitle}>{exercise.title}</Card.Title>
            <Card.Divider/>
            <Text style={homeStyles.cardDescription}>Descripción del ejercicio</Text>
            <Text style={homeStyles.cardSubtitle}>Dificultad y puntaje</Text>
          </Card>
        </TouchableOpacity>
      ))}
      
      <View style={homeStyles.spacer}/>
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