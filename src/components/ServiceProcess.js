import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Linking,
    Dimensions,
    ToastAndroid,
} from "react-native";
import { Card, Title, Paragraph, FAB, DefaultTheme } from 'react-native-paper';
import moment from "moment";
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import ServiceProcessCall from './ServiceProcessCall'
import ServiceProcessItem from './ServiceProcessItem'
import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from "../database/DatabaseUtil";

class ServiceProcess extends Component {

    constructor(props) {
        super(props);

        const { userType } = DatabaseUtil.data.setting;
        this.state = {
            turnId: 0,
            serviceProcessesList: [
                { id: 0, buttonVisible: userType == 3, time: '', title: 'Driver arrived at laundry', name: 'car_laundry_arrival_time', loading: false, },
                { id: 1, buttonVisible: userType == 3, time: '', title: 'Laundry is done', name: 'laundry_done_time', loading: false, },
                { id: 2, buttonVisible: userType == 3, time: '', title: 'Driver took your clothes', name: 'car_laundry_gone_time', loading: false, },
                { id: 3, buttonVisible: userType == 1, time: '', title: 'Service is done', name: 'done_time', loading: false, },
            ],
            reloadFABVisible: false,
        };
        this.screenWidth = Math.round(Dimensions.get('window').width);
        this.timeOut = null;


        this._renderServiceProcessItems = this._renderServiceProcessItems.bind(this);
        this._doneButtonPressed = this._doneButtonPressed.bind(this);
        this._updateOrder = this._updateOrder.bind(this);
    }

    componentDidMount = () => {
        this._getOrder();
    }

    _getOrder = () => {
        NetworkUtil.getOrderById(DatabaseUtil.data.order)
            .then((response) => {
                console.log(response);
                DatabaseUtil.setOrderFromResponse(response);
                if (DatabaseUtil.orderHasChanged()) {
                    this._convertOrderToServiceProcess();
                }

                this.timeOut = setTimeout(this._getOrder, 15000);
            })
            .catch((error) => {
                ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                this.setState({
                    reloadFABVisible: true,
                });
            });
    }

    _updateOrder = () => {
        NetworkUtil.updateOrder(DatabaseUtil.data.order)
            .then((response) => {
                DatabaseUtil.setOrderFromResponse(response);
                if (DatabaseUtil.orderHasChanged()) {
                    this._convertOrderToServiceProcess();
                }
            })
            .catch((error) => {
                ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
            });
    }

    _getTurnId = (serviceProcessesList) => {
        for (let i = 0; i < serviceProcessesList.length; i++) {
            if (serviceProcessesList[i].time == '') {
                return i;
            }
        }

        return 5;
    }

    _convertOrderToServiceProcess = () => {
        this.setState(state => {
            let serviceProcessesList = [...state.serviceProcessesList];
            const {
                car_laundry_arrival_time,
                laundry_done_time,
                car_laundry_gone_time,
                done_time,
            } = DatabaseUtil.data.order;

            serviceProcessesList[0].time = car_laundry_arrival_time;
            serviceProcessesList[1].time = laundry_done_time;
            serviceProcessesList[2].time = car_laundry_gone_time;
            serviceProcessesList[3].time = done_time;

            let turnId = this._getTurnId(serviceProcessesList);

            return {
                turnId,
                serviceProcessesList,
            };
        }, () => {
            if (this._isServiceDone()) {
                clearTimeout(this.timeOut);
                this.props.onDone();
            }
            
            DatabaseUtil.storeOrder();
        });
    }

    _isServiceDone = () => {
        return this.state.turnId == 5;
    }


    _callButtonPressed = (phone) => {
        Linking.openURL(`tel:${phone}`);
    }

    _doneButtonPressed = (id) => {
        const { turnId, serviceProcessesList } = this.state;

        for (let i = turnId; i <= id; i++) {
            DatabaseUtil.data.order[serviceProcessesList[i].name] = moment();
        }

        this._updateOrder();
    }

    _reloadFABPressed = () => {
        this.setState({
            reloadFABVisible: false,
        }, 
        this._getOrder);
    }

    _renderReloadFAB = () => {
        if (this.state.reloadFABVisible) {
            return (
                <FAB
                    color={DefaultTheme.colors.primary}
                    style={styles.reloadFAB}
                    icon={({ size, color }) => (
                        <Icon name={'reload'} size={size} color={color} />
                    )}
                    onPress={this._reloadFABPressed}
                />
            );
        }
    }

    _renderServiceProcessItems = () => {
        return this.state.serviceProcessesList.map(eachServiceProcessItem => (
            <ServiceProcessItem
                key={'eachServiceProcessItem_' + eachServiceProcessItem.id}
                id={eachServiceProcessItem.id}
                title={eachServiceProcessItem.title}
                turn={eachServiceProcessItem.id <= this.state.turnId}
                doneIconVisible={eachServiceProcessItem.id < this.state.turnId}
                buttonVisible={eachServiceProcessItem.buttonVisible && (eachServiceProcessItem.id >= this.state.turnId)}
                // loading={eachServiceProcessItem.loading}
                onPress={this._doneButtonPressed}
            />
        ));
    }

    _renderServiceCalls = () => {
        const { userType } = DatabaseUtil.data.setting;
        const {
            user,
            driver,
            laundry,
        } = DatabaseUtil.data.order;

        let users = [
            { type: user, iconName: 'person' },
            { type: driver, iconName: 'local-taxi' },
            { type: laundry, iconName: 'local-laundry-service' },
        ];
        users.splice(userType - 1, 1);

        return (
            <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
                <ServiceProcessCall
                    phone={users[0].type.phone}
                    avatar={users[0].type.avatar}
                    iconName={users[0].iconName}
                    onPress={this._callButtonPressed}
                />

                <ServiceProcessCall
                    phone={users[1].type.phone}
                    avatar={users[1].type.avatar}
                    iconName={users[1].iconName}
                    onPress={this._callButtonPressed}
                    style={{ marginLeft: 10, }}
                />
            </View>
        );
    }

    render() {
        const {
            driver,
            laundry,
            start_time,
            cost,
        } = DatabaseUtil.data.order;

        const leftValue = 10;

        return (
            <View style={styles.container}>
                <Card
                    onPress={this._onPress}
                    style={{
                        position: 'absolute',
                        top: leftValue,
                        left: leftValue,
                        width: this.screenWidth - (2 * leftValue),
                    }}
                >
                    <Card.Content>

                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <View>
                                <Title>Service Process</Title>
                                <Paragraph>{start_time}</Paragraph>
                            </View>

                            {this._renderServiceCalls()}
                        </View>

                        <View style={styles.processLine} />

                        {this._renderServiceProcessItems()}
                    </Card.Content>
                </Card>
                
                {this._renderReloadFAB()}

            </View>
        );
    }
}
export default ServiceProcess;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    processLine: {
        position: 'absolute',
        height: 165,
        width: 3,
        backgroundColor: 'black',
        left: 34,
        top: 115
    },
    reloadFAB: {
        position: 'absolute',
        bottom: 0,
        margin: 16,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
});