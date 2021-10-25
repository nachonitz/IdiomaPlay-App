import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { CustomHeaderScreen } from "../components/CustomHeaderScreen";
import { styles } from "../theme/appTheme";
import { Card } from "react-native-elements";
import { ParamListBase, useNavigation } from "@react-navigation/core";
import { Screens } from "../navigator/Screens";
import { StackNavigationProp } from "@react-navigation/stack";
import IdiomaPlayApi from "../api/IdiomaPlayApi";
import { colors } from "../theme/colors";
import { config } from "../../Configuration";
import { VictoryPie } from "victory";
import { ProgressChart } from "react-native-chart-kit";

export const UnitsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [units, setUnits] = useState([]);
  const [unitsInfo, setUnitsInfo] = useState<Array<any>>([]);
  const [loading, setloading] = useState(false);

  const getUnits = async () => {
    try {
      setloading(true);
      const resp = await IdiomaPlayApi.get("/units", {
        params: {
          limit: 20,
        },
      });
      setUnits(resp.data.items);
      console.log(resp.data.items);
      const completed: Array<any> = [];
      const length = resp.data.items.length;
      const units = resp.data.items;
      for (var i = 0; i < length; i++) {
        const unitId = units[i].id;
        const dict = {
          unitId: unitId,
          completed: await checkCompletedUnit(unitId),
          numberOfLessons: await getUnitNumberOfLessons(unitId),
          completedLessons: await getUnitCompletedLessons(unitId),
        };
        completed.push(dict);
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
      setUnitsInfo(completed);
      setloading(false);
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };

  const checkCompletedUnit = async (unitId: number) => {
    try {
      const resp = await IdiomaPlayApi.get("/participations", {
        params: {
          unit: unitId,
          userId: 1,
        },
      });
      let exams = resp.data.items.filter(function (item: any) {
        return (
          item.exam !== null &&
          item.correctExercises >= config.passingAmountOfExcercisesPerExam
        );
      }).length;
      return exams >= 1;
    } catch (error) {
      console.error(error);
    }
  };

  const getUnitNumberOfLessons = async (unitId: number) => {
    try {
      const resp = await IdiomaPlayApi.get("/units/" + unitId, {});

      let numberOfLessons = resp.data.lessons.length;
      console.log(numberOfLessons);
      return numberOfLessons;
    } catch (error) {
      console.error(error);
    }
  };

  const getUnitCompletedLessons = async (unitId: number) => {
    try {
      const resp = await IdiomaPlayApi.get("/participations", {
        params: {
          unit: unitId,
          user: 1,
        },
      });

      let completedLessons = resp.data.items.filter(function (item: any) {
        console.log(item);
        return (
          item.exam == null &&
          item.correctExercises >= config.passingAmountOfExcercisesPerLesson
        );
      }).length;
      console.log(completedLessons);
      return completedLessons;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUnits();
  }, []);

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      getUnits();
    });
    return subscribe;
  }, [navigation]);

  return (
    <CustomHeaderScreen logo profile>
      <View style={homeStyles.container}>
        {loading && (
          <ActivityIndicator size={"large"} color={colors.lightPrimary} />
        )}
        {!loading && (
          <>
            {units.length > 0 &&
              unitsInfo.length > 0 &&
              units.map((unit: any, index) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(Screens.lessons, {
                      unitId: unit["id"],
                    });
                  }}
                  activeOpacity={0.8}
                  disabled={unitsInfo[index].completed}
                  key={unit.id}
                >
                  <Card
                    containerStyle={[
                      homeStyles.card,
                      unitsInfo[index].value && {
                        backgroundColor: colors.correct,
                      },
                      unitsInfo[index].completed && {
                        borderColor: colors.correct,
                        borderWidth: 2.5,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        ...homeStyles.cardTitle,
                        // color: unitsInfo[index].completed
                        //   ? "green"
                        //   : colors.darkPrimary,
                      }}
                    >
                      {unit.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 10,
                        justifyContent: "flex-start",
                      }}
                    >
                      <ProgressChart
                        data={[
                          unitsInfo[index].completedLessons /
                            unitsInfo[index].numberOfLessons,
                        ]}
                        width={55}
                        height={55}
                        radius={22}
                        chartConfig={{
                          backgroundGradientFrom: "white",
                          backgroundGradientTo: "white",
                          decimalPlaces: 2, // optional, defaults to 2dp
                          color: unitsInfo[index].completed
                            ? (opacity = 1) => colors.correct
                            : (opacity = 1) => `rgba(78, 195, 233, ${opacity})`,
                        }}
                        hideLegend={true}
                        strokeWidth={8}
                      />
                      <View
                        style={{
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          marginLeft: 20,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.darkPrimary,
                            fontWeight: "bold",
                          }}
                        >
                          {unitsInfo[index].completedLessons} {" de "}
                          {unitsInfo[index].numberOfLessons}{" "}
                          {"lecciones completas"}
                        </Text>
                        {unitsInfo[index].completedLessons ===
                          unitsInfo[index].numberOfLessons && (
                          <Text
                            style={{
                              color: colors.darkPrimary,
                              fontWeight: "bold",
                            }}
                          >
                            {unitsInfo[index].completed
                              ? "Examen aprobado"
                              : "Examen pendiente"}
                          </Text>
                        )}
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            <View style={homeStyles.spacer} />
          </>
        )}
      </View>
    </CustomHeaderScreen>
  );
};

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  card: {
    height: 130,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "lightgrey",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5.4,
    elevation: 9,
    marginBottom: 15,
    justifyContent: "flex-start",
  },
  cardTitle: {
    fontSize: 17,
    color: colors.darkPrimary,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 17,
    marginBottom: 15,
  },
  cardSubtitle: {
    fontSize: 15,
    color: "grey",
  },
  spacer: {
    height: 100,
  },
});
