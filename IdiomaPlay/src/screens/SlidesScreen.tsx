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
    title: "Enregistrement",
    desc: "Anim est quis elit proident magna quis cupidatat culpa labore Lorem ea. Exercitation mollit velit in aliquip tempor occaecat dolor minim amet dolor enim cillum excepteur. ",
    img: require("../assets/googleSlide.png"),
  },
  {
    title: "Todo listo? Comencemos!",
    desc: "Ex amet duis amet nulla. Aliquip ea Lorem ea culpa consequat proident. Nulla tempor esse ad tempor sit amet Lorem. Velit ea labore aute pariatur commodo duis veniam enim.",
    img: require("../assets/thinking.jpeg"),
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
        <Text style={slidesStyles.title}>{item.title}</Text>
        <Text style={slidesStyles.text}>{item.desc}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate(Screens.welcome)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: 30,
        }}
      >
        <Text
          style={{
            ...slidesStyles.buttonText,
            color: colors.lightPrimary,
            fontSize: 16,
          }}
        >
          Omitir
        </Text>
        <Icon
          name="chevron-forward-outline"
          color={colors.lightPrimary}
          size={22}
        />
      </TouchableOpacity>
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

      <View style={slidesStyles.pagination}>
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
            <Text style={slidesStyles.buttonText}>Comenzar</Text>
            <Icon name="chevron-forward-outline" color="white" size={30} />
          </TouchableOpacity>
        )}
      </View>
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
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: screenWidth,
    maxHeight: "50%",
    resizeMode: "contain",
    marginBottom: 50,
  },
  text: {
    fontSize: 15,
    color: colors.darkPrimary,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 25,
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
    backgroundColor: colors.lightPrimary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: 150,
    height: 40,
    borderRadius: 7,
  },
  buttonText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "white",
  },
  spacer: {
    height: 30,
  },
});
