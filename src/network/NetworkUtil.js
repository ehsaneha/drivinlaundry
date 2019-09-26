
import ToastAndroid from 'react-native';
import NetInfo from "@react-native-community/netinfo";

import AlertSuccessOrExit from '../components/AlertSuccessOrExit'

class NetworkUtil {

    // static serverUrl = 'http://10.0.3.2:800/';
    static serverUrl = 'http://ehsaneha.ir/';
    static apiUrl = 'api/';
    static avatarUrl = 'storage/';
    // static avatarUrl = 'storage/avatars/';

    static serviceProcessTimeout = null;
    static getOrderIfExists = null;


    static get = (url) => {//
        return fetch(NetworkUtil.serverUrl + url.replace('.', ','))
            .then(response => response.json())
            .then((responseJson) => {
                return responseJson;
            });
    }

    static postPut = (method, url, body) => {
        return fetch(NetworkUtil.serverUrl + url, {
            method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body).replace('.', ','),
        })
            .then(response => response.json())
            .then((responseJson) => {
                return responseJson;
            });
    }

    static getDrivers = (latitude, longitude, onSuccess, onFail) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.get(NetworkUtil.apiUrl + `getDrivers/${latitude}/${longitude}`)
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static getLaundries = (latitude, longitude, onSuccess, onFail) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.get(NetworkUtil.apiUrl + `getLaundries/${latitude}/${longitude}`)
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static createOrder = ({ start_time, driver, laundry, user, clothings, cost }, onSuccess, onFail ) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.postPut(
                    'POST',
                    NetworkUtil.apiUrl + 'createOrder',
                    {
                        start_time,
                        cost,
                        users: [driver.id, laundry.id, user.id],
                        clothings: JSON.stringify(clothings),
                    }
                )
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static updateOrder = ({ id, start_time, cost, car_laundry_arrival_time, laundry_done_time, car_laundry_gone_time, done_time }, onSuccess, onFail ) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.postPut(
                    'PUT',
                    NetworkUtil.apiUrl + 'updateOrder/' + id,
                    {
                        start_time,
                        cost,
                        car_laundry_arrival_time,
                        laundry_done_time,
                        car_laundry_gone_time,
                        done_time,
                    }
                )
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static getOrderById = ({ id }, onSuccess, onFail ) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.get(NetworkUtil.apiUrl + 'getOrderById/' + id)
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static getOrderByUserId = ({ id }, onSuccess, onFail ) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.get(NetworkUtil.apiUrl + 'getOrderByUserId/' + id)
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static uploadImage = ({ id }, image, onSuccess, onFail) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.postPut(
                    'POST',
                    NetworkUtil.apiUrl + 'uploadImage/' + id,
                    {
                        image: image.data,//'data:image/jpeg;base64,' + 
                    }
                )
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static getAvatarUri = (avatar, onSuccess, onFail) => {
        NetworkUtil.serverUrl + NetworkUtil.avatarUrl + avatar;
    }

    static createUser = ({ nameText, phoneText, passwordText, userType, cost }, onSuccess, onFail ) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.postPut(
                    'POST',
                    NetworkUtil.apiUrl + 'createUser',
                    {
                        phone: phoneText,
                        name: nameText,
                        password: passwordText,
                        userType,
                        cost,
                    }
                )
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static updateUser = ({ id, phoneText, nameText, passwordText, costText }, onSuccess, onFail ) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.postPut(
                    'PUT',
                    NetworkUtil.apiUrl + 'updateUser/' + id,
                    {
                        phone: phoneText,
                        name: nameText,
                        password: passwordText,
                        cost: costText,
                    }
                )
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static updateUserOnline = ({ id }, online, onSuccess, onFail) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.postPut(
                    'PUT',
                    NetworkUtil.apiUrl + 'updateUserOnline/' + id,
                    {
                        online,
                    }
                )
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static getUserByPhonePassword = ({ phoneText, passwordText }, onSuccess, onFail ) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.get(NetworkUtil.apiUrl + `getUserByPhonePassword/${phoneText}/${passwordText}`)
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static getAllClothingsOfOrdersByUserId = ({ id }, onSuccess, onFail ) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.get(NetworkUtil.apiUrl + `getAllClothingsOfOrdersByUserId/${id}`)
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static updateUserRating = (driverId, laundryId, driverRating, laundryRating, onSuccess, onFail) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.postPut(
                    'PUT',
                    NetworkUtil.apiUrl + `updateUserRating/${driverId}/${laundryId}`,
                    {
                        driverRating,
                        laundryRating,
                    }
                )
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static updateUserLocation = ({ id }, { latitude, longitude }, onSuccess, onFail ) => {
        NetworkUtil.getInternetConnection(
            () => {
                NetworkUtil.postPut(
                    'PUT',
                    NetworkUtil.apiUrl + `updateUserLocation/${id}`,
                    {
                        latitude,
                        longitude,
                    }
                )
                    .then(response => {
                        onSuccess(response);
                    })
                    .catch(error => {
                        console.log(error);
                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                        onFail(error);
                    });
            });
    }

    static getInternetConnection = (onSuccess) => {
        NetInfo.fetch()
            .then(state => {
                if (state.isConnected) {
                    if(onSuccess) onSuccess();
                }
                else new AlertSuccessOrExit().alert(
                        'Internet Connection Alert',
                        'Please connect to the internet!',
                        NetworkUtil.getInternetConnection
                    );
            });
    }

}

export default NetworkUtil;