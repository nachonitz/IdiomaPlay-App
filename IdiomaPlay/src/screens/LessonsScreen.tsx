import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { CustomHeaderScreen } from '../components/CustomHeaderScreen'
import { styles } from '../theme/appTheme'
import { Card } from 'react-native-elements'
import { ParamListBase, useNavigation } from '@react-navigation/core';
import { Screens } from '../navigator/Screens';
import { StackNavigationProp } from '@react-navigation/stack'
import IdiomaPlayApi from '../api/IdiomaPlayApi';
import { colors } from '../theme/colors';


export const LessonsScreen = ({route}:any) => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setcompletedLessons] = useState <Array<any>>([])
  const [completedExam, setCompletedExam] = useState(false)

  const getLessons = async () => {
    try {
      console.log(route.params.unitId)
      const resp = await IdiomaPlayApi.get('/units/' + route.params.unitId)
      setLessons(resp.data.lessons)
      console.log(resp.data.lessons)
      const completed: Array<any> = []
      const length = resp.data.lessons.length
      const lessons = resp.data.lessons;
      for(var i = 0; i < length; i++){
        const lessonId = lessons[i].id;
        const dict = {"lessonId":lessonId, "value":false}
        completed.push(dict)
      }
      try {
        const participationsResp = await IdiomaPlayApi.get('participations',
        {
          params: {
            'limit': 20,
            'page': 1,
            'user': 1,
            'unit': 1
          }
        }
        )
        console.log(participationsResp)
        const length = participationsResp.data.items.length
        const participations = participationsResp.data.items;
        console.log(participations)
        for (var i = 0; i < length; i++){
          const exam = participations[i].exam
          if (exam) {
            setCompletedExam(true)
            continue
          }
          const lessonId = participations[i].lesson.id
          const isCorrect = participations[i].correctExercises
          const index = completed.findIndex((element) => element.lessonId === lessonId)
          completed[index] = {"lessonId":lessonId, "value":true}
        }
      } catch (error) {
        console.error(error)
      }
      setcompletedLessons(completed)
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };

  useEffect(() => {
    getLessons();
  }, []);

  return (
    <CustomHeaderScreen logo  profile>
      <View style={homeStyles.container}>

      {lessons.length > 0 && completedLessons.length > 0 && lessons.map((lesson:any, index) => (
        <TouchableOpacity
          onPress={() => {
            navigation.replace(
              Screens.exercises, 
              { lessonId: lesson['id'],
                unitId: route.params.unitId
              }
            )}}
          activeOpacity={0.8}
          disabled={completedLessons[index].value}
          key={lesson.id}
        >
          <Card containerStyle={[homeStyles.card, completedLessons[index].value && {backgroundColor: colors.correct}]}>
            <Text style={homeStyles.cardTitle}>{lesson.title}</Text>
          </Card>
        </TouchableOpacity>
      ))}
        {lessons.length > 0 && completedLessons.length > 0 &&
        <TouchableOpacity
          onPress={() => {
            navigation.replace(
              Screens.exercises, 
              { lessonId: 1,
                isExam: true,
                unitId: route.params.unitId
              }
            )}}
          activeOpacity={0.8}
          disabled={completedLessons.findIndex((element) => element.value === false) !== -1 || completedExam}
        >
          <Card containerStyle={[homeStyles.card, {backgroundColor: completedExam?colors.correct: completedLessons.findIndex((element) => element.value === false) !== -1?'lightgrey' : colors.lightPrimary}]}>
            <Text style={homeStyles.cardTitle}>Test</Text>
          </Card>
        </TouchableOpacity>}
      
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
    height: 75,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'lightgrey',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5.4,
    elevation: 9,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22,
    color: colors.darkPrimary,
    fontWeight: 'bold',
    textAlign: 'center'
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