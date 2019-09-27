
import {
    ToastAndroid,
} from 'react-native';

import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'

class OrderUtil {


    createOrder = (onSuccess, onFail) => {
        DatabaseUtil.data.order.user = DatabaseUtil.data.setting;
        new NetworkUtil().createOrder(
            DatabaseUtil.data.order,
            response => {
                DatabaseUtil.setOrderFromResponse(response);
                if (DatabaseUtil.orderHasChanged()) {

                    DatabaseUtil.storeOrder();
                   onSuccess();
                }
            },
            onFail
        );
    }

    updateOrder = (onSuccess, onFail) => {
        new NetworkUtil().updateOrder(
            DatabaseUtil.data.order,
            response => {
                DatabaseUtil.setOrderFromResponse(response);
                if (DatabaseUtil.orderHasChanged()) {
                    onSuccess();
                }
            },
            onFail
        );
    }

    getOrderById = (onSuccess, onSuccessOrderHasChanged, onFail) => {
        const { id } = DatabaseUtil.data.order;
        if(id > 0) {
            new NetworkUtil().getOrderById(
                id,
                response => {
                    console.log(response);
                    DatabaseUtil.setOrderFromResponse(response);
                    if (DatabaseUtil.orderHasChanged()) {
                        onSuccessOrderHasChanged();
                    }
                        
                    onSuccess();
                },
                onFail
            );
        }
    }

    getOrderByUserId = (onSuccess, onEmptyHistory, onFail) => {
        new NetworkUtil().getOrderByUserId(
            DatabaseUtil.data.setting,
            response => {
                if (response.id > 0) {
                    DatabaseUtil.setOrderFromResponse(response);
                    onSuccess();
                }
                else {
                    console.log(response);
                    onEmptyHistory();
                }
            },
            onFail
        );
    }

    getAllClothingsOfOrdersByUserId = (onSuccess, onFail) => {
        new NetworkUtil().getAllClothingsOfOrdersByUserId(
            DatabaseUtil.data.setting,
            response => {
                DatabaseUtil.setHistoryFromResponse(response);
                onSuccess(DatabaseUtil.data.history);
            },
            error => onFail(error)
        );
    }

    setClothings = (clothings) => {
        DatabaseUtil.data.order.clothings = clothings;
    }

    clearOrder = () => DatabaseUtil.clearOrder()



}

export default OrderUtil;