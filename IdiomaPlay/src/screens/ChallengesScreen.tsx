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

export const ChallengesScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [challenges, setChallenges] = useState([]);
  const [challengesInfo, setChallengesInfo] = useState<Array<any>>([]);
  const [loading, setloading] = useState(false);

  const getChallenges = async () => {
    try {
      setloading(true);
      const resp = await IdiomaPlayApi.get("/challenges", {});
      setChallenges(resp.data.items);
      const completed: Array<any> = [];
      const length = resp.data.items.length;
      const challenges = resp.data.items;
      const currentChallengeId = await getCurrentChallengeId();
      for (var i = 0; i < length; i++) {
        const challengeId = challenges[i].id;
        const dict = {
          challengeId: challengeId,
          canJoinChallenge:
            currentChallengeId == challengeId || currentChallengeId == null,
          completed: false, //await checkCompletedUnit(challengeId),
          numberOfUnits: await getChallengeNumberOfUnits(challengeId),
          completedUnits: await getChallengeCompletedUnits(challengeId),
        };
        dict.completed = dict.numberOfUnits == dict.completedUnits;
        completed.push(dict);
      }
      setChallengesInfo(completed);
      setloading(false);
    } catch (error) {
      // setError(true);
      console.error(error);
    }
  };

  const getCurrentChallengeId = async () => {
    try {
      const resp = await IdiomaPlayApi.get("/users/" + 1, {});
      let challengeParticipation = resp.data.challengeParticipation;
      if (challengeParticipation == null) {
        return null;
      }
      if (challengeParticipation.isPassed) {
        return null;
      }
      return challengeParticipation.challenge.id;
    } catch (error) {
      console.error(error);
    }
  };

  const getChallengeNumberOfUnits = async (challengeId: number) => {
    try {
      const resp = await IdiomaPlayApi.get("/challenges/" + challengeId, {});

      let numberOfUnits = resp.data.units.length;
      console.log(numberOfUnits);
      return numberOfUnits;
    } catch (error) {
      console.error(error);
    }
  };

  const getChallengeCompletedUnits = async (challengeId: number) => {
    try {
      const resp = await IdiomaPlayApi.get("/participations", {
        params: {
          user: 1,
        },
      });

      let completedUnits = resp.data.items.filter(function (item: any) {
        console.log(item);
        return (
          item.unit.challenge.id == challengeId &&
          item.exam !== null &&
          item.correctExercises >= config.passingAmountOfExcercisesPerExam
        );
      }).length;
      console.log(completedUnits);
      return completedUnits;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChallenges();
  }, []);

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      getChallenges();
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
            {challenges.length > 0 &&
              challengesInfo.length > 0 &&
              challenges.map((challenge: any, index) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(Screens.units, {
                      challengeId: challenge["id"],
                    });
                  }}
                  activeOpacity={0.8}
                  disabled={
                    challengesInfo[index].completed ||
                    !challengesInfo[index].canJoinChallenge
                  }
                  key={challenge.id}
                >
                  <Card
                    containerStyle={[
                      homeStyles.card,
                      !challengesInfo[index].canJoinChallenge &&
                      !challengesInfo[index].completed
                        ? {
                            backgroundColor: "lightgray",
                          }
                        : {
                            backgroundColor: "white",
                          },
                      challengesInfo[index].completed && {
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
                      {challenge.title}
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
                          challengesInfo[index].completedUnits /
                            challengesInfo[index].numberOfUnits,
                        ]}
                        width={55}
                        height={55}
                        radius={22}
                        chartConfig={
                          !challengesInfo[index].canJoinChallenge &&
                          !challengesInfo[index].completed
                            ? {
                                backgroundGradientFrom: "lightgray",
                                backgroundGradientTo: "lightgray",
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: challengesInfo[index].completed
                                  ? (opacity = 1) => colors.correct
                                  : (opacity = 1) =>
                                      `rgba(78, 195, 233, ${opacity})`,
                              }
                            : {
                                backgroundGradientFrom: "white",
                                backgroundGradientTo: "white",
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: challengesInfo[index].completed
                                  ? (opacity = 1) => colors.correct
                                  : (opacity = 1) =>
                                      `rgba(78, 195, 233, ${opacity})`,
                              }
                        }
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
                          {challengesInfo[index].completedUnits} {" de "}
                          {challengesInfo[index].numberOfUnits}{" "}
                          {"unidades completas"}
                        </Text>
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
    height: 145,
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
