import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
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
import Icon from "react-native-vector-icons/Ionicons";

export const LessonsScreen = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [lessons, setLessons] = useState([]);
  const [examId, setExamId] = useState(-1);
  const [completedLessons, setcompletedLessons] = useState<Array<any>>([]);
  const [completedExam, setCompletedExam] = useState(false);
  const [examOpportunities, setExamOpportunities] = useState(-1)

  const getLessons = async () => {
    try {
      console.log(route.params.unitId);
      const resp = await IdiomaPlayApi.get("/units/" + route.params.unitId);
      setExamId(resp.data.exam.id);
      setLessons(resp.data.lessons);
      console.log(resp.data.lessons);
      const completed: Array<any> = [];
      const length = resp.data.lessons.length;
      const lessons = resp.data.lessons;
      for (var i = 0; i < length; i++) {
        const lessonId = lessons[i].id;
        const dict = { lessonId: lessonId, value: false };
        completed.push(dict);
      }
      try {
        const participationsResp = await IdiomaPlayApi.get("participations", {
          params: {
            page: 1,
            user: 1,
            unit: route.params.unitId,
          },
        });
        console.log(participationsResp);
        const length = participationsResp.data.items.length;
        const participations = participationsResp.data.items;
        console.log(participations);
        for (var i = 0; i < length; i++) {
          const exam = participations[i].exam;
          if (exam) {
            const examId = participations[i].exam.id;
            const correctExercises = participations[i].correctExercises;
            if (correctExercises >= config.passingAmountOfExcercisesPerExam)
              setCompletedExam(true);
            continue;
          }
          const lessonId = participations[i].lesson.id;
          const correctExercises = participations[i].correctExercises;
          if (correctExercises >= config.passingAmountOfExcercisesPerLesson) {
            const index = completed.findIndex(
              (element) => element.lessonId === lessonId
            );
            completed[index] = { lessonId: lessonId, value: true };
          }
        }
      } catch (error) {
        console.error(error);
      }
      setcompletedLessons(completed);
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };

  const getExamOpportunities = async () => {
    try {
      const resp = await IdiomaPlayApi.get('participations/',
        {
          params: {
            page: 1,
            user: 1,
            unit: route.params.unitId,
          }
        }
      )
      const examParticipationsFailed = resp.data.items.filter(function(item:any){
        return ((item.exam !== null) && (item.correctExercises < config.passingAmountOfExcercisesPerExam));
      }).length
      console.log(examOpportunities)
      setExamOpportunities(3-examParticipationsFailed)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getLessons();
    getExamOpportunities();
  }, []);

  return (
    <CustomHeaderScreen logo profile>
      <View style={homeStyles.container}>
        {lessons.length > 0 &&
          completedLessons.length > 0 &&
          lessons.map((lesson: any, index) => (
            <TouchableOpacity
              onPress={() => {
                navigation.replace(Screens.exercises, {
                  lessonId: lesson["id"],
                  unitId: route.params.unitId,
                });
              }}
              activeOpacity={0.8}
              disabled={completedLessons[index].value}
              key={lesson.id}
            >
              <Card containerStyle={[homeStyles.card]}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // Fix harcoded width
                    width: 300,
                  }}
                >
                  <Text style={homeStyles.cardTitle}>{lesson.title}</Text>
                  {completedLessons[index].value && (
                    <Icon
                      name="checkmark-outline"
                      size={30}
                      color={colors.correct}
                    />
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "lightgrey",
          }}
        />
        {lessons.length > 0 && completedLessons.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              navigation.replace(Screens.exercises, {
                lessonId: 1,
                examId: examId,
                isExam: true,
                unitId: route.params.unitId,
              });
            }}
            activeOpacity={0.8}
            disabled={
              completedLessons.findIndex(
                (element) => element.value === false
              ) !== -1 || completedExam
            }
          >
            <Card
              containerStyle={[
                homeStyles.card,
                {
                  backgroundColor: completedExam
                    ? colors.correct
                    : completedLessons.findIndex(
                        (element) => element.value === false
                      ) !== -1
                    ? "lightgrey"
                    : colors.lightPrimary,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  // Fix harcoded width
                  width: 300,
                }}
              >
                <Text style={{ ...homeStyles.cardTitle, color: "white" }}>
                  Exam
                </Text>
                {!completedExam && examOpportunities !== -1 &&
                  !(
                    completedLessons.findIndex(
                      (element) => element.value === false
                    ) !== -1
                  ) && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Icon name="ellipse" size={25} color={"lightgrey"} />
                      <Icon name="ellipse" size={25} color={"lightgrey"} />
                      <Icon name="ellipse" size={25} color={"lightgrey"} />
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          position: "absolute",
                          width: "100%",
                        }}
                      >
                        <Icon
                          name="ellipse"
                          size={19}
                          color={examOpportunities > 0 ? colors.darkPrimary : "lightgray"}
                        />
                        <Icon
                          name="ellipse"
                          size={19}
                          color={examOpportunities > 1 ? colors.darkPrimary : "lightgray"}
                        />
                        <Icon
                          name="ellipse"
                          size={19}
                          color={examOpportunities > 2 ? colors.darkPrimary : "lightgray"}
                        />
                      </View>
                    </View>
                  )}
              </View>
              <View
                style={{
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {!completedExam &&
                  !(
                    completedLessons.findIndex(
                      (element) => element.value === false
                    ) !== -1
                  ) && (
                    <Text style={{ color: "white", fontStyle: "italic" }}>
                      ¡{examOpportunities} {examOpportunities > 1 ? "oportunidades restantes!": "oportunidad restante!"}
                    </Text>
                  )}
              </View>
            </Card>
          </TouchableOpacity>
        )}

        <View style={homeStyles.spacer} />
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
    height: 75,
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
    justifyContent: "center",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 18,
    color: colors.darkPrimary,
    fontWeight: "bold",
    textAlign: "left",
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
