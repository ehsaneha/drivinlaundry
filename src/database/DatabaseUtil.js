import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native'

class DatabaseUtil {

    static _orderHasChanged = false;

    static storeData = async (key, value) => {
        try {
            return await AsyncStorage.setItem(key, value);
        } catch (e) {
            Alert.alert('error');
        }
    }

    static getData = async (key) => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (e) {
            Alert.alert('error');
        }
    }

    static clearSetting = () => {
        return DatabaseUtil.storeData('setting', '');
    }

    static storeSetting = () => {
        return DatabaseUtil.storeData('setting', JSON.stringify(DatabaseUtil.data.setting));
    }

    static getSetting = () => {
        return DatabaseUtil.getData('setting')
            .then(data => {
                let dataJson = JSON.parse(data);

                if(dataJson && dataJson.id > 0) {
                    DatabaseUtil.data.setting = dataJson;
                    return true;
                }

                return false;

            })
            .catch((error) => {
                console.error(error);
            });
    }

    static orderHasChanged = () => {
        if(DatabaseUtil._orderHasChanged) {
            DatabaseUtil._orderHasChanged = false;
            return true;
        }

        return false;
    }

    static setSettingFromResponse = ({ id, phone, name, password, avatar, type }) => {
        DatabaseUtil.data.setting = { id, phone, name, password, avatar, userType: type };
    }

    static setOrderFromResponse = ({ 
        id, 
        start_time, 
        car_laundry_arrival_time, 
        laundry_done_time, 
        car_laundry_gone_time, 
        done_time 
    }) => {

        if(DatabaseUtil.data.order.id != id ||
            DatabaseUtil.data.order.start_time != start_time ||
            DatabaseUtil.data.order.car_laundry_arrival_time != car_laundry_arrival_time ||
            DatabaseUtil.data.order.laundry_done_time != laundry_done_time ||
            DatabaseUtil.data.order.car_laundry_gone_time != car_laundry_gone_time ||
            DatabaseUtil.data.order.done_time != done_time) {
                DatabaseUtil._orderHasChanged = true;
            }

        DatabaseUtil.data.order.id = id;
        DatabaseUtil.data.order.start_time = start_time;
        DatabaseUtil.data.order.car_laundry_arrival_time = car_laundry_arrival_time;
        DatabaseUtil.data.order.laundry_done_time = laundry_done_time;
        DatabaseUtil.data.order.car_laundry_gone_time = car_laundry_gone_time;
        DatabaseUtil.data.order.done_time = done_time;
    }

    static data = {
        orders: [],
        order: {
            id: 0,
            clothings: {},
            time: { start: 0, end: 0, date: '' },
            location: { latitude: '', longitude: '' },
            driver: { id: 0, name: '', phone: '', avatar: '' },
            laundry: { id: 0, name: '', phone: '', avatar: '' },
            user: { id: 0, name: '', phone: '', avatar: '' },
            cost: 0,
            start_time: '',
            car_laundry_arrival_time: '',
            laundry_done_time: '',
            car_laundry_gone_time: '',
            done_time: '',
        },
        setting: {
            id: 0,
            name: 'ehsan3',
            phone: '+989397146334',
            avatar: 'avatar.jpeg',
            password: 'password',
            userType: 1,
        },
        drivers: [],
        laundries: [],
    }
}

export default DatabaseUtil;