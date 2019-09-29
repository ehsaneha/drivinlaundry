import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
} from 'react-native';
import { Button, FAB, Avatar, DefaultTheme } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps'

import {
    ClothingSelectionScreen,
    TimeSelectionScreen,
    LocationSelectionScreen,
    CarSelectionScreen,
    LaundrySelectionScreen,
    OrderReciepeScreen,
    PaymentScreen,
} from '../screens'

import OrderSubViewNavigator from '../navigators/OrderSubViewNavigator'
import OrderPageIndicator from '../components/OrderPageIndicator'
import HandleBackButton from '../components/HandleBackButton'
import OrderUtil from '../utils/OrderUtil';
import MarkerIcon from '../components/MarkerIcon'
import MyNavigator from '../navigators/MyNavigator'
import GeolocationUtil from '../geolocation/GeolocationUtil'
import UserUtil from "../utils/UserUtil";
import DatabaseUtil from '../database/DatabaseUtil'

class OrderScreen extends Component {
    state = {
        eachPageMarkersList: [[], [], [], [], [], [], [],],
        currentScreenIndex: 0,
        location: null,
    };

    beforeNextFABPressedList = [];
    toggleOpacityList = [];


    screens = [
        { name: 'ClothingSelection', iconName: 'tshirt', ref: null },
        { name: 'TimeSelection', iconName: 'access-time', ref: null },
        { name: 'LocationSelection', iconName: 'location-on', ref: null },
        { name: 'CarSelection', iconName: 'local-taxi', ref: null },
        { name: 'LaundrySelection', iconName: 'local-laundry-service', ref: null },
        { name: 'OrderReciepe', iconName: 'shopping-cart', ref: null },
        { name: 'Payment', iconName: 'attach-money', ref: null },
    ];

    // static router = OrderSubViewNavigator.router;

    componentDidMount() {
    }

    // _updateUserLocation(latitude, longitude) {
    //     new UserUtil().updateUserLocation(
    //         latitude, longitude,
    //         response => { console.log(response); },
    //         error => {
    //             // this._updateUserLocation(latitude, longitude);
    //             console.log(error);
    //             // this.setState({
    //             //     reloadFABVisible: true,
    //             // });
    //         }
    //     );
    // }

    _getLocation = () => {
        new GeolocationUtil().getLocation(
            ({ latitude, longitude }) => {

                this.setState({
                    location: {
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003,
                    },
                });

                DatabaseUtil.data.setting.latitude = latitude;
                DatabaseUtil.data.setting.longitude = longitude;
                DatabaseUtil.data.order.location = { latitude, longitude };


                // this._updateUserLocation(latitude, longitude);
            }
        );

    }

    _nextFABPressed = () => {
        let subViewAllowsToGoNext = this.beforeNextFABPressedList[this.state.currentScreenIndex]();

        if (subViewAllowsToGoNext) {

            const { navigation } = this.props;
            this.setState({ currentScreenIndex: this.state.currentScreenIndex + 1 }, () => {

                if (this.state.currentScreenIndex < this.screens.length) {
                    // navigation.navigate(this.screens[this.state.currentScreenIndex].name);
                    this.activeIndex(this.state.currentScreenIndex);

                    if (this.state.currentScreenIndex === 2) this._getLocation();


                    // this.toggleOpacityList[this.state.currentScreenIndex - 1]();
                }
                else {
                    // const resetAction = StackActions.reset({
                    //     index: 0,
                    //     key: null,
                    //     actions: [NavigationActions.navigate({ routeName: 'Home' })],
                    //   });

                    //   navigation.dispatch(resetAction);
                    navigation.navigate('App');
                }
            });
        }


    }

    _backFABPressed = () => {
        if (this.state.currentScreenIndex === 0) {
            new OrderUtil().clearOrder();
            this.props.navigation.goBack(null);
        }
        else {
            this.setState({ currentScreenIndex: this.state.currentScreenIndex - 1 }, () => {
                this.activeIndex(this.state.currentScreenIndex);

                if (this.state.currentScreenIndex === 2) this._getLocation();
            });
        }



    }


    _onRegionChangeComplete({ latitude, longitude }) {
        if (this.state.currentScreenIndex === 2) {
            DatabaseUtil.data.setting.latitude = latitude;
            DatabaseUtil.data.setting.longitude = longitude;
            DatabaseUtil.data.order.location = { latitude, longitude };

            // this._updateUserLocation(latitude, longitude);
        }
    }

    _renderNextFAB = () => {
        if (this.state.currentScreenIndex < this.screens.length - 1) {
            return (
                <FAB
                    color={DefaultTheme.colors.primary}
                    style={styles.nextFAB}
                    icon="check"
                    onPress={this._nextFABPressed}
                />
            );
        }
    }

    _renderBackFAB = () => {
        return this.state.currentScreenIndex > 0 ?
            (
                <FAB
                    color={DefaultTheme.colors.primary}
                    style={styles.backFAB}
                    icon="arrow-back"
                    onPress={this._backFABPressed}
                />
            ) :
            (
                <FAB
                    color={DefaultTheme.colors.primary}
                    style={styles.backFAB}
                    icon="close"
                    onPress={this._backFABPressed}
                />
            );
    }
    /* 
        _renderSettingButton = () => {
            if (this.state.currentScreenIndex === 0) {
                return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Setting')} >
                        <Avatar.Icon
                            icon={({ size, color }) => (
                                <Icon name={'settings'} size={30} />
                            )}
                            style={{ backgroundColor: 'transparent', position: 'absolute' }}
                        />
                    </TouchableOpacity>
                );
            }
        } */


    _renderMarkers = () => {
        const { eachPageMarkersList, currentScreenIndex } = this.state;
        return eachPageMarkersList[currentScreenIndex].map((each, index) => {
            // if (index < 3) {
            if (each.latitude && each.longitude) {
                return (
                    <Marker
                        key={index + '_EachCarMarker'}
                        coordinate={{
                            latitude: parseFloat(each.latitude),
                            longitude: parseFloat(each.longitude),
                        }}
                    >
                        <MarkerIcon iconName={each.iconName} active={each.active} />
                    </Marker>
                );
            }
            // }
        });
    }

    _renderMapIfNeeded() {
        const { currentScreenIndex } = this.state;
        if (currentScreenIndex > 1 && currentScreenIndex < 5) {
            return (
                <MapView
                    style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, }}
                    showsUserLocation={true}
                    showsCompass={true}
                    rotateEnabled={false}
                    onRegionChangeComplete={region => this._onRegionChangeComplete(region)}
                    initialRegion={this.state.location}
                >

                    {this._renderMarkers()}


                </MapView>
            );
        }
    }


    render() {
        return (
            <HandleBackButton onPress={this._backFABPressed}>
                <View style={{ flex: 1 }}>

                    {this._renderMapIfNeeded()}

                    <MyNavigator
                        screensList={[
                            ClothingSelectionScreen,
                            TimeSelectionScreen,
                            LocationSelectionScreen,
                            CarSelectionScreen,
                            LaundrySelectionScreen,
                            OrderReciepeScreen,
                            PaymentScreen,
                        ]}
                        navigation={this.props.navigation}
                        index={this.state.currentScreenIndex}
                        screenProps={{
                            setBeforeNextFABPressed: beforeNextFABPressed => this.beforeNextFABPressedList[this.state.currentScreenIndex] = beforeNextFABPressed,
                            onMarkersListChanged: markersList => this.setState(
                                prevState => {
                                    state = { ...prevState };
                                    state.eachPageMarkersList[this.state.currentScreenIndex] = markersList;
                                    return state;
                                }
                            ),
                        }}
                    />
                    {/* 
                    <OrderSubViewNavigator
                        pointerEvents="none"
                        navigation={this.props.navigation}
                        screenProps={{
                            setBeforeNextFABPressed: beforeNextFABPressed => this.beforeNextFABPressedList[this.state.currentScreenIndex] = beforeNextFABPressed,
                            onMarkersListChanged: markersList => this.setState(
                                            prevState => { 
                                                state = {...prevState};
                                                state.eachPageMarkersList[this.state.currentScreenIndex] = markersList;
                                                return state;
                                            }
                                        ),
                            toggleOpacity: toggleOpacity => this.toggleOpacityList[this.state.currentScreenIndex] = toggleOpacity,
                        }}
                    /> */}

                    {/* {this._renderSettingButton()} */}

                    <OrderPageIndicator
                        screensList={this.screens}
                        onRef={activeIndex => this.activeIndex = activeIndex}
                    />



                    {this._renderNextFAB()}
                    {this._renderBackFAB()}

                </View>
            </HandleBackButton>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    nextFAB: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
    },
    backFAB: {
        position: 'absolute',
        margin: 16,
        bottom: 0,
        backgroundColor: 'white',
    },
});


export { OrderScreen }