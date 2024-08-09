import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text } from 'react-native';

const PlaceholderImage = require('../assets/images/Logo-removebg.png');

export default function Header() {
    return (
      <View style={styles.container}>
        <Image source={PlaceholderImage} style={styles.image} />
        <Text style={styles.text}>StationFinder</Text>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: "100%",
      height: "11%",
      backgroundColor: '#26877a',
      paddingTop: 40,
      paddingHorizontal: 30,
      
    },

    image: {
      width: 50,
      height: 50,
      borderRadius: 18,
      paddingEnd: 30,
    },
    text: {
        fontSize: 20,
        alignSelf: 'center',
        borderRadius: 18,
      },
  });