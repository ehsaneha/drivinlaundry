
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

    getCurrentPosition = (onSuccess, onFail) => {
        Geolocation.getCurrentPosition(
            ({coords}) => {
                if(coords.latitude === 0 && coords.longitude === 0) {
                    
                    new AlertSuccessOrExit().alert(
                        'Location Access Alert',
                        'Please turn on your GPS. this app can not continue working without it!',
                        () => this.getCurrentPosition(onSuccess, onFail)
                    );

                }
                else {
                    // GeolocationUtil.userLocation = {
                    //     latitude: coords.latitude,
                    //     longitude: coords.longitude,
                    //     latitudeDelta: 0.045,
                    //     longitudeDelta: 0.045,
                    // };


                    onSuccess(coords);

                }

            },
            error => {
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
    getUserCurrentLocation = () => {
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

    requestLocationPermission = (onSuccess, onFail) => {
        Permissions.request('location')
            .then(response => {
                
                if(response === 'authorized') {
                    GeolocationUtil.locationPermission = true;
                    onSuccess();
                    return;
                }


                new AlertSuccessOrExit().alert(
                    'Location Permission Alert',
                    'Please give us locatin permission. this app can not continue working without that!',
                    () => this.requestLocationPermission(onSuccess, onFail)
                );



            });
    }

    getLocationPermission = (onSuccess, onFail) => {
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

                this.requestLocationPermission(
                    () => this.getLocationPermission(onSuccess, onFail)
                );                
            });
    }

    
    getLocation = (onSuccess, onFail) => {
        // if(GeolocationUtil.userLocation) {
        //     onSuccess(GeolocationUtil.userLocation);
        //     return;
        // }

        this.getLocationPermission(
            () => this.getCurrentPosition(onSuccess)
        );
    }


}

export default GeolocationUtil;