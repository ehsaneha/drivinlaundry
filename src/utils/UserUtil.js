
import {
    ToastAndroid,
} from 'react-native';

import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'

class UserUtil {

    getDrivers = (onSuccess, onFail) => {
        new NetworkUtil().getDrivers(
            DatabaseUtil.data.order.location,
            onSuccess,
            onFail
        );
    }

    getLaundries = (onSuccess, onFail) => {
        new NetworkUtil().getLaundries(
            DatabaseUtil.data.order.location,
            onSuccess,
            onFail
        );
    }

    clearSetting = () => DatabaseUtil.clearSetting()

    uploadImage = (image, onSuccess, onFail) => {
        let networkUtil = new NetworkUtil();
        networkUtil.uploadImage(
            DatabaseUtil.data.setting,
            image,
            avatar => {
                DatabaseUtil.data.setting.avatar = avatar;
                DatabaseUtil.storeSetting();

                onSuccess({ uri: networkUtil.getAvatarUri(avatar), cache: 'reload' });
            },
            onFail
        );
    }

    getAvatarUri = (avatar) => {
        return { uri: new NetworkUtil().getAvatarUri(avatar), cache: 'reload' }
    }

    createUser = ({ nameText, phoneText, passwordText, confirmPasswordText, userType, cost, termsOfServiceChecked }, onSuccess, onFail) => {
        if (this.validateSignUpInputs(phoneText, nameText, passwordText, confirmPasswordText, termsOfServiceChecked)) {
            new NetworkUtil().createUser(
                { nameText, phoneText, passwordText, userType, cost },
                response => {
                    if (response.id > -1) {
                        DatabaseUtil.setSettingFromResponse(response);
                        onSuccess(DatabaseUtil.data.setting.userType);
                    }
                    else {
                        ToastAndroid.show('This Phone number is already registered!', ToastAndroid.LONG);
                        onFail();
                    }
                },
                onFail
            );
        }
        else onFail();
    }

    updateUser = ({ id, phoneText, nameText, passwordText, costText, userType }, onSuccess, onFail) => {
        if (this.validateSettingInputs(phoneText, nameText, passwordText, costText, userType)) {
            new NetworkUtil().updateUser(
                { id, phoneText, nameText, passwordText, costText },
                response => {
                    if (response.id === -1) {
                        ToastAndroid.show('This Phone number is already registered!', ToastAndroid.LONG);
                        onFail();
                    }
                    else if (response.id > 0) {
                        DatabaseUtil.setSettingFromResponse(response);
                        onSuccess();
                    }

                },
                onFail
            );
        }
        else onFail();
    }

    updateUserOnline = (online, onSuccess, onFail) => {
        new NetworkUtil().updateUserOnline(
            DatabaseUtil.data.setting, 
            online,
            online => {
                DatabaseUtil.data.setting.online = online;

                DatabaseUtil.storeSetting();
                onSuccess(online);
            },
            onFail
        );
    }

    validateSignInInputs = (phoneText, passwordText) => {

        if (phoneText === '' || passwordText === '') {
            ToastAndroid.show('You should enter phone and password!', ToastAndroid.SHORT);
            return false;
        }


        return true;
    }

    validateSignUpInputs = (phoneText, nameText, passwordText, confirmPasswordText, termsOfServiceChecked) => {

        if (nameText === '' || phoneText === '' || passwordText === '' || confirmPasswordText === '') {
            ToastAndroid.show('You should fill all the inputs!', ToastAndroid.SHORT);
            return false;
        }

        if (passwordText !== confirmPasswordText) {
            ToastAndroid.show('Password and confirm password is not the same!', ToastAndroid.LONG);
            return false;
        }

        if(!termsOfServiceChecked) {
            ToastAndroid.show('You should accept terms of service!', ToastAndroid.LONG);
            return false;
        }


        return true;
    }

    validateSettingInputs = (phoneText, nameText, passwordText, costText, userType) => {

        if (nameText === '' || phoneText === '' || passwordText === '' || (userType !== 1 && costText === '')) {
            ToastAndroid.show('You should enter all the inputs!', ToastAndroid.SHORT);
            return false;
        }

        return true;
    }

    getUserByPhonePassword = ({ phoneText, passwordText }, onSuccess, onFail) => {

        if (this.validateSignInInputs(phoneText, passwordText)) {
            new NetworkUtil().getUserByPhonePassword(
                { phoneText, passwordText },
                response => {
                    if (response.id > -1) {
                        DatabaseUtil.setSettingFromResponse(response);
                        onSuccess(DatabaseUtil.data.setting.userType);
                    }
                    else {
                        ToastAndroid.show('Your Phone or Password was not correct!', ToastAndroid.SHORT);
                        onFail();
                    }
                },
                onFail
            );
        }
        else onFail();

    }


    updateUserRating = (driverRating, laundryRating, onSuccess, onFail) => {
        const { driver, laundry } = DatabaseUtil.data.order;

        new NetworkUtil().updateUserRating(
            driver.id, laundry.id, driverRating, laundryRating,
                () => {
                    DatabaseUtil.clearOrder();
                    onSuccess();
                    DatabaseUtil.reloadHistoryFunc();
                },
                onFail
            );
    }

    updateUserLocation = (latitude, longitude, onSuccess, onFail) => {
        new NetworkUtil().updateUserLocation(
            DatabaseUtil.data.setting, 
            latitude, 
            longitude,
            onSuccess,
            onFail
        );
    }


}

export default UserUtil;