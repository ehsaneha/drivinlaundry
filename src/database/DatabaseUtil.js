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

    static storeOrder = () => {
        return DatabaseUtil.storeData('order', JSON.stringify(DatabaseUtil.data.order));
    }

    static clearOrder = () => {
        DatabaseUtil.data.order = {
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
        };
        return DatabaseUtil.storeData('order', '');
    }

    static getOrder = () => {
        return DatabaseUtil.getData('order')
            .then(data => {
                let dataJson = JSON.parse(data);
                console.log(dataJson);

                if(dataJson && dataJson.id > 0) {
                    console.log(dataJson);
                    DatabaseUtil.data.order = dataJson;
                    return true;
                }

                return false;
            });
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
            });
    }

    static orderHasChanged = () => {
        if(DatabaseUtil._orderHasChanged) {
            DatabaseUtil._orderHasChanged = false;
            return true;
        }

        return false;
    }

    static setSettingFromResponse = ({ id, phone, name, password, avatar, type, cost }) => {
        DatabaseUtil.data.setting = { id, phone, name, password, avatar, userType: type, cost };
    }

    static setHistoryFromResponse = (clothings) => {
        clothings.forEach(eachOrder => {

            let order = [];
            eachOrder.forEach(eachClothing => {
                order.push({ id: eachClothing.id, type: eachClothing.type, count: eachClothing.count });
            });
            
            DatabaseUtil.data.history.push(order);
        });
    }

    static setOrderFromResponse = ({ 
            id, 
            start_time, 
            car_laundry_arrival_time, 
            laundry_done_time, 
            car_laundry_gone_time, 
            done_time 
    }) => {

        const {order} = DatabaseUtil.data;
        if(order.id != id || order.start_time != start_time ||
            order.car_laundry_arrival_time != car_laundry_arrival_time ||
            order.laundry_done_time != laundry_done_time ||
            order.car_laundry_gone_time != car_laundry_gone_time ||
            order.done_time != done_time) {
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
        history: [],
        order: {
            id: 0,
            clothings: {},
            time: { start: 0, end: 0, date: '' },
            location: { latitude: '', longitude: '' },
            driver: { id: 0, name: '', phone: '', avatar: '', cost: '' },
            laundry: { id: 0, name: '', phone: '', avatar: '', cost: '' },
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