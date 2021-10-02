import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Touchable, TouchableOpacity, Dimensions } from 'react-native';
import { CustomHeaderScreen } from './CustomHeaderScreen'
import { styles } from '../theme/appTheme'
import { Card } from 'react-native-elements'
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/core';
import { Screens } from '../navigator/Screens';
import { Exercise } from '../interface/AppInterface';
import { TypeToInstruction } from '../services/Dictionary';

interface Props {
  exercise: Exercise
  finishExercise: () => void
}

export const CustomExercise = ({exercise, finishExercise}: Props) => {
  const [correct, setCorrect] = useState(-1)
  const [incorrect, setIncorrect] = useState(-1)

  const checkAnswer = (option: string, index: number) => {
    if (option.localeCompare(exercise.correctOption) === 0) {
      setCorrect(index)
      setIncorrect(-1)
      setTimeout(() => {
        finishExercise()
        setCorrect(-1)
        setIncorrect(-1)
      }, 1000);
    } else {
      setIncorrect(index)
    }
  }

  return (
    <View style={homeStyles.container}>
    
      <View style={homeStyles.titleContainer}>
        <Text style={homeStyles.title}>{exercise.title}</Text>
        <Text style={homeStyles.type}>{TypeToInstruction(exercise.type)}</Text>
        <Text style={homeStyles.sentence}>{exercise.sentence.replace('*','__')}</Text>
      </View>

      <View style={homeStyles.buttonsContainer}>
        
        <View style={homeStyles.answerRowContainer}>
          <TouchableOpacity onPress={() => {checkAnswer(exercise.options[0], 0)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 0 && homeStyles.cardCorrect, incorrect == 0 && homeStyles.cardIncorrect]}>
              <Card.Title style={homeStyles.cardTitle}>{exercise.options[0]}</Card.Title>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {checkAnswer(exercise.options[1], 1)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 1 && homeStyles.cardCorrect, incorrect == 1 && homeStyles.cardIncorrect]}>
              <Card.Title style={homeStyles.cardTitle}>{exercise.options[1]}</Card.Title>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={homeStyles.answerRowContainer}>
          <TouchableOpacity onPress={() => {checkAnswer(exercise.options[2], 2)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 2 && homeStyles.cardCorrect, incorrect == 2 && homeStyles.cardIncorrect]}>
              <Card.Title style={homeStyles.cardTitle}>{exercise.options[2]}</Card.Title>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {checkAnswer(exercise.options[3], 3)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 3 && homeStyles.cardCorrect, incorrect == 3 && homeStyles.cardIncorrect]}>
              <Card.Title style={homeStyles.cardTitle}>{exercise.options[3]}</Card.Title>
            </Card>
          </TouchableOpacity>
        </View>

        {(exercise.type.localeCompare('translate_old_to_new') === 0 || exercise.type.localeCompare('translate_new_to_old') === 0) && <View style={homeStyles.answerRowContainer}>
          <TouchableOpacity onPress={() => {checkAnswer(exercise.options[4], 4)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 4 && homeStyles.cardCorrect, incorrect == 4 && homeStyles.cardIncorrect]}>
              <Card.Title style={homeStyles.cardTitle}>{exercise.options[4]}</Card.Title>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {checkAnswer(exercise.options[5], 5)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 5 && homeStyles.cardCorrect, incorrect == 5 && homeStyles.cardIncorrect]}>
              <Card.Title style={homeStyles.cardTitle}>{exercise.options[5]}</Card.Title>
            </Card>
          </TouchableOpacity>
        </View>}
      </View>
    </View>
  )
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: Dimensions.get('window').height - 110,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: colors.lightPrimary,
    fontWeight: 'bold'
  },
  type: {
    marginTop: 40,
    fontSize: 27,
    textAlign: 'center',
    color: colors.darkPrimary
  },
  sentence: {
    marginTop: 20,
    fontSize: 25,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: 'bold'
  },
  titleContainer: {
    marginTop: 0
  },
  answerRowContainer: {
    marginTop: 0,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 50,
    
  },
  card: {
    width: 180,
    height: 70,
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
    backgroundColor: colors.lightPrimary,
  },
  cardCorrect: {
    backgroundColor: colors.correct
  },
  cardIncorrect: {
    backgroundColor: colors.wrong
  },
  cardTitle: {
    fontSize: 18,
    color: colors.darkPrimary,
    fontWeight: 'bold',
  },
  spacer: {
    height: 100
  }
})