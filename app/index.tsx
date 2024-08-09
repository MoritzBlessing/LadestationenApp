import { Text, View, StyleSheet } from "react-native";
import React, {useState, useEffect} from "react";
import Header from "@/components/header";
import Map from "@/components/Map";
import Slide from "@/components/Slider";


export default function Index() {

  const [sliderValue, setSliderValue] = useState(1);

  const handleSliderValueChange = (value:number) => {
      setSliderValue(value);
  };


  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.MapContainer}>
        <Map radius={sliderValue}/>
      </View>
      <Slide onValueChange={handleSliderValueChange}/>
      
      
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
    },   
  MapContainer: {
    alignSelf: "center",
    marginVertical: "4%",
    height:"66%",
    width: "90%",
  },
});