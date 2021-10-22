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


export const UnitsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
  const [units, setUnits] = useState([]);
  const [unitsInfo, setUnitsInfo] = useState <Array<any>>([])

  const getUnits = async () => {
    try {
      const resp = await IdiomaPlayApi.get('/units',
      { 
        params: {
          'limit': 20
        }
      }
    )
      setUnits(resp.data.items)
      console.log(resp.data.items)
      const completed: Array<any> = []
      const length = resp.data.items.length
      const units = resp.data.items;
      for(var i = 0; i < length; i++){
        const unitId = units[i].id;
        const dict = {"unitId":unitId, "completed":false, "numberOfLessons": await getUnitNumberOfLessons(unitId),"completedLessons": await getUnitCompletedLessons(unitId)}
        completed.push(dict)
      }

      //TODO: obtener unidades ya hechas y guardarlas en unitsInfo
      // try {
      //   const participationsResp = await IdiomaPlayApi.get('participations',
      //   {
      //     params: {
      //       'limit': 20,
      //       'page': 1,
      //       'user': 1,
      //       'unit': 1
      //     }
      //   }
      //   )
      //   const length = participationsResp.data.items.length
      //   const participations = participationsResp.data.items;
      //   console.log(participations)
      //   for (var i = 0; i < length; i++){
      //     const exam = participations[i].exam
      //     if (exam) {
      //       setCompletedExam(true)
      //       continue
      //     }
      //     const lessonId = participations[i].lesson.id
      //     const isCorrect = participations[i].correctExercises
      //     const index = completed.findIndex((element) => element.lessonId === lessonId)
      //     completed[index] = {"lessonId":lessonId, "value":true}
      //   }
      // } catch (error) {
      //   console.error(error)
      // }
      setUnitsInfo(completed)
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };

  const getUnitNumberOfLessons = async (unitId: number) => {
    try {
      const resp = await IdiomaPlayApi.get('/units/' + unitId,
      {
      }
      )

      let numberOfLessons = resp.data.lessons.length
      console.log(numberOfLessons)
      return numberOfLessons
    } catch (error) {
      console.error(error);
    }
  }

  const getUnitCompletedLessons = async (unitId: number) => {
    try {
      const resp = await IdiomaPlayApi.get('/participations',
      { 
        params: {
          'limit': 20,
          'unit': unitId,
          'userId': 1
        }
      }
      )

      let completedLessons = resp.data.items.filter(function(item:any){
        return item.exam == null;
      }).length;
      console.log(completedLessons)
      return completedLessons
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUnits();
  }, []);

  return (
    <CustomHeaderScreen logo  profile>
      <View style={homeStyles.container}>

      {units.length > 0 && unitsInfo.length > 0 && units.map((unit:any, index) => (
        <TouchableOpacity
          onPress={() => {
            navigation.replace(
              Screens.lessons, 
              { unitId: unit['id']
              }
            )}}
          activeOpacity={0.8}
          disabled={unitsInfo[index].value}
          key={unit.id}
        >
          <Card containerStyle={[homeStyles.card, unitsInfo[index].value && {backgroundColor: colors.correct}]}>
            <Text style={homeStyles.cardTitle}>{unit.title}</Text>
            <Text>{unitsInfo[index].completedLessons} de {unitsInfo[index].numberOfLessons}</Text>
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