import React from 'react'
import { View, Text, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { CustomHeaderScreen } from '../components/CustomHeaderScreen'
import { styles } from '../theme/appTheme'
import { Card } from 'react-native-elements'


export const HomeScreen = () => {
  return (
    <CustomHeaderScreen logo  profile>
      <View style={homeStyles.container}>

      <TouchableOpacity activeOpacity={0.8}>
        <Card containerStyle={homeStyles.card}>
          <Card.Title style={homeStyles.cardTitle}>Lección 1</Card.Title>
          <Card.Divider/>
          <Text style={homeStyles.cardDescription}>Descripción de la lección</Text>
          <Text style={homeStyles.cardSubtitle}>Dificultad y puntaje</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8}>
        <Card containerStyle={homeStyles.card}>
          <Card.Title style={homeStyles.cardTitle}>Lección 2</Card.Title>
          <Card.Divider/>
          <Text style={homeStyles.cardDescription}>Descripción de la lección</Text>
          <Text style={homeStyles.cardSubtitle}>Dificultad y puntaje</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8}>
        <Card containerStyle={homeStyles.card}>
          <Card.Title style={homeStyles.cardTitle}>Lección 3</Card.Title>
          <Card.Divider/>
          <Text style={homeStyles.cardDescription}>Descripción de la lección</Text>
          <Text style={homeStyles.cardSubtitle}>Dificultad y puntaje</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8}>
        <Card containerStyle={homeStyles.card}>
          <Card.Title style={homeStyles.cardTitle}>Lección 4</Card.Title>
          <Card.Divider/>
          <Text style={homeStyles.cardDescription}>Descripción de la lección</Text>
          <Text style={homeStyles.cardSubtitle}>Dificultad y puntaje</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8}>
        <Card containerStyle={homeStyles.card}>
          <Card.Title style={homeStyles.cardTitle}>Lección 6</Card.Title>
          <Card.Divider/>
          <Text style={homeStyles.cardDescription}>Descripción de la lección</Text>
          <Text style={homeStyles.cardSubtitle}>Dificultad y puntaje</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8}>
        <Card containerStyle={homeStyles.card}>
          <Card.Title style={homeStyles.cardTitle}>Lección 7</Card.Title>
          <Card.Divider/>
          <Text style={homeStyles.cardDescription}>Descripción de la lección</Text>
          <Text style={homeStyles.cardSubtitle}>Dificultad y puntaje</Text>
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