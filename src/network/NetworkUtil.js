
import {ToastAndroid} from 'react-native';
import NetInfo from "@react-native-community/netinfo";

import AlertSuccessOrExit from '../components/AlertSuccessOrExit'

class NetworkUtil {

    // serverUrl = 'http://10.0.3.2:800/';
    serverUrl = 'http://ehsaneha.ir/';
    apiUrl = 'api/';
    avatarUrl = 'storage/';
    // avatarUrl = 'storage/avatars/';

    static serviceProcessTimeout = null;
    static getOrderIfExists = null;


    get = (url, onSuccess, onFail) => {
        fetch(this.serverUrl + url.replace('.', ','))
            .then(response => response.json())
            .then(responseJson => onSuccess(responseJson))
            .catch(error => {
                console.log(error);
                ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                onFail(error);
            });
    }

    postPut = (method, url, body, onSuccess, onFail) => {
        fetch(this.serverUrl + url, 
            {
                method,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            .then(response => response.json())
            .then(responseJson => onSuccess(responseJson))
            .catch(error => {
                console.log(error);
                ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                onFail(error);
            });
    }

    getDrivers = ({latitude, longitude}, onSuccess, onFail) => {

        this.get(this.apiUrl + `getDrivers/${latitude}/${longitude}`,
            onSuccess,
            onFail
        );
    }

    getLaundries = ({latitude, longitude}, onSuccess, onFail) => {
        this.get(this.apiUrl + `getLaundries/${latitude}/${longitude}`,
            onSuccess,
            onFail
        );
    }

    createOrder = ({ start_time, driver, laundry, user, clothings, cost }, onSuccess, onFail) => {
        this.postPut(
            'POST',
            this.apiUrl + 'createOrder',
            {
                start_time,
                cost,
                users: [driver.id, laundry.id, user.id],
                clothings: JSON.stringify(clothings),
            },
            onSuccess,
            onFail
        );
    }

    updateOrder = ({ id, start_time, cost, car_laundry_arrival_time, laundry_done_time, car_laundry_gone_time, done_time }, onSuccess, onFail) => {
        this.postPut(
            'PUT',
            this.apiUrl + 'updateOrder/' + id,
            {
                start_time,
                cost,
                car_laundry_arrival_time,
                laundry_done_time,
                car_laundry_gone_time,
                done_time,
            },
            onSuccess,
            onFail
        );
    }

    getOrderById = (id, onSuccess, onFail) => {
        this.get(this.apiUrl + 'getOrderById/' + id,
            onSuccess,
            onFail
        );
    }

    getOrderByUserId = ({ id }, onSuccess, onFail) => {
        this.get(this.apiUrl + 'getOrderByUserId/' + id,
            onSuccess,
            onFail
        );
    }

    uploadImage = ({ id }, image, onSuccess, onFail) => {
        this.postPut(
            'POST',
            this.apiUrl + 'uploadImage/' + id,
            {
                image: image.data,//'data:image/jpeg;base64,' + 
            },
            onSuccess,
            onFail
        );
    }

    getAvatarUri = (avatar) => {
        return this.serverUrl + this.avatarUrl + avatar;
    }

    createUser = ({ nameText, phoneText, passwordText, userType, cost }, onSuccess, onFail) => {
        this.postPut(
            'POST',
            this.apiUrl + 'createUser',
            {
                phone: phoneText,
                name: nameText,
                password: passwordText,
                userType,
                cost,
            },
            onSuccess,
            onFail
        );
    }

    updateUser = ({ id, phoneText, nameText, passwordText, costText }, onSuccess, onFail) => {
        this.postPut(
            'PUT',
            this.apiUrl + 'updateUser/' + id,
            {
                phone: phoneText,
                name: nameText,
                password: passwordText,
                cost: costText,
            },
            onSuccess,
            onFail
        );
    }

    updateUserOnline = ({ id }, online, onSuccess, onFail) => {
        this.postPut(
            'PUT',
            this.apiUrl + 'updateUserOnline/' + id,
            {
                online,
            },
            onSuccess,
            onFail
        );
    }

    getUserByPhonePassword = ({ phoneText, passwordText }, onSuccess, onFail) => {
        this.getInternetConnection(
            () => 
                this.get(
                    this.apiUrl + `getUserByPhonePassword/${phoneText}/${passwordText}`,
                    onSuccess,
                    onFail
                )
        );
    }

    getAllClothingsOfOrdersByUserId = ({ id }, onSuccess, onFail) => {
        this.get(
            this.apiUrl + `getAllClothingsOfOrdersByUserId/${id}`,
            onSuccess,
            onFail
        );
    }

    updateUserRating = (driverId, laundryId, driverRating, laundryRating, onSuccess, onFail) => {
        this.postPut(
            'PUT',
            this.apiUrl + `updateUserRating/${driverId}/${laundryId}`,
            {
                driverRating,
                laundryRating,
            },
            onSuccess,
            onFail
        );
    }

    updateUserLocation = ({ id, latitude, longitude }, onSuccess, onFail) => {
        this.postPut(
            'PUT',
            this.apiUrl + `updateUserLocation/${id}`,
            {
                latitude,
                longitude,
            },
            onSuccess,
            onFail
        );
    }

    getInternetConnection = (onSuccess) => {
        NetInfo.fetch()
            .then(state => {
                if (state.isConnected) {
                    onSuccess();
                }
                else new AlertSuccessOrExit().alert(
                    'Internet Connection Alert',
                    'Please connect to the internet!',
                    () => this.getInternetConnection(onSuccess)
                );
            });
    }

}

export default NetworkUtil;