import React, { useState, useEffect, useRef} from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Text, View, StyleSheet, ActivityIndicator, Button } from 'react-native';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


export default function Map(props) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]); // Added state for 
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      fetchMarkers(props.radius);
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.04*props.radius,
        longitudeDelta: 0.025*props.radius,
      }, 1500);
    }

  }, [props.radius,location]);

  const fetchMarkers = async (radius) => {
    const API_KEY = "9f052d84-d9dc-407b-ac4f-b0749b78f59f";
    const apiUrl = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&distance=${radius}&key=${API_KEY}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setMarkers(data); // Set the fetched data as markers
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchResult = (details) => {
    if (details && details.geometry && details.geometry.location) {
      const { lat, lng } = details.geometry.location;
      setLocation({
        coords: {
          latitude: lat,
          longitude: lng,
        }
      });
    }
  };

  let latitude;
  let longitude;

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  } else if (location) {
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder='Search'
        fetchDetails={true}
        onPress={(data, details = null) => {
          handleSearchResult(details);
        }}
        query={{
          key: 'AIzaSyCk6iYmH4ca9rDhjYOLTWjKnP4_7cEF-R8',
          language: 'de',
        }}
        onFail={error => console.log(error)}
        styles={styles.search}
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker, index) => {
          const connections = marker.Connections || [];
          const description = connections.length > 0
            ? connections.map((conn, i) => `Charger ${i + 1}: ${conn.PowerKW ? `${conn.PowerKW} kW` : "No power info available"}`).join('\n')
            : "No chargers available";

          return (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.AddressInfo.Latitude,
                longitude: marker.AddressInfo.Longitude,
              }}
              title={marker.AddressInfo.Title}
              description={description}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    zIndex: 0,
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  search:{
      container: {
        position: 'absolute',
        margin: "1.5%",
        width: '97%',
        zIndex: 1,
      },
      textInput: {
        height: 40,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 16,
      },
  }
});
