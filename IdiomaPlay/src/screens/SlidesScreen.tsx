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
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Slide {
  title: string;
  desc: string;
  img: ImageSourcePropType;
}

const items: Slide[] = [
  {
    title: "Bienvenido!",
    desc: "Hola, bienvenido a IdiomaPlay! Una aplicación en la que vas a poder aprender Inglés de la mejor manera... jugando!",
    img: require("../assets/languajes.png"),
  },
  {
    title: "Inicio de sesión",
    desc: "Para entrar a la aplicación solo basta con ingresar con tu cuenta de Google! Sencillo, rápido y seguro!",
    img: require("../assets/googleSlide.png"),
  },
  {
    title: "Primeros pasos",
    desc: "Elegí el desafió que más se adecue a tu nivel y completá todas las unidades para obtener tu recompensa! Dentro de cada unidad vas a encontrar una serie de lecciones con un examen final",
    img: require("../assets/challengesScreenshot.png"),
  },
  {
    title: "Recompensas",
    desc: "Al ir completando correctamente los ejercicios vas a sumar puntos, los cuales se pueden utilizar para comprar tiempo y vidas durante los exámenes!",
    img: require("../assets/storeScreenshot.png"),
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

  const slidesSeen = async () => {
    await AsyncStorage.getItem("slidesSeen").then((item) => {
      if (item == "true") {
        return true;
      }
      return false;
    });
  };

  const setSlidesAsSeen = async () => {
    const seen = await AsyncStorage.setItem("slidesSeen", "true");
  };

  useEffect(() => {
    // if (slidesSeen()) {
    //   navigation.navigate(Screens.welcome);
    // } else {
    //   setSlidesAsSeen();
    // }
  }, []);

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
        {index == 3 && (
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
