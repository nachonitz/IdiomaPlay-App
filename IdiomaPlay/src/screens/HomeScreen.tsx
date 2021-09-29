import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { CustomHeaderScreen } from '../components/CustomHeaderScreen'
import { styles } from '../theme/appTheme'
import { Card } from 'react-native-elements'
import { ParamListBase, useNavigation } from '@react-navigation/core';
import { Screens } from '../navigator/Screens';
import { StackNavigationProp } from '@react-navigation/stack'


export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
  const [lessons, setLessons] = useState([]);

  const getLessons = async () => {
    try {
      const respondLessons = await fetch(
        "https://tp-tdp2.herokuapp.com/lessons"
      );
      const lessons = await respondLessons.json();
      console.log(lessons.items)
      setLessons(lessons.items)
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

      {lessons.length > 0 && lessons.map((lesson:any, index) => (
        <TouchableOpacity onPress={() => {navigation.navigate(Screens.exercises, { lessonId: lesson['id']})}} activeOpacity={0.8}>
          <Card containerStyle={homeStyles.card}>
            <Card.Title style={homeStyles.cardTitle}>{lesson.title}</Card.Title>
            <Card.Divider/>
            <Text style={homeStyles.cardDescription}>Descripción de la lección</Text>
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