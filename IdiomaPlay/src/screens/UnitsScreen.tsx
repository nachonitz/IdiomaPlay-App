import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  Image,
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
import Icon from "react-native-vector-icons/Ionicons";
import ConfettiCannon from "react-native-confetti-cannon";
import { AuthContext } from "../context/AuthContext";

export const UnitsScreen = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [units, setUnits] = useState([]);
  const [unitsInfo, setUnitsInfo] = useState<Array<any>>([]);
  const [loading, setloading] = useState(false);
  const [finishedChallenge, setFinishedChallenge] = useState(false);
  const context = useContext(AuthContext);

  const getUnits = async () => {
    try {
      setloading(true);

      const resp = await IdiomaPlayApi.get(
        "/challenges/" + route.params.challengeId,
        {
          params: {
            limit: 20,
          },
        }
      );
      console.log(resp.data);
      setUnits(resp.data.units);
      const completed: Array<any> = [];
      const length = resp.data.units.length;
      const units = resp.data.units;
      let finishedAllUnits = true;
      for (var i = 0; i < length; i++) {
        const unitId = units[i].id;
        const dict = {
          unitId: unitId,
          completed: await checkCompletedUnit(unitId),
          numberOfLessons: await getUnitNumberOfLessons(unitId),
          completedLessons: await getUnitCompletedLessons(unitId),
        };
        if (dict.completed == false) {
          finishedAllUnits = false;
        }
        completed.push(dict);
      }
      setFinishedChallenge(finishedAllUnits);
      setUnitsInfo(completed);
      setloading(false);
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };

  const checkCompletedUnit = async (unitId: number) => {
    try {
      const id = context.status == "authenticated" && context.id;
      const resp = await IdiomaPlayApi.get("/participations", {
        params: {
          unit: unitId,
          userId: id,
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
      const id = context.status == "authenticated" && context.id;
      const resp = await IdiomaPlayApi.get("/participations", {
        params: {
          unit: unitId,
          user: id,
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
        <TouchableOpacity
          style={{
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate(Screens.challenges);
          }}
        >
          <Icon
            name="chevron-back-outline"
            size={25}
            color={colors.lightPrimary}
          />
          <Text
            style={{
              color: colors.lightPrimary,
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            Desafíos
          </Text>
        </TouchableOpacity>

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

        <Modal
          animationType="slide"
          transparent={true}
          visible={finishedChallenge}
          // onRequestClose={() => {
          //   navigation.navigate(Screens.home)
          // }}
        >
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              flex: 1,
              alignItems: "center",
            }}
          >
            <ConfettiCannon
              count={200}
              origin={{ x: -20, y: 0 }}
              fallSpeed={4000}
              fadeOut
              explosionSpeed={100}
            />
            <View
              style={[
                {
                  backgroundColor: "white",
                  height: Dimensions.get("window").height * 0.55,
                  width: Dimensions.get("window").width * 0.8,
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  paddingHorizontal: 20,
                  paddingVertical: 30,
                  borderWidth: 4,
                  borderColor: colors.correct,
                },
                homeStyles.cardModal,
              ]}
            >
              <Image
                source={require("../assets/troph2.png")}
                style={{ height: "30%", resizeMode: "contain" }}
              />
              <Text
                style={{
                  fontSize: 23,
                  color: colors.darkPrimary,
                  textAlign: "center",
                }}
              >
                Felicitaciones! Has completado el desafío correctamente
              </Text>
              <TouchableOpacity
                style={[
                  {
                    backgroundColor: colors.primary,
                    width: "80%",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  homeStyles.cardModal,
                ]}
                onPress={() => {
                  setFinishedChallenge(false);
                  navigation.replace(Screens.challenges);
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                >
                  Volver a los desafíos
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </CustomHeaderScreen>
  );
};

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  cardModal: {
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
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
