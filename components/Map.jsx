import React, { useState, useEffect, useRef} from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Text, View, StyleSheet, ActivityIndicator, Button } from 'react-native';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { API_KEY_GOOGLEPLACES, API_KEY_OPENCHARGE } from '@/constants/Api-Keys';


export default function Map(props) {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]); 
  const mapRef = useRef(null);

  
  useEffect(() => { // Get the current location of the user when the component is mounted
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

      mapRef.current.animateToRegion({ // Animate to the new location
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.04*props.radius, // Adjust the zoom level based on the radius
        longitudeDelta: 0.025*props.radius,
      }, 1500);
    }

  }, [props.radius,location]); // When the radius or location changes, fetch new markers



  const fetchMarkers = async (radius) => {
    const API_KEY = API_KEY_OPENCHARGE;
    const apiUrl = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${location.coords.latitude}
                    &longitude=${location.coords.longitude}&distance=${radius}&key=${API_KEY}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setMarkers(data); // Set the fetched data as markers
    } catch (error) {
      console.error(error);
    }
  };

  //When a search result in the Google Places Autocomplete is clicked, set the location to the selected location
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

  if (errorMsg) { // If there is an error, display the error message
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  } else if (location) {
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
  }

  if (!location) { // If the location is not yet fetched, display a loading indicator
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
          key: API_KEY_GOOGLEPLACES,
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
        {markers.map((marker, index) => { // Map over the markers and create a Marker component for each one
          const connections = marker.Connections || [];
           // Display the power of each charger if available
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
