import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
} from 'react-native';
import { Button, FAB, Avatar, DefaultTheme } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps'

import {
    HomeDriverScreen,
    ServiceProcessScreen,
} from '../screens'

import HandleBackButton from '../components/HandleBackButton'
import MarkerIcon from '../components/MarkerIcon'
import MyNavigator from '../navigators/MyNavigator'
import DatabaseUtil from '../database/DatabaseUtil'
import UserUtil from "../utils/UserUtil";
import GeolocationUtil from '../geolocation/GeolocationUtil'

class DriverLaundryHomeScreen extends Component {


    constructor(props) {
        super(props);

        const { id } = DatabaseUtil.data.order;
        this.state = {
            markersList: [],
            currentScreenIndex: (id > 0 ? 1 : 0),
            userCurrentLocation: null,
            updateUserLocationFABvisible: false,
        };

        this.targetLocation = null;
    }

    componentDidMount() {
        if(this.state.currentScreenIndex === 0) {
            this._getLocation();
        }
    }

    _updateUserLocation() {
        new UserUtil().updateUserLocation(
            response => this.setState({ updateUserLocationFABvisible: false, }),
            error => {
                // this._updateUserLocation(latitude, longitude);
                console.log(error);
                // this.setState({
                //     reloadFABVisible: true,
                // });
            }
        );
    }


    _getLocation = () => {
        new GeolocationUtil().getLocation(
            ({ latitude, longitude }) => {

                this.setState({
                    userCurrentLocation: {
                        latitude,
                        longitude,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003,
                    },
                });

                DatabaseUtil.data.setting.latitude = latitude;
                DatabaseUtil.data.setting.longitude = longitude;
                this._updateUserLocation();

            }
        );

    }

    _onRegionChangeComplete({ latitude, longitude }) {
        const {currentScreenIndex, updateUserLocationFABvisible} = this.state;
        if (currentScreenIndex === 0 && !updateUserLocationFABvisible) {
            
            this.targetLocation = {
                latitude,
                longitude,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003,
            };

            this.setState({
                updateUserLocationFABvisible: true,
            });
        }
    }

    _updateUserLocationFABPressed() {
        const { latitude, longitude } = this.targetLocation;
        DatabaseUtil.data.setting.latitude = latitude;
        DatabaseUtil.data.setting.longitude = longitude;
        this._updateUserLocation();
    }

    _renderMarkers = () => {
        const { markersList, currentScreenIndex } = this.state;
        if (currentScreenIndex === 1) {
            return markersList.map((each, index) => {
                if (index < 3) {
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
            });
        }
    }

    _renderUserLocationFABIFNeeded = () => {
        const { updateUserLocationFABvisible } = this.state;
        if (updateUserLocationFABvisible) {
            return (
                <FAB
                    color={DefaultTheme.colors.primary}
                    style={styles.fab}
                    icon='check'
                    onPress={() => this._updateUserLocationFABPressed()}
                />
            );
        }
    }


    render() {
        return (
            <HandleBackButton>
                <View style={{ flex: 1, }}>

                    <MapView
                        style={styles.map}
                        showsUserLocation={true}
                        showsCompass={true}
                        rotateEnabled={false}
                        onRegionChangeComplete={region => {
                            console.log(region);
                            this._onRegionChangeComplete(region);
                        }}
                        initialRegion={this.state.userCurrentLocation}
                    >

                        {this._renderMarkers()}


                    </MapView>

                    <MyNavigator
                        screensList={[
                            HomeDriverScreen,
                            ServiceProcessScreen,
                        ]}
                        navigation={this.props.navigation}
                        index={this.state.currentScreenIndex}
                        screenProps={{
                            screenChange: index => this.setState({ currentScreenIndex: index }),
                            onMarkersListChanged: markersList => this.setState({ markersList }),
                        }}
                    />

                    {this._renderUserLocationFABIFNeeded()}


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
    map: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    fab: {
        position: 'absolute',
        backgroundColor: 'white',
        marginRight: 16,
        marginBottom: 88,
        right: 0,
        bottom: 0,
    },
});


export { DriverLaundryHomeScreen }