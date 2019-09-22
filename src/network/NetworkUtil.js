

class NetworkUtil {

    // static serverUrl = 'http://10.0.3.2:800/';
    static serverUrl = 'http://ehsaneha.ir/';
    static apiUrl = 'api/';
    static avatarUrl = 'storage/avatars/';

    static get = (url) => {//
        return fetch(NetworkUtil.serverUrl + url.replace('.', ','))//https://facebook.github.io/react-native/movies.json
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
    }

    static postPut = (method, url, body) => {
        console.log(url);
        return fetch(NetworkUtil.serverUrl + url, {
            method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body).replace('.', ','),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            });
    }

    static getDrivers = (latitude, longitude) => {
        return NetworkUtil.get(NetworkUtil.apiUrl + `getDrivers/${latitude}/${longitude}`)
    }

    static getLaundries = (latitude, longitude) => {
        return NetworkUtil.get(NetworkUtil.apiUrl + `getLaundries/${latitude}/${longitude}`)
    }

    static createOrder = (user_id, { start_time, driver, laundry, clothings, cost }) => {
        return NetworkUtil.postPut(
            'POST',
            NetworkUtil.apiUrl + 'createOrder',
            {
                start_time,
                cost,
                users: [driver.id, laundry.id, user_id],
                clothings: JSON.stringify(clothings),
            }
        );
    }

    static updateOrder = ({ id, start_time, cost, car_laundry_arrival_time, laundry_done_time, car_laundry_gone_time, done_time, }) => {
        return NetworkUtil.postPut(
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
        );
    }

    static getOrderById = ({ id }) => {
        return NetworkUtil.get(NetworkUtil.apiUrl + 'getOrderById/' + id);
    }

    static getOrderByUserId = ({ id }) => {
        return NetworkUtil.get(NetworkUtil.apiUrl + 'getOrderByUserId/' + id);
    }

    static uploadImage = ({ id }, image) => {
        return NetworkUtil.postPut(
            'POST',
            NetworkUtil.apiUrl + 'uploadImage/' + id,
            {
                image: image.data,//'data:image/jpeg;base64,' + 
            }
        );
    }

    static getAvatarUri = (avatar) => {
        return NetworkUtil.serverUrl + NetworkUtil.avatarUrl + avatar;
    }

    static createUser = ({ nameText, phoneText, passwordText, userType, cost }) => {
        return NetworkUtil.postPut(
            'POST',
            NetworkUtil.apiUrl + 'createUser',
            {
                phone: phoneText,
                name: nameText,
                password: passwordText,
                userType,
                cost,
            }
        );
    }

    static updateUser = ({ id, phoneText, nameText, passwordText, costText, }) => {
        return NetworkUtil.postPut(
            'PUT',
            NetworkUtil.apiUrl + 'updateUser/' + id,
            {
                phone: phoneText,
                name: nameText,
                password: passwordText,
                cost: costText,
            }
        );
    }

    static updateUserOnline = ({ id }, online) => {
        return NetworkUtil.postPut(
            'PUT',
            NetworkUtil.apiUrl + 'updateUserOnline/' + id,
            {
                online,
            }
        );
    }

    static getUserByPhonePassword = ({ phoneText, passwordText }) => {
        return NetworkUtil.get(NetworkUtil.apiUrl + `getUserByPhonePassword/${phoneText}/${passwordText}`);
    }

    static getAllClothingsOfOrdersByUserId = ({ id }) => {
        console.log(id);
        return NetworkUtil.get(NetworkUtil.apiUrl + `getAllClothingsOfOrdersByUserId/${id}`);
    }

    static updateUserRating = (driverId, laundryId, driverRating, laundryRating) => {
        return NetworkUtil.postPut(
            'PUT',
            NetworkUtil.apiUrl + `updateUserRating/${driverId}/${laundryId}`,
            {
                driverRating,
                laundryRating,
            }
        );
    }
}

export default NetworkUtil;