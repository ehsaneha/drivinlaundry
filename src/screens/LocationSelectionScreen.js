import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ToastAndroid,
    FlatList
} from "react-native";
import MapView, { Marker } from 'react-native-maps'

import LocationsListItem from '../components/LocationsListItem'
import DatabaseUtil from '../database/DatabaseUtil';
import GeolocationUtil from '../geolocation/GeolocationUtil'
import MarkerIcon from '../components/MarkerIcon'

class LocationSelectionScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            locationsData: [
                { title: 'Current Location', key: 0, iconName: 'my-location', latitude: '0.232423', longitude: '1.2837287' },
                { title: 'Home', key: 1, iconName: '', latitude: '0.232423', longitude: '1.2837287' },
                { title: 'Office', key: 2, iconName: '', latitude: '0.232423', longitude: '1.2837287' },
                { title: 'Title Text', key: 3, iconName: '', latitude: '0.232423', longitude: '1.2837287' },
                { title: 'Title Text', key: 4, iconName: '', latitude: '0.232423', longitude: '1.2837287' },
                { title: 'Title Text', key: 5, iconName: '', latitude: '0.232423', longitude: '1.2837287' },
                { title: 'Title Text', key: 6, iconName: '', latitude: '0.232423', longitude: '1.2837287' },
                { title: 'Title Text', key: 7, iconName: '', latitude: '0.232423', longitude: '1.2837287' }
            ],
            userLocation: null,
            // containerVisible: true,
        };

        // this.latitude = this.state.locationsData[0].latitude;
        // this.longitude = this.state.locationsData[0].longitude;
        this.itemsDeActivateFuncs = {};
        this.activeIndex = 0;

        this.location = {
            latitude: 0,
            longitude: 0,
        }


        this.beforeNextFABPressed = this.beforeNextFABPressed.bind(this);
        this.onItemPressed = this.onItemPressed.bind(this);
        // this._onRegionChange = this._onRegionChange.bind(this);
    }

    componentDidMount = () => {
        this.props.screenProps.setBeforeNextFABPressed(this.beforeNextFABPressed);
        // this.props.screenProps.toggleOpacity(this.toggleOpacity);
        // this._getLocation();
    }

    // toggleOpacity = () => {
    //     this.setState({ containerVisible: !this.state.containerVisible })
    // }

    // _getLocation = () => {
    //     new GeolocationUtil().getLocation(
    //         ({ latitude, longitude }) => {
    //             console.log({ latitude, longitude });

    //             // this.setState({
    //             //     userLocation: coords,
    //             // });

    //             this.location = { latitude, longitude, };
    //         }
    //     );

    // }

    beforeNextFABPressed = () => {
        // DatabaseUtil.data.order.location.latitude = this.latitude;
        // DatabaseUtil.data.order.location.longitude = this.longitude;
        
        // DatabaseUtil.data.order.location = this.location;

        // DatabaseUtil.data.setting.latitude = this.location.latitude;
        // DatabaseUtil.data.setting.longitude = this.location.longitude;
        return true;
    }

    onItemPressed = (latitude, longitude, index) => {
        if (this.activeIndex === index)
            return;

        // this.latitude = latitude;
        // this.longitude = longitude;

        this.itemsDeActivateFuncs[this.activeIndex].deActivate();
        this.activeIndex = index;
    }

    _renderEachItem = ({ item }) => {
        return (
            <LocationsListItem
                key={'LocationListItem_' + item.key}
                itemInfo={item}
                onPressItem={this.onItemPressed}
                onRef={ref => this.itemsDeActivateFuncs[item.key] = ref}
                active={item.key === 0}
            />
        );
    }

    // _onRegionChange({ latitude, longitude }) {
    //     this.location = { latitude, longitude, };
    // }

    render() {
        const { userLocation, locationsData, containerVisible } = this.state;

        // if (containerVisible) {
            return (
                <View style={styles.container} pointerEvents="none">
                    {/* <Image 
                    style={styles.backgroundImage}
                    source={require('../assets/map.png')}
                /> */}



                    {/* <MapView
                    style={{ flex: 1 }}
                    showsUserLocation={true}
                    showsCompass={true}
                    rotateEnabled={false}
                    initialRegion={this.location}
                    onRegionChange={this._onRegionChange}

                /> */}

                    <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                        <MarkerIcon pointerEvents="none" iconName='person' offset active />
                    </View>
                    {/* {userLocation ? (
                        <View pointerEvents="none" style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', zIndex: 200}}>
                    <Marker
                        pointerEvents="none"
                        coordinate={{
                            latitude: 29.62546573,
                            longitude: 52.52327648
                        }}
                    />
                    </View>
                    ) : null} */}
                    {/* <FlatList
                    style={{position: 'absolute', marginTop: 70, marginLeft: 3}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={locationsData}
                    renderItem={this._renderEachItem}
                /> */}
                </View>
            );
        // }

        // return null;

    }
}
export { LocationSelectionScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch',
        width: null,
    }
});