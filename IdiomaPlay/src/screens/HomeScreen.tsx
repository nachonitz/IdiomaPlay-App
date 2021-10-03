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


export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setcompletedLessons] = useState <Array<boolean>>([])

  const getLessons = async () => {
    try {
      const resp = await IdiomaPlayApi.get('/lessons',
      { 
        params: {
          'limit': 10
        }
      }
    )
      // const respondLessons = await fetch(
      //   "https://tp-tdp2.herokuapp.com/lessons"
      // );
      // const lessons = await respondLessons.json();
      //console.log(resp.data)
      setLessons(resp.data.items)
      const completed: Array<boolean> = []
      const length = resp.data.items.length

      for(var i = 0; i < length; i++){
        if(i == 0) {
          completed.push(false)
          continue
        }
        if(i < length - 1){
          completed.push(true)
        }
        else{
          completed.push(false)
        }
      }
      setcompletedLessons(completed)
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };

  const finishLesson = () => {
    var completed = completedLessons
    completed[0] = true
    setcompletedLessons(completed)
  }

  useEffect(() => {
    getLessons();
  }, []);

  return (
    <CustomHeaderScreen logo  profile>
      <View style={homeStyles.container}>

      {lessons.length > 0 && lessons.map((lesson:any, index) => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(
              Screens.exercises, 
              { lessonId: lesson['id'], 
                finishLesson: ()=> finishLesson()
              }
            )}}
          activeOpacity={0.8}
          disabled={completedLessons[index]}
          key={lesson.id}
        >
          <Card containerStyle={[homeStyles.card, completedLessons[index] && {backgroundColor: colors.correct}]}>
            <Text style={homeStyles.cardTitle}>{lesson.title}</Text>
          </Card>
        </TouchableOpacity>
      ))}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate(
              Screens.exercises, 
              { lessonId: 1, 
                finishLesson: ()=> console.log('termino el examen'),
                isExam: true
              }
            )}}
          activeOpacity={0.8}
          disabled={false}
        >
          <Card containerStyle={[homeStyles.card, {backgroundColor: colors.lightPrimary}]}>
            <Text style={homeStyles.cardTitle}>Test</Text>
          </Card>
        </TouchableOpacity>
      
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
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center'
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