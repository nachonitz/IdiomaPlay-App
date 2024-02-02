import { ParamListBase, useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../context/AuthContext";
import { useElapsedTime } from "use-elapsed-time";

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
  const [showModalTimeStore, setShowModalTimeStore] = useState(false);
  const [showModalLivesStore, setShowModalLivesStore] = useState(false);
  const [messageModal, setMessageModal] = useState("");
  const MAX_FAILED_EXERCISES = route.params.isExam ? 4 : 2;
  const [points, setPoints] = useState(0);
  const [failedLesson, setfailedLesson] = useState(false);
  const [participationID, setParticipationsID] = useState(-1);
  const [boughtTime, setBoughtTime] = useState(false);
  const [boughtLives, setBoughtLives] = useState(false);
  const [isShowingEarnPointsAnimation, setShowEarnPointsAnimation] =
    useState(false);
  const [showModalRetryUnit, setShowModalRetryUnit] = useState(false);
  const [showMessage, setshowMessage] = useState(false);
  const [messageText, setmessageText] = useState("");
  const [failedOption, setfailedOption] = useState(false);
  const context = useContext(AuthContext);
  const { elapsedTime } = useElapsedTime({ isPlaying: true });

  const startParticipation = async () => {
    try {
      const id = context.status == "authenticated" && context.id;
      // console.log(300 - duration)
      const participationResponse = await IdiomaPlayApi.post(
        "/participations",
        {
          userId: id,
          unitId: route.params.unitId,
          lessonId: route.params.isExam ? undefined : route.params.lessonId,
          examId: route.params.isExam ? route.params.examId : undefined,
          // examTime: route.params.isExam ? 300 - duration: undefined,
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
      const id = context.status == "authenticated" && context.id;
      const response = await IdiomaPlayApi.get("/users/" + id);
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
      const id = context.status == "authenticated" && context.id;
      const resp = await IdiomaPlayApi.patch("/users/" + id, {
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

  const buyLives = async (lives: number, requiredPoints: number) => {
    if (points < requiredPoints) return false;
    try {
      const id = context.status == "authenticated" && context.id;
      const resp = await IdiomaPlayApi.patch("/users/" + id, {
        points: points - requiredPoints,
      });
      getPoints();
      // setPoints(points - requiredPoints)
      setFailedExercises(failedExercises - lives);
      setBoughtLives(true);
      setfailedLesson(false);
    } catch (error) {
      console.error(error);
    }
  };

  const failExercise = () => {
    finishExercise(true);
    setFailedExercises(failedExercises + 1);
  };

  const finishExercise = async (failed?: boolean, isRetry?: boolean) => {
    console.log("FinishExercise");
    if (failedExercises >= MAX_FAILED_EXERCISES && failed) {
      console.log("Falló mas de lo permitido");
      // Failed lesson
      setfailedLesson(true);
      if (route.params.isExam) {
        // startParticipation();
        setMessageModal("Te has quedado sin vidas!");
      } else {
        setMessageModal(
          "No has logrado completar correctamente la lección, vuelve a intentarlo!"
        );
      }
      setShowModal(true);
      setClockRunning(false);
    } else {
      console.log("Sigue con vidas");
      if (!route.params.isExam && !failed) {
        console.log("No es examen y no fallo");
        if (!isRetry) setShowEarnPointsAnimation(true);
        const id = context.status == "authenticated" && context.id;
        const resp = await IdiomaPlayApi.patch(
          "/participations/" + participationID,
          {
            userId: id,
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
        console.log("Aumenta numero ejercicio");
        setcurrentExercise(currentExercise + 1);
      } else {
        if (route.params.isExam) {
          console.log("Termino el examen");
          const id = context.status == "authenticated" && context.id;
          console.log("ExamTime: ", Math.round(elapsedTime));
          const resp = await IdiomaPlayApi.post("/participations", {
            userId: id,
            unitId: route.params.unitId,
            lessonId: undefined,
            examId: route.params.examId,
            examTime: Math.round(elapsedTime),
            correctExercises: currentExercise + 1 - failedExercises,
          });
          console.log(resp.data);
          setMessageModal(
            "Felicitaciones! Has completado el examen correctamente"
          );
        } else {
          console.log("Termino la leccion");
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
      {/* {duration !== 0 && route.params.isExam && ( */}
      <View
        style={{
          position: "absolute",
          top: 40,
          justifyContent: "center",
          width: "100%",
        }}
      >
        <CountDown
          until={duration}
          onFinish={() => {
            setDuration(0);
            setMessageModal("Te has quedado sin tiempo!");
            setShowModal(true);
          }}
          timeToShow={["M", "S"]}
          digitStyle={{ backgroundColor: "transparent" }}
          timeLabels={{ m: "", s: "" }}
          separatorStyle={{ color: colors.darkPrimary, fontSize: 20 }}
          showSeparator={true}
          digitTxtStyle={{ color: colors.darkPrimary, fontSize: 25 }}
          running={clockRunning}
          size={14}
        />
      </View>
      {/* )} */}
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
                    setShowModalTimeStore(true);
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                  >
                    Comprar tiempo
                  </Text>
                </TouchableOpacity>
              )}

              {route.params.isExam &&
                !boughtLives &&
                failedExercises >= MAX_FAILED_EXERCISES && (
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
                      setShowModalLivesStore(true);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      Comprar vidas
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
                  if ((duration === 0 || failedLesson) && route.params.isExam) {
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
          visible={showModalTimeStore}
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
                  setShowModalTimeStore(false);
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
                disabled={points < 200}
                style={[
                  {
                    backgroundColor:
                      points < 200 ? "lightgrey" : colors.lightPrimary,
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
                  await buyTime(30, 200);
                  setShowModalTimeStore(false);
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
                disabled={points < 300}
                style={[
                  {
                    backgroundColor:
                      points < 300 ? "lightgrey" : colors.lightPrimary,
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
                  await buyTime(60, 300);
                  setShowModalTimeStore(false);
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
                disabled={points < 450}
                style={[
                  {
                    backgroundColor:
                      points < 450 ? "lightgrey" : colors.lightPrimary,
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
                  await buyTime(180, 450);
                  setShowModalTimeStore(false);
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModalLivesStore}
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
                  setShowModalLivesStore(false);
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
                disabled={points < 200}
                style={[
                  {
                    backgroundColor:
                      points < 200 ? "lightgrey" : colors.lightPrimary,
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
                  await buyLives(1, 200);
                  setShowModalLivesStore(false);
                  setClockRunning(true);
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
                  1 vida extra
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
                disabled={points < 250}
                style={[
                  {
                    backgroundColor:
                      points < 250 ? "lightgrey" : colors.lightPrimary,
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
                  await buyLives(2, 250);
                  setShowModalLivesStore(false);
                  setClockRunning(true);
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
                  2 vidas extra
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
                    250
                  </Text>

                  <Image
                    source={require("../assets/token.png")}
                    style={{ height: 22, width: 22, marginLeft: 5 }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={points < 300}
                style={[
                  {
                    backgroundColor:
                      points < 300 ? "lightgrey" : colors.lightPrimary,
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
                  await buyLives(5, 300);
                  setShowModalLivesStore(false);
                  setClockRunning(true);
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
                  5 vidas extra
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
                  -50%
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
                    600
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
