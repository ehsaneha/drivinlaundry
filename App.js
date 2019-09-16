import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    PermissionsAndroid,
    StyleSheet,
    StatusBar
} from 'react-native';
import { createAppContainer } from 'react-navigation'
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import MainNavigator from './src/navigators/MainNavigator'
// import MapView from 'react-native-maps'
// import Geolocation from 'react-native-geolocation-service';

// import Car from './src/components/Car'

const NavigatorAppContainer = createAppContainer(MainNavigator);

export default class App extends Component {
    render() {
        return (
            <PaperProvider>
                <StatusBar backgroundColor={DefaultTheme.colors.primary} barStyle="light-content" />
                <NavigatorAppContainer />
            </PaperProvider>
        );
    }
}







/*



  requestLocationPermission = async function () {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Example App',
          'message': 'Example App access to your location '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getUserCurrentLocation();
      } else {
        console.log("location permission denied")
        alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err)
    }
  }

  getUserCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);

        let userCurrentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.045,
          longitudeDelta: 0.045,
        };

        this.setState({ userCurrentLocation });
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  componentDidMount = () => {
    // this.findCoordinates();




  };




this.state = {
      userCurrentLocation: null
    };

     {
      latitude: 29.62848472,
      longitude: 52.51827648,
      latitudeDelta: 0.045,
      longitudeDelta: 0.045,
    }


    this.requestLocationPermission()





 <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        showsCompass={true}
        rotateEnabled={false}
        initialRegion={this.state.userCurrentLocation}
      >

        <Car car={{
          id: 'null',
          location: {
            latitude: 29.62548472,
            longitude: 52.51827648
          },
          heading: 320
        }} />


        <Car car={{
          id: 'null2',
          location: {
            latitude: 29.63116573,
            longitude: 52.51827648
          },
          heading: 300
        }} />




        <Car car={{
          id: 'null4',
          location: {
            latitude: 29.63046573,
            longitude: 52.52827648
          },
          heading: 200
        }} />




        <Car car={{
          id: 'null3',
          location: {
            latitude: 29.62806573,
            longitude: 52.50827648
          },
          heading: 350
        }} />


        <Car car={{
          id: 'null3',
          location: {
            latitude: 29.62756573,
            longitude: 52.51827648
          },
          heading: 150
        }} />


        <Car car={{
          id: 'null3',
          location: {
            latitude: 29.62546573,
            longitude: 52.52327648
          },
          heading: 50
        }} />

      </MapView> */
