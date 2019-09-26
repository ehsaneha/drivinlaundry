
import ToastAndroid from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Permissions from 'react-native-permissions';

import AlertSuccessOrExit from '../components/AlertSuccessOrExit';

class GeolocationUtil {

    static userLocation = null;
    static locationPermission = null;

   /*  static requestLocationPermission = function () {
        return PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Location Access Permission',
                'message': 'Can this app access to your location?'
            }
        );
    } */

    static getCurrentPosition = (onSuccess, onFail) => {
        Geolocation.getCurrentPosition(
            ({coords}) => {
                if(coords.latitude === 0 && coords.longitude === 0) {
                    
                    AlertSuccessOrExit.alert(
                        'Location Access Alert',
                        'Please turn on your gps. this app can not continue working without that!',
                        GeolocationUtil.getCurrentPosition
                    );

                }
                else {
                    GeolocationUtil.userLocation = {
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        latitudeDelta: 0.045,
                        longitudeDelta: 0.045,
                    };

                    onSuccess(GeolocationUtil.userLocation)

                }

            },
            (error) => {
                console.log(error.code, error.message);
                ToastAndroid.show('Location Problem!', ToastAndroid.LONG);
            },
            { 
                enableHighAccuracy: true, 
                timeout: 15000, 
                maximumAge: 10000 
            }
        );
    }
/* 
    static getUserCurrentLocation = () => {
        return Permissions.check('location', { type: 'always' })
            .then(checkResponse => {

                if(checkResponse === 'authorized') {
                    return GeolocationUtil.getLocation()
                        .then(location => location);
                }

                Permissions.request('location')
                    .then(response => {
                        if(response === 'authorized') {
                            return GeolocationUtil.getLocation()
                                .then(location => location);
                        }

                        return null;
                    });

            });
    } */

    static requestLocationPermission = (onSuccess, onFail) => {
        Permissions.request('location')
            .then(response => {
                
                if(response === 'authorized') {
                    GeolocationUtil.locationPermission = true;
                    onSuccess();
                    return;
                }


                AlertSuccessOrExit.alert(
                    'Location Permission Alert',
                    'Please give us locatin permission. this app can not continue working without that!',
                    GeolocationUtil.requestLocationPermission
                );



            });
    }

    static getLocationPermission = (onSuccess, onFail) => {
        if(GeolocationUtil.locationPermission) {
            onSuccess();
            return;
        }

        Permissions.check('location', { type: 'always' })
            .then(checkResponse => {

                if(checkResponse === 'authorized') {
                    GeolocationUtil.locationPermission = true;
                    onSuccess();
                    return;
                }

                GeolocationUtil.requestLocationPermission(GeolocationUtil.getLocationPermission);                
            });
    }

    
    static getLocation = (onSuccess, onFail) => {
        if(GeolocationUtil.userLocation) {
            onSuccess(GeolocationUtil.userLocation);
            return;
        }

        GeolocationUtil.getLocationPermission(
            () => GeolocationUtil.getCurrentPosition(onSuccess)
        );
    }


}

export default GeolocationUtil;