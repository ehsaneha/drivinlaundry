import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image,
    ToastAndroid,
    FlatList
} from "react-native";
import LocationsListItem from '../components/LocationsListItem'

import DatabaseUtil from '../database/DatabaseUtil';
import GeolocationUtil from '../geolocation/GeolocationUtil'

class LocationSelectionScreen extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            locationsData: [
                { title: 'Current Location', key: 0, iconName: 'my-location', latitude: '0.232423', longitude: '1.2837287'},
                { title: 'Home', key: 1, iconName: '', latitude: '0.232423', longitude: '1.2837287'},
                { title: 'Office', key: 2, iconName: '', latitude: '0.232423', longitude: '1.2837287'},
                { title: 'Title Text', key: 3, iconName: '', latitude: '0.232423', longitude: '1.2837287'},
                { title: 'Title Text', key: 4, iconName: '', latitude: '0.232423', longitude: '1.2837287'},
                { title: 'Title Text', key: 5, iconName: '', latitude: '0.232423', longitude: '1.2837287'},
                { title: 'Title Text', key: 6, iconName: '', latitude: '0.232423', longitude: '1.2837287'},
                { title: 'Title Text', key: 7, iconName: '', latitude: '0.232423', longitude: '1.2837287' }
            ],
            userLocation: null,
        };
        
        this.latitude = this.state.locationsData[0].latitude;
        this.longitude = this.state.locationsData[0].longitude;
        this.itemsDeActivateFuncs = {};
        this.activeIndex = 0;

        this.beforeNextFABPressed = this.beforeNextFABPressed.bind(this);
        this.onItemPressed = this.onItemPressed.bind(this);
    }

    componentDidMount = () => {
        this.props.screenProps(this);
        this._getLocation();
    }
    
    _getLocation = () => {
        GeolocationUtil.checkLocationPermission()
            .then(isAutherized => {

                if (isAutherized) {
                    GeolocationUtil.getLocation(
                        (position) => {
                            console.log(position);
                            this.setState({
                                userLocation: {
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    latitudeDelta: 0.045,
                                    longitudeDelta: 0.045,
                                }
                            });
                        },
                        (error) => {
                            console.log(error.code, error.message);
                            ToastAndroid.show('Location Problem!', ToastAndroid.LONG);
                        }
                    );
                }
                else ToastAndroid.show('Location Permission Problem!', ToastAndroid.LONG);
            });
    }
    
    beforeNextFABPressed = () => {
        DatabaseUtil.data.order.location.latitude = this.latitude;
        DatabaseUtil.data.order.location.longitude = this.longitude;

        return true;
    }

    onItemPressed = (latitude, longitude, key) => {
        if(this.activeIndex === key) 
            return;

        this.latitude = latitude;
        this.longitude = longitude;

        this.itemsDeActivateFuncs[this.activeIndex].deActivate();
        this.activeIndex = key;
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

    render() {
        return (
            <View style={styles.container}>
                <Image 
                    style={styles.backgroundImage}
                    source={require('../assets/map.png')}
                />

                <FlatList
                    style={{position: 'absolute', marginTop: 70, marginLeft: 3}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.locationsData}
                    renderItem={this._renderEachItem}
                />
            </View>
        );
    }
}
export {LocationSelectionScreen};

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