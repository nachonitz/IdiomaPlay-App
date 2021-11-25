import { ParamListBase, useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageSourcePropType,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Icon from "react-native-vector-icons/Ionicons";
import { Screens } from "../navigator/Screens";
import { colors } from "../theme/colors";

interface Slide {
  title: string;
  desc: string;
  img: ImageSourcePropType;
}

const items: Slide[] = [
  {
    title: "Welcome!",
    desc: "Ea et eu enim fugiat sunt reprehenderit sunt aute quis tempor ipsum cupidatat et.",
    img: require("../assets/languajes.png"),
  },
  {
    title: "Registration",
    desc: "Anim est quis elit proident magna quis cupidatat culpa labore Lorem ea. Exercitation mollit velit in aliquip tempor occaecat dolor minim amet dolor enim cillum excepteur. ",
    img: require("../assets/languajes.png"),
  },
  {
    title: "Let's get started",
    desc: "Ex amet duis amet nulla. Aliquip ea Lorem ea culpa consequat proident. Nulla tempor esse ad tempor sit amet Lorem. Velit ea labore aute pariatur commodo duis veniam enim.",
    img: require("../assets/languajes.png"),
  },
];

const screenWidth = Dimensions.get("screen").width;

export const SlidesScreen = () => {
  const [index, setindex] = useState(0);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const renderItem = (item: Slide) => {
    return (
      <View style={slidesStyles.itemContainer}>
        <Image source={item.img} style={slidesStyles.image} />
        <Text>{item.title}</Text>
        <Text style={slidesStyles.text}>{item.desc}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        data={items}
        renderItem={({ item }) => renderItem(item)}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        layout="default"
        onSnapToItem={(index) => {
          setindex(index);
          // if (index == 2) {
          //   fadeIn(800);
          // } else {
          //   fadeOut();
          // }
        }}
      />
      <Pagination
        dotsLength={items.length}
        activeDotIndex={index}
        dotStyle={slidesStyles.dots}
      />
      {index == 2 && (
        <TouchableOpacity
          style={slidesStyles.button}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate(Screens.welcome);
          }}
        >
          <Text>Start</Text>
          <Icon name="chevron-forward-outline" color="white" size={30} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const slidesStyles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: "stretch",
    marginBottom: 50,
  },
  text: {
    color: colors.darkPrimary,
  },
  container: {
    flex: 1,
  },
  footerContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  dots: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  spacer: {
    height: 30,
  },
});
