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
import { ActivityIndicator, Appbar, FAB, DefaultTheme, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import HandleBackButton from '../components/HandleBackButton'
import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'
import GeolocationUtil from '../geolocation/GeolocationUtil'
import ServiceProcess from '../components/ServiceProcess'
import OrderUtil from "../utils/OrderUtil";
import UserUtil from "../utils/UserUtil";
import MarkerIcon from '../components/MarkerIcon'

class HomeDriverScreen extends Component {
    state = {
        fabVisible: true,
        online: DatabaseUtil.data.setting.online,
        serviceProcessExists: false,
        reloadFABVisible: false,
    };

    timeOut = null;


    componentDidMount = () => {
        NetworkUtil.getOrderIfExists = this._reloadFABPressed;
        // this._getLocation();
        this._getOrderIfExists();
    }

    componentWillUnmount = () => {
        clearTimeout(this.timeOut);
    }

    // _getLocation = () => {
    //     new GeolocationUtil().getLocation(
    //         ({ latitude, longitude }) => {

    //             // new UserUtil().updateUserLocation(
    //             //     latitude, longitude,
    //             //     () => { },
    //             //     error => {
    //             //         console.log(error);
    //             //         this.setState({
    //             //             reloadFABVisible: true,
    //             //         });
    //             //     }
    //             // );
    //         }
    //     );

    // }


    _visibilityFABPressed = () => {
        new UserUtil().updateUserOnline(
            !this.state.online,
            online => {
                
                this.setState({ online, },
                    () => {
                        if (online) this._getOrderIfExists();
                        else clearTimeout(this.timeOut);
                    });

            },
            () => this.setState({ reloadFABVisible: true, }),
        );
    }

    _getOrderIfExists = () => {
        if (this.state.online) {
            new OrderUtil().getOrderByUserId(
                // () => this.props.navigation.navigate('ServiceProcess'),
                () => this.props.screenProps.screenChange(1),
                () => this.timeOut = setTimeout(this._getOrderIfExists, 15000),
                error => {
                    clearTimeout(this.timeOut);
                    this.setState({ reloadFABVisible: true, });
                }
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
            // this._getLocation();
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
                <View style={{ flex: 1,  alignItems: 'center', marginTop: 30 }}>
                    <Title>
                        Waiting for new task...
                    </Title>
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
                <View style={{ flex: 1 }}  pointerEvents="box-none">

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

                    <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                        <MarkerIcon pointerEvents="none" iconName={DatabaseUtil.data.setting.userType === 2 ? 'local-taxi' : 'local-laundry-service'} offset active />
                    </View>

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