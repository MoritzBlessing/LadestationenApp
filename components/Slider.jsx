import Slider from '@react-native-community/slider';
import React, { useState, useEffect } from 'react';
import { Text, View} from 'react-native';

export default function Slide({ onValueChange }){

    const [SliderValue, setSliderValue] = useState(1);

    const handleValueChange = (value) => {
        setSliderValue(value);
        onValueChange(value); // Call the parent's callback function with the new value
    };

    return(
    <View style={{alignItems:"center", marginTop: 20}}>
        <Slider
            style={{width: 200, height: 40}}
            value={SliderValue}
            onValueChange={handleValueChange}
            minimumValue={0.5}
            maximumValue={10}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#909090"
            step={0.5}
        />      
        <Text>Radius: {SliderValue}km</Text>

    </View>
    
    );

}


