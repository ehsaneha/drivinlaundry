import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    BackHandler,
    ToastAndroid,
    Image,
} from "react-native";
import { ActivityIndicator, Appbar, FAB, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps'

import HandleBackButton from '../components/HandleBackButton'
import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'
import GeolocationUtil from '../geolocation/GeolocationUtil'
import ServiceProcess from '../components/ServiceProcess'

class HomeDriverScreen extends Component {
    state = {
        fabVisible: true,
        online: DatabaseUtil.data.setting.online,
        serviceProcessExists: false,
        reloadFABVisible: false,
    };

    timeOut = null;
    getLocationTimeOut = null;


    componentDidMount = () => {
        NetworkUtil.getOrderIfExists = this._reloadFABPressed;
        this._getLocation();
        this._getOrderIfExists();
    }

    _getLocation = () => {
        GeolocationUtil.checkLocationPermission()
            .then(isAutherized => {

                if (isAutherized) {
                    GeolocationUtil.getLocation(
                        ({coords}) => {
                            console.log(coords);

                            if(coords.latitude === 0 && coords.longitude === 0) {
                                ToastAndroid.show('Location Problem!', ToastAndroid.LONG);
                                this.getLocationTimeOut = setTimeout(this._getLocation, 5000);
                            }
                            else {
                                GeolocationUtil.userLocation = {
                                    latitude: coords.latitude,
                                    longitude: coords.longitude,
                                    latitudeDelta: 0.045,
                                    longitudeDelta: 0.045,
                                };

                                NetworkUtil.updateUserLocation(DatabaseUtil.data.setting, GeolocationUtil.userLocation)
                                    .catch((error) => {
                                        ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                                        this.setState({
                                            reloadFABVisible: true,
                                        });
                                    });
                                
                                clearTimeout(this.getLocationTimeOut);
                            }

                        },
                        (error) => {
                            console.log(error.code, error.message);
                            ToastAndroid.show('Location Problem!', ToastAndroid.LONG);
                            this.getLocationTimeOut = setTimeout(this._getLocation, 5000);
                        }
                    );
                }
                else ToastAndroid.show('Location Permission Problem!', ToastAndroid.LONG);
            });
    }


    _visibilityFABPressed = () => {
        const { setting } = DatabaseUtil.data;
        NetworkUtil.updateUserOnline(setting, !this.state.online)
            .then((online) => {
                DatabaseUtil.data.setting.online = online;

                DatabaseUtil.storeSetting()
                    .then(() => {

                        if (online) this._getOrderIfExists();
                        else clearTimeout(this.timeOut);


                        this.setState({
                            online,
                        });
                    });

            })
            .catch((error) => {
                ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                this.setState({
                    reloadFABVisible: true,
                });
            });
    }

    _getOrderIfExists = () => {
        if (this.state.online) {
            NetworkUtil.getOrderByUserId(DatabaseUtil.data.setting)
                .then((response) => {
                    if (response.id > 0) {
                        DatabaseUtil.setOrderFromResponse(response);

                        this.props.navigation.navigate('ServiceProcess');

                        // this.setState(prevState => {
                        //     state = { ...prevState };
                        //     state.serviceProcessExists = true;
                        //     state.fabVisible = false;
                        //     return state;
                        // });

                    }
                    else this.timeOut = setTimeout(this._getOrderIfExists, 15000);
                })
                .catch((error) => {
                    ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                    clearTimeout(this.timeOut);
                    this.setState({
                        reloadFABVisible: true,
                    });
                });
        }
    }

    _onServiceProcessDone = () => {
        this.setState(prevState => {
            state = { ...prevState };
            state.serviceProcessExists = false;
            state.fabVisible = true;
            return state;
        });
        this._getOrderIfExists();
    }

    _renderServiceProcessIfExists = () => {
        if (this.state.serviceProcessExists) {
            return (
                <ServiceProcess
                    info={DatabaseUtil.data.order}
                    onDone={this._onServiceProcessDone}
                />
            );
        }
    }

    _renderFABIFNeeded = () => {
        const { online, fabVisible } = this.state;
        // if(fabVisible) {
        return (
            <FAB
                color={DefaultTheme.colors.primary}
                style={styles.fab}
                icon={online ? "visibility" : "visibility-off"}
                onPress={this._visibilityFABPressed}
            />
        );
        // }
    }

    _reloadFABPressed = () => {
        this.setState({
            reloadFABVisible: false,
        }, () => {
            this._getOrderIfExists();
            this._getLocation();
        });
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

    _renderActivityIndicatorIfNeeded = () => {
        const { online, reloadFABVisible } = this.state;
        if (!reloadFABVisible && online) {
            return (
                <View style={{ flex: 1, alignItems: 'center', marginTop: 200 }}>
                    <Text>
                        Waiting for new task...
                    </Text>
                    <ActivityIndicator
                        animating={true}
                        color={DefaultTheme.colors.primary}
                    />
                </View>
            );
        }
    }

    render() {
        return (
            <HandleBackButton>
                <View style={{ flex: 1 }}>

                    <Appbar.Header>
                        <View style={{ flexDirection: 'row', height: 40, marginLeft: 10 }}>
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
                        </View>
                        <Appbar.Content />
                        <Appbar.Action icon="settings" onPress={() => this.props.navigation.navigate('Settings')} />
                    </Appbar.Header>

                    {/* <Image
                        style={styles.backgroundImage}
                        source={require('../assets/map.png')}
                    /> */}

                    {this._renderActivityIndicatorIfNeeded()}

                    {this._renderFABIFNeeded()}

                    {this._renderReloadFAB()}

                </View>
            </HandleBackButton>
        );
    }
};

export { HomeDriverScreen };



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    fab: {
        backgroundColor: 'white',
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch',
        width: null,
    },
    reloadFAB: {
        position: 'absolute',
        bottom: 0,
        margin: 16,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
});