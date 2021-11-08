import { ParamListBase, useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import CountDown from "react-native-countdown-component";
import Icon from "react-native-vector-icons/Ionicons";
import IdiomaPlayApi from "../api/IdiomaPlayApi";
import { CustomExercise } from "../components/CustomExercise";
import { CustomExerciseHeader } from "../components/CustomExerciseHeader";
import { CustomSnackBar } from "../components/CustomSnackBar";
import { Screens } from "../navigator/Screens";
import { colors } from "../theme/colors";

// TODO: mejorar tipos en el route
// interface Props {
//   finishLesson: () => void

// }

export const ExercisesScreen = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setcurrentExercise] = useState(0);
  const [failedExercises, setFailedExercises] = useState(0);
  const [duration, setDuration] = useState(0);
  const [clockRunning, setClockRunning] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalStore, setShowModalStore] = useState(false);
  const [messageModal, setMessageModal] = useState("");
  const MAX_FAILED_EXERCISES = route.params.isExam ? 4 : 2;
  const [points, setPoints] = useState(0);
  const [failedLesson, setfailedLesson] = useState(false);
  const [participationID, setParticipationsID] = useState(-1);
  const [boughtTime, setBoughtTime] = useState(false);
  const [isShowingEarnPointsAnimation, setShowEarnPointsAnimation] =
    useState(false);
  const [showModalRetryUnit, setShowModalRetryUnit] = useState(false);
  const [showMessage, setshowMessage] = useState(false);
  const [messageText, setmessageText] = useState("");
  const [failedOption, setfailedOption] = useState(false);

  const startParticipation = async () => {
    try {
      const participationResponse = await IdiomaPlayApi.post(
        "/participations",
        {
          userId: 1,
          unitId: route.params.unitId,
          lessonId: route.params.isExam ? undefined : route.params.lessonId,
          examId: route.params.isExam ? route.params.examId : undefined,
          correctExercises: 0,
        }
      );

      setParticipationsID(participationResponse.data.id);
    } catch (error) {
      console.error(error);
    }
  };

  const getExercises = async () => {
    try {
      const respondLessons = await fetch(
        "https://tp-tdp2.herokuapp.com/lessons/" + route.params.lessonId
      );
      const exercises = await respondLessons.json();
      //console.log(exercises)
      setExercises(exercises.exercises);
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };

  const getPoints = async () => {
    try {
      const response = await IdiomaPlayApi.get("/users/" + 1);
      const points = response.data.points;
      setPoints(points);
    } catch (error) {
      console.error(error);
    }
  };

  const getExam = async () => {
    try {
      const respondLessons = await fetch(
        "https://tp-tdp2.herokuapp.com/exams/" + route.params.examId
      );
      const exercises = await respondLessons.json();
      console.log(exercises);
      setExercises(exercises.exercises);
      setDuration(300);
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };

  const buyTime = async (time: number, requiredPoints: number) => {
    if (points < requiredPoints) return false;
    try {
      const resp = await IdiomaPlayApi.patch("/users/" + "1", {
        points: points - requiredPoints,
      });
      getPoints();
      // setPoints(points - requiredPoints)
      setDuration(time);
      setBoughtTime(true);
    } catch (error) {
      console.error(error);
    }
  };

  const failExercise = () => {
    finishExercise(true);
    setFailedExercises(failedExercises + 1);
  };

  const finishExercise = async (failed?: boolean, isRetry?: boolean) => {
    if (failedExercises >= MAX_FAILED_EXERCISES && failed) {
      // Failed lesson
      console.log("FALLO LECCION");
      setfailedLesson(true);
      if (route.params.isExam) {
        startParticipation();
        setMessageModal("No has logrado completar correctamente el examen!");
      } else {
        setMessageModal(
          "No has logrado completar correctamente la lección, vuelve a intentarlo!"
        );
      }
      setShowModal(true);
    } else {
      if (!route.params.isExam && !failed) {
        if (!isRetry) setShowEarnPointsAnimation(true);
        const resp = await IdiomaPlayApi.patch(
          "/participations/" + participationID,
          {
            userId: 1,
            unitId: route.params.unitId,
            lessonId: route.params.lessonId,
            examId: undefined,
            correctExercises: currentExercise + 1 - failedExercises,
            isRetry: isRetry,
          }
        );
        await getPoints();
      }
      if (currentExercise < exercises.length - 1) {
        setcurrentExercise(currentExercise + 1);
      } else {
        if (route.params.isExam) {
          const resp = await IdiomaPlayApi.post("/participations", {
            userId: 1,
            unitId: route.params.unitId,
            lessonId: undefined,
            examId: route.params.examId,
            correctExercises: currentExercise + 1 - failedExercises,
          });
          setMessageModal(
            "Felicitaciones! Has completado el examen correctamente"
          );
        } else {
          setMessageModal(
            "Felicitaciones! Has completado la lección correctamente"
          );
        }
        setShowModal(true);
      }
    }
  };

  const showExerciseFeedback = (message: string, failed: boolean) => {
    setmessageText(message);
    setfailedOption(failed);
    setshowMessage(true);

    setTimeout(() => {
      setshowMessage(false);
    }, 1500);
  };

  useEffect(() => {
    if (route.params.isExam) {
      getExam();
    } else {
      startParticipation();
      getExercises();
    }
    getPoints();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setClockRunning(false);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <CustomSnackBar
        visible={showMessage}
        message={messageText}
        error={failedOption}
      />
      <CustomExerciseHeader
        lives={MAX_FAILED_EXERCISES - failedExercises + 1}
        points={points}
        currentExercise={currentExercise + 1}
        maxExercises={exercises.length}
        unitId={route.params.unitId}
        isShowingEarnPointsAnimation={isShowingEarnPointsAnimation}
        setShowEarnPointsAnimation={setShowEarnPointsAnimation}
        // lives={0}
        // currentExercise={0}
        // maxExercises={0}
      >
        {duration !== 0 && route.params.isExam && (
          <CountDown
            until={duration}
            onFinish={() => {
              setDuration(0);
              setMessageModal("Te has quedado sin tiempo");
              setShowModal(true);
            }}
            timeToShow={["M", "S"]}
            digitStyle={{ backgroundColor: "transparent" }}
            timeLabels={{ m: "", s: "" }}
            separatorStyle={{ color: colors.darkPrimary, fontSize: 20 }}
            showSeparator={true}
            digitTxtStyle={{ color: colors.darkPrimary, fontSize: 25 }}
            running={clockRunning}
            size={20}
          />
        )}

        <View style={homeStyles.container}>
          {exercises.length > 0 && (
            <CustomExercise
              exercise={exercises[currentExercise]}
              finishExercise={finishExercise}
              showExerciseFeedback={showExerciseFeedback}
              failExercise={failExercise}
              isExam={route.params.isExam}
            />
          )}
        </View>
        <View style={homeStyles.spacer} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={showModalRetryUnit}
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
                  borderColor: colors.wrong,
                },
                homeStyles.card,
              ]}
            >
              <Icon name="sad-outline" size={90} color={colors.wrong} />

              <Text
                style={{
                  fontSize: 23,
                  color: colors.darkPrimary,
                  textAlign: "center",
                }}
              >
                Has fallado 3 veces el examen, tendrás que realizar la unidad
                nuevamente
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
                  homeStyles.card,
                ]}
                onPress={() => {
                  navigation.navigate(Screens.lessons, {
                    unitId: route.params.unitId,
                  });
                  setShowModalRetryUnit(false);
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                >
                  Volver a la unidad
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
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
                  borderColor:
                    failedLesson || (duration === 0 && route.params.isExam)
                      ? colors.wrong
                      : colors.correct,
                },
                homeStyles.card,
              ]}
            >
              {failedLesson || (duration === 0 && route.params.isExam) ? (
                <Icon name="sad-outline" size={90} color={colors.wrong} />
              ) : (
                <Icon name="happy-outline" size={90} color={colors.correct} />
              )}

              <Text
                style={{
                  fontSize: 23,
                  color: colors.darkPrimary,
                  textAlign: "center",
                }}
              >
                {messageModal}
              </Text>

              {route.params.isExam && !boughtTime && duration === 0 && (
                <TouchableOpacity
                  style={[
                    {
                      backgroundColor: colors.lightPrimary,
                      width: "80%",
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    homeStyles.card,
                  ]}
                  onPress={() => {
                    setShowModal(false);
                    setShowModalStore(true);
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                  >
                    Comprar tiempo
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  {
                    backgroundColor: colors.primary,
                    width:
                      route.params.isExam && !failedLesson && duration !== 0
                        ? "90%"
                        : "80%",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  homeStyles.card,
                ]}
                onPress={() => {
                  if (duration === 0 && route.params.isExam) {
                    startParticipation();
                  }
                  if (
                    route.params.isExam &&
                    (failedLesson || duration === 0) &&
                    route.params.examOpportunities === 1
                  ) {
                    setShowModal(false);
                    setShowModalRetryUnit(true);
                  } else {
                    if (
                      route.params.isExam &&
                      !failedLesson &&
                      duration !== 0
                    ) {
                      navigation.navigate(Screens.units);
                    } else {
                      navigation.navigate(Screens.lessons, {
                        unitId: route.params.unitId,
                      });
                    }
                    setShowModal(false);
                  }
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                >
                  Volver a{" "}
                  {route.params.isExam && !failedLesson && duration !== 0
                    ? "las unidades"
                    : "la unidad"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModalStore}
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
            <View
              style={[
                {
                  backgroundColor: "white",
                  height: Dimensions.get("window").height * 0.55,
                  width: Dimensions.get("window").width * 0.8,
                  alignItems: "center",
                  justifyContent: "space-around",
                  paddingHorizontal: 20,
                  paddingVertical: 30,
                  borderWidth: 4,
                  borderColor: colors.lightPrimary,
                },
                homeStyles.card,
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowModalStore(false);
                  setShowModal(true);
                }}
                activeOpacity={0.6}
                style={{ position: "absolute", top: 10, right: 10 }}
              >
                <Icon
                  name="close-circle-outline"
                  size={33}
                  color={"lightgrey"}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: colors.darkPrimary,
                  marginBottom: 20,
                }}
              >
                Tienda
              </Text>

              <TouchableOpacity
                style={[
                  {
                    backgroundColor: colors.lightPrimary,
                    width: "100%",
                    height: 60,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 12,
                  },
                  homeStyles.card,
                ]}
                onPress={async () => {
                  await buyTime(30, 10);
                  setShowModalStore(false);
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                >
                  30 segundos extra
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                  >
                    200
                  </Text>
                  <Image
                    source={require("../assets/token.png")}
                    style={{ height: 22, width: 22, marginLeft: 5 }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    backgroundColor: colors.lightPrimary,
                    width: "100%",
                    height: 60,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 12,
                  },
                  homeStyles.card,
                ]}
                onPress={async () => {
                  await buyTime(60, 20);
                  setShowModalStore(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                    marginLeft: 20,
                  }}
                >
                  1 minuto extra
                </Text>
                <Text
                  style={{
                    fontSize: 19,
                    fontWeight: "bold",
                    color: colors.correct,
                    transform: [{ rotate: "-40deg" }],
                    position: "absolute",
                    left: -2,
                    top: 7,
                  }}
                >
                  -25%
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: colors.correct,
                    }}
                  >
                    300
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "lightgrey",
                      position: "absolute",
                      top: -15,
                      left: 4,
                      textDecorationLine: "line-through",
                      textDecorationStyle: "solid",
                    }}
                  >
                    400
                  </Text>
                  <Image
                    source={require("../assets/token.png")}
                    style={{ height: 22, width: 22, marginLeft: 5 }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    backgroundColor: colors.lightPrimary,
                    width: "100%",
                    height: 60,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 12,
                  },
                  homeStyles.card,
                ]}
                onPress={async () => {
                  await buyTime(180, 30);
                  setShowModalStore(false);
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                >
                  3 minutos extra
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                  >
                    450
                  </Text>
                  <Image
                    source={require("../assets/token.png")}
                    style={{ height: 22, width: 22, marginLeft: 5 }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </CustomExerciseHeader>
    </>
  );
};

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  card: {
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
  cardTitle: {
    fontSize: 20,
  },
  spacer: {
    height: 100,
  },
});
