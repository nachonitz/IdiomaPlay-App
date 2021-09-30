import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { CustomHeaderScreen } from './CustomHeaderScreen'
import { styles } from '../theme/appTheme'
import { Card } from 'react-native-elements'


export const Exercise = (props:any) => {
  const [exercise, setExercise] = useState();
  const [correct, setCorrect] = useState(-1)
  const [incorrect, setIncorrect] = useState(-1)

  const getExercises = async (props: any) => {
    try {
      const respondLessons = await fetch(
        "https://tp-tdp2.herokuapp.com/lessons/" + props.lessonId
      );
      const exercises = await respondLessons.json();
      console.log(exercises)
      setExercise(exercises.exercises)
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };

  const checkAnswer = (option: string, index: number) => {
    if (option.localeCompare(props.exercise.correctOption) == 0) {
      setCorrect(index)
      setIncorrect(-1)
    } else {
      setCorrect(-1)
      setIncorrect(index)
    }
  }

  useEffect(() => {
    setExercise(props.exercise)
  }, []);
  return (
      <View style={homeStyles.container}>

        <View style={{"marginTop": 50}}>
          <Text style={{"fontSize": 18, "textAlign": "center"}}>Completa la frase</Text>
        </View>
      
        <View style={homeStyles.titleContainer}>
          <Text style={homeStyles.title}>{props.exercise.title}</Text>
        </View>

        <View style={homeStyles.answerContainer}>
        {exercise && props.exercise.options.map((option:any, index: number) => (
          <TouchableOpacity onPress={() => {checkAnswer(option, index)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == index && homeStyles.cardCorrect, incorrect == index && homeStyles.cardIncorrect]}>
              <Card.Title style={homeStyles.cardTitle}>{option}</Card.Title>
            </Card>
          </TouchableOpacity>
        ))}
          <TouchableOpacity onPress={() => {checkAnswer("asd", 3)} } activeOpacity={0.8}>
              <Card containerStyle={[homeStyles.card, correct == 3 && homeStyles.cardCorrect, incorrect == 3 && homeStyles.cardIncorrect]}>
                <Card.Title style={homeStyles.cardTitle}>Hardcode 1</Card.Title>
              </Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {checkAnswer("asd", 4)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 4 && homeStyles.cardCorrect, incorrect == 4 && homeStyles.cardIncorrect]}>
              <Card.Title style={homeStyles.cardTitle}>Hardcode 2</Card.Title>
            </Card>
          </TouchableOpacity>
        </View>
      </View>
  )
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    color: 'blue'
  },
  titleContainer: {
    marginTop: 90,
  },
  answerContainer: {
    marginTop: 100,
    flexWrap: 'wrap', 
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  card: {
    width: 150,
    height: 60,
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
  cardCorrect: {
    backgroundColor: "green"
  },
  cardIncorrect: {
    backgroundColor: "red"
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