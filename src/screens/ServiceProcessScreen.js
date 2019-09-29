import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Linking,
    Dimensions,
    ToastAndroid,
    Image,
} from "react-native";
import { Appbar, Card, Title, Paragraph, FAB, DefaultTheme } from 'react-native-paper';
import moment from "moment";
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps'

import ServiceProcessCall from '../components/ServiceProcessCall'
import ServiceProcessItem from '../components/ServiceProcessItem'
import NetworkUtil from '../network/NetworkUtil'
import GeolocationUtil from '../geolocation/GeolocationUtil'
import DatabaseUtil from "../database/DatabaseUtil";
import HandleBackButton from '../components/HandleBackButton'
import MarkerIcon from '../components/MarkerIcon'
import OrderUtil from "../utils/OrderUtil";

class ServiceProcessScreen extends Component {

    constructor(props) {
        super(props);

        const { userType } = DatabaseUtil.data.setting;
        const { car_laundry_arrival_time, laundry_done_time, car_laundry_gone_time, done_time, } = DatabaseUtil.data.order;
        const serviceProcessesList = [
            { id: 0, buttonVisible: userType == 3, time: car_laundry_arrival_time, title: 'Driver arrived at laundry', name: 'car_laundry_arrival_time', loading: false, },
            { id: 1, buttonVisible: userType == 3, time: laundry_done_time, title: 'Laundry is done', name: 'laundry_done_time', loading: false, },
            { id: 2, buttonVisible: userType == 3, time: car_laundry_gone_time, title: 'Driver took your clothes', name: 'car_laundry_gone_time', loading: false, },
            { id: 3, buttonVisible: userType == 1, time: done_time, title: 'Service is done', name: 'done_time', loading: false, },
        ];

        this.initState = {
            turnId: this._getTurnId(serviceProcessesList),
            serviceProcessesList,
            reloadFABVisible: false,
        };
        this.state = this.initState;
        this.screenWidth = Math.round(Dimensions.get('window').width);
        this.serviceProcessTimeout = null;

        const { user, driver, laundry, } = DatabaseUtil.data.order;
        this.otherUsers = [
            { value: user, iconName: 'person' },
            { value: driver, iconName: 'local-taxi' },
            { value: laundry, iconName: 'local-laundry-service' },
        ];
        this.otherUsers.splice(userType - 1, 1);
        
        this.props.screenProps.onMarkersListChanged([
            {latitude: user.latitude, longitude: user.longitude, iconName: 'person', active: false},
            {latitude: driver.latitude, longitude: driver.longitude, iconName: 'local-taxi', active: false},
            {latitude: laundry.latitude, longitude: laundry.longitude, iconName: 'local-laundry-service', active: false},
        ]);

        this.orderUtil = new OrderUtil();



        this._doneButtonPressed = this._doneButtonPressed.bind(this);
        this._updateOrder = this._updateOrder.bind(this);
    }

    componentDidMount = () => {
        this._getOrder();
        // this._getLocation();
    }

    componentWillUnmount = () => {
        clearTimeout(this.serviceProcessTimeout);
    }

    
    // _getLocation = () => {
    //     new GeolocationUtil().getLocation(
    //         ({latitude, longitude}) => {
    //             this.setState({
    //                 userLocation: {latitude, longitude},
    //             });
    //         }
    //     );

    // }

    _getOrder = () => {
        this.orderUtil.getOrderById(
            () => this.serviceProcessTimeout = setTimeout(this._getOrder, 15000),
            this._convertOrderToServiceProcess,
            () => {
                clearTimeout(this.serviceProcessTimeout);
                this.setState({
                    reloadFABVisible: true,
                });
            }
        );
    }

    _updateOrder = () => {
        this.orderUtil.updateOrder(
            this._convertOrderToServiceProcess,
            () => {}
        );
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
            const { car_laundry_arrival_time, laundry_done_time, car_laundry_gone_time, done_time, } = DatabaseUtil.data.order;

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
                clearTimeout(this.serviceProcessTimeout);

                let { userType } = DatabaseUtil.data.setting;
                if(userType == 1) {
                    DatabaseUtil.storeOrder();
                    this.props.navigation.navigate('Rating');
                }
                else {
                    DatabaseUtil.clearOrder();
                    this.props.screenProps.screenChange(0);
                    // this.props.navigation.navigate('HomeDriver');
                    // NetworkUtil.getOrderIfExists();
                }

                // this.setState(this.initState);

            }
            else DatabaseUtil.storeOrder();
            
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
        const {serviceProcessesList, turnId} = this.state;
        return serviceProcessesList.map(each => (
            <ServiceProcessItem
                key={each.id + '_eachServiceProcessItem'}
                id={each.id}
                title={each.title}
                turn={each.id <= turnId}
                doneIconVisible={each.id < turnId}
                buttonVisible={each.buttonVisible && (each.id >= turnId)}
                // loading={each.loading}
                onPress={this._doneButtonPressed}
                time={each.time === '' ? 'Pending...' : moment(each.time).fromNow()}
            />
        ));
    }

    _renderServiceCalls = () => {
        return (
            <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
                {this.otherUsers.map((each, index) => {
                    return(
                        <ServiceProcessCall
                            key={index + '_eachServiceProcessCall'}
                            phone={each.value.phone}
                            avatar={each.value.avatar}
                            iconName={each.iconName}
                            onPress={this._callButtonPressed}
                            style={{ marginLeft: index === 1 ? 10 : 0, }}
                        />
                    );
                })}
            </View>
        );
    }

    _renderCardIfNeeded = () => {
        const { driver, laundry, start_time, cost, } = DatabaseUtil.data.order;

        const leftValue = 10;

        return(
            <Card
            onPress={this._onPress}
            style={{
                position: 'absolute',
                top: leftValue + 55,
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
        );
    }

    _renderMarkers = () => {
        return this.otherUsers.map((each, index) => {
            const {latitude, longitude} = each.value;
            return(
                <Marker
                    key={index + '_EachUserMarker'}
                    coordinate={{
                        latitude: parseFloat(typeof latitude === 'string' ? latitude.replace(',', '.') : latitude),
                        longitude: parseFloat(typeof longitude === 'string' ? longitude.replace(',', '.') : longitude),
                    }}
                >
                    <MarkerIcon iconName={each.iconName} />
                </Marker>
            );
        });
    }

    render() {
        return (
            <HandleBackButton>
                <View style={{ flex: 1 }}>

                    <Appbar.Header>
                        {/* <View style={{ flexDirection: 'row', height: 40, marginLeft: 10 }}>
                        <Image
                            style={{ height: 40, width: 40 }}
                            source={require('../assets/imgs/logo.png')}
                        />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ color: 'white' }}>
                                Drivin'
                            </Text>
                            <Text style={{ marginTop: -5, color: 'white' }}>
                                Laundry
                        </Text>
                        </View>
                    </View> */}
                        <Appbar.Content
                            titleStyle={{ textAlign: 'center' }}//, paddingRight: 15
                            title="Service Process"
                        />
                        <Appbar.Action icon="settings" onPress={() => this.props.navigation.navigate('Settings')} />
                    </Appbar.Header>

                    
                    {/* <Image
                        style={styles.backgroundImage}
                        source={require('../assets/map.png')}
                    />  */}

                {/* <MapView
                    style={{ flex: 1 }}
                    showsUserLocation={true}
                    showsCompass={true}
                    rotateEnabled={false}
                // initialRegion={GeolocationUtil.userLocation}
                >

                    {this._renderMarkers()}

                 

                </MapView> */}

                    {this._renderCardIfNeeded()}

                    {this._renderReloadFAB()}

                </View>
            </HandleBackButton>

        );
    }
}
export { ServiceProcessScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch',
        width: null,
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