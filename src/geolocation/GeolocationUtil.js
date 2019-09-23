

import Geolocation from 'react-native-geolocation-service';
import Permissions from 'react-native-permissions';

class GeolocationUtil {

   /*  static requestLocationPermission = function () {
        return PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Location Access Permission',
                'message': 'Can this app access to your location?'
            }
        );
    } */

    static getLocation = (successCallback, errorCallback) => {
        return Geolocation.getCurrentPosition(
            successCallback,
            errorCallback,
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
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

    static checkLocationPermission = () => {
        return Permissions.check('location', { type: 'always' })
            .then(checkResponse => {

                if(checkResponse === 'authorized') return true;

                Permissions.request('location')
                    .then(response => response === 'authorized');

            });
    }


}

export default GeolocationUtil;