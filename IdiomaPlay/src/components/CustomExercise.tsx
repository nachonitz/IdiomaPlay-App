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
import { CustomSnackBar } from './CustomSnackBar';

interface Props {
  exercise: Exercise
  isExam: boolean
  finishExercise: () => void
  failExercise: () => void
}

export const CustomExercise = ({exercise, isExam, finishExercise, failExercise}: Props) => {
  const [correct, setCorrect] = useState(-1)
  const [incorrect, setIncorrect] = useState(-1)
  const [fails, setFails] = useState(0)
  const [showMessage, setshowMessage] = useState(false)
  const [messageText, setmessageText] = useState('')

  const checkAnswer = (option: string, index: number) => {
    if (option.localeCompare(exercise.correctOption) === 0) {
      setshowMessage(true)
      setmessageText('Respuesta correcta!')
      setCorrect(index)
      setIncorrect(-1)
      setTimeout(() => {
        setshowMessage(false)
        finishExercise()
        
        // Clear exercise
        setCorrect(-1)
        setIncorrect(-1)
        setFails(0)
      }, 3000);
    } else {
      setIncorrect(index)
      if (isExam || fails > 0) {
        setshowMessage(true)
        setmessageText('Respuesta incorrecta')
        setTimeout(() => {
          
          failExercise()

          // Clear exercise
          setCorrect(-1)
          setIncorrect(-1)
          setFails(0)
          setshowMessage(false)
        }, 3000);
      }else{
        setFails(fails + 1)
        setshowMessage(true)
        setmessageText('Respuesta incorrecta, vuelve a intentarlo!')
        setTimeout(() => {
          setshowMessage(false)
        }, 3000);
      }
    }
  }

  return (
    <View style={homeStyles.container}>
      <CustomSnackBar visible={showMessage} message={messageText} error={incorrect != -1}/>
    
      <View style={homeStyles.titleContainer}>
        <Text style={homeStyles.title}>{exercise.title}</Text>
        <Text style={homeStyles.sentence}>{exercise.sentence.replace('*','__')}</Text>
      </View>

      {exercise.type == 'complete'
      ? (
        <View style={homeStyles.buttonsContainer}>
          <View style={homeStyles.answerRowContainer}>
            <TouchableOpacity onPress={() => {checkAnswer(exercise.options[0], 0)} } activeOpacity={0.8}>
              <Card containerStyle={[homeStyles.card, correct == 0 && homeStyles.cardCorrect, incorrect == 0 && homeStyles.cardIncorrect, {width: Dimensions.get('window').width*0.4}]}>
                <Text style={homeStyles.cardTitle}>{exercise.options[0]}</Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {checkAnswer(exercise.options[1], 1)} } activeOpacity={0.8}>
              <Card containerStyle={[homeStyles.card, correct == 1 && homeStyles.cardCorrect, incorrect == 1 && homeStyles.cardIncorrect, {width: Dimensions.get('window').width*0.4}]}>
              <Text style={homeStyles.cardTitle}>{exercise.options[1]}</Text>
              </Card>
            </TouchableOpacity>
          </View>

          <View style={homeStyles.answerRowContainer}>
            <TouchableOpacity onPress={() => {checkAnswer(exercise.options[2], 2)} } activeOpacity={0.8}>
              <Card containerStyle={[homeStyles.card, correct == 2 && homeStyles.cardCorrect, incorrect == 2 && homeStyles.cardIncorrect, {width: Dimensions.get('window').width*0.4}]}>
              <Text style={homeStyles.cardTitle}>{exercise.options[2]}</Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {checkAnswer(exercise.options[3], 3)} } activeOpacity={0.8}>
              <Card containerStyle={[homeStyles.card, correct == 3 && homeStyles.cardCorrect, incorrect == 3 && homeStyles.cardIncorrect, {width: Dimensions.get('window').width*0.4}]}>
              <Text style={homeStyles.cardTitle}>{exercise.options[3]}</Text>
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      )
      : (
        <View style={homeStyles.buttonsContainer}>
          <TouchableOpacity onPress={() => {checkAnswer(exercise.options[0], 0)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 0 && homeStyles.cardCorrect, incorrect == 0 && homeStyles.cardIncorrect]}>
            <Text style={homeStyles.cardTitle}>{exercise.options[0]}</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {checkAnswer(exercise.options[1], 1)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 1 && homeStyles.cardCorrect, incorrect == 1 && homeStyles.cardIncorrect]}>
            <Text style={homeStyles.cardTitle}>{exercise.options[1]}</Text>
            </Card>
          </TouchableOpacity>
        
          <TouchableOpacity onPress={() => {checkAnswer(exercise.options[2], 2)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 2 && homeStyles.cardCorrect, incorrect == 2 && homeStyles.cardIncorrect]}>
            <Text style={homeStyles.cardTitle}>{exercise.options[2]}</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {checkAnswer(exercise.options[3], 3)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 3 && homeStyles.cardCorrect, incorrect == 3 && homeStyles.cardIncorrect]}>
            <Text style={homeStyles.cardTitle}>{exercise.options[3]}</Text>
            </Card>
          </TouchableOpacity>
        
          <TouchableOpacity onPress={() => {checkAnswer(exercise.options[4], 4)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 4 && homeStyles.cardCorrect, incorrect == 4 && homeStyles.cardIncorrect]}>
            <Text style={homeStyles.cardTitle}>{exercise.options[4]}</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {checkAnswer(exercise.options[5], 5)} } activeOpacity={0.8}>
            <Card containerStyle={[homeStyles.card, correct == 5 && homeStyles.cardCorrect, incorrect == 5 && homeStyles.cardIncorrect]}>
            <Text style={homeStyles.cardTitle}>{exercise.options[5]}</Text>
            </Card>
          </TouchableOpacity>
        </View>
      )}

      <Text style={homeStyles.type}>{TypeToInstruction(exercise.type)}</Text>
    </View>
  )
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: Dimensions.get('window').height - 120,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    color: colors.darkPrimary,
    fontWeight: 'bold',
  },
  type: {
    marginTop: 30,
    fontSize: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    color: colors.darkPrimary
  },
  sentence: {
    marginTop: 30,
    fontSize: 23,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: 'bold',
    minHeight: 60,
  },
  titleContainer: {
    marginTop: 5,
    marginBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  answerRowContainer: {
    marginTop: 0,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 10
    
  },
  card: {
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
    justifyContent: 'center',
    alignItems: 'center'
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
    textAlign: 'center'
  },
  spacer: {
    height: 100
  }
})