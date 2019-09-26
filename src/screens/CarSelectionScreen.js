import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ToastAndroid,
    FlatList
} from "react-native";
import { ActivityIndicator, DefaultTheme, FAB, } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps'

import ClientsListItem from '../components/ClientsListItem'
import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'
import GeolocationUtil from '../geolocation/GeolocationUtil'
import MarkerIcon from '../components/MarkerIcon'

class CarSelectionScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            driversList: [],
            reloadFABVisible: false,
            loading: true,
            selectedIndex: 0,
        };

        this.itemsDeActivateFuncs = {};

        this.beforeNextFABPressed = this.beforeNextFABPressed.bind(this);
        this.onItemPressed = this.onItemPressed.bind(this);
        this._renderMarkers = this._renderMarkers.bind(this);
    }




    _reloadDrivers = () => {
        const { latitude, longitude } = DatabaseUtil.data.order.location;
        NetworkUtil.getDrivers(latitude, longitude)
            .then((response) => {
                console.log(response);
                this.setState({
                    driversList: response,
                    reloadFABVisible: true,
                    loading: false,
                    selectedIndex: 0,
                });

            })
            .catch((error) => {
                ToastAndroid.show('Network Problem!', ToastAndroid.LONG);
                this.setState({
                    loading: false,
                    reloadFABVisible: true,
                });
            });
    }

    componentDidMount = () => {
        this.props.screenProps(this);
        this._reloadDrivers();
    }


    beforeNextFABPressed = () => {
        const {driversList, selectedIndex} = this.state;
        if (driversList.length == 0) {
            ToastAndroid.show('You should choose at least one driver!', ToastAndroid.LONG);
            return false;
        }

        DatabaseUtil.data.order.driver = driversList[selectedIndex];

        const { cost } = driversList[selectedIndex];
        DatabaseUtil.data.order.driver.cost = cost == '' ? '5' : cost;

        return true;
    }

    onItemPressed = (index) => {
        const {selectedIndex} = this.state;
        if (selectedIndex === index)
            return;

        this.itemsDeActivateFuncs[selectedIndex].deActivate();
        this.setState({selectedIndex: index});
    }

    _reloadFABPressed = () => {
        this.setState({
            reloadFABVisible: false,
            loading: true,
        },
            this._reloadDrivers);
    }

    _renderEachItem = ({ item, index }) => {
        return (
            <ClientsListItem
                itemInfo={item}
                iconName={'local-taxi'}
                onRef={ref => this.itemsDeActivateFuncs[index] = ref}
                onPressItem={this.onItemPressed}
                active={this.state.selectedIndex === index}
                avatarSource={{ uri: NetworkUtil.getAvatarUri(item.avatar), cache: 'reload' }}
                avatar={item.avatar}
                index={index}
            />
        );
    }

    _renderIfFlatlistIsEmpty = () => {
        return (
            <View>
                <Text>
                    We could not find any drivers!
                </Text>
            </View>
        );
    }

    _renderFlatListOrActivityIndicator = () => {
        const { loading, driversList } = this.state;

        return loading ?
            (
                <View style={{ position: "absolute", marginTop: 90, left: 0, right: 0, alignItems: "center" }}>
                    <ActivityIndicator
                        animating={true}
                        color={DefaultTheme.colors.primary}
                        size={'large'}
                    />
                </View>
            ) :
            (
                <FlatList
                    style={{ position: 'absolute', marginTop: 70, marginLeft: 3 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={driversList}
                    renderItem={this._renderEachItem}
                    keyExtractor={(item, index) => index + '_drivers'}
                    ListEmptyComponent={this._renderIfFlatlistIsEmpty}
                />
            );
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

    _renderMarkers = () => {
        const {driversList, selectedIndex} = this.state;

        return driversList.map((each, index) => {
            if (index < 3) {
                return (
                    <Marker
                        key={index + '_EachCarMarker'}
                        coordinate={{
                            latitude: parseFloat(each.latitude),
                            longitude: parseFloat(each.longitude),
                        }}
                    >
                        <MarkerIcon iconName='local-taxi' active={selectedIndex === index}/>
                    </Marker>
                );
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <Image
                    style={styles.backgroundImage}
                    source={require('../assets/map.png')}
                /> */}

                {/* <MapView
                    style={{ flex: 1 }}
                    showsUserLocation={true}
                    showsCompass={true}
                    rotateEnabled={false}
                // initialRegion={GeolocationUtil.userLocation}
                > 

                    {this._renderMarkers()}
                 

                </MapView>*/}

                {this._renderFlatListOrActivityIndicator()}

                {this._renderReloadFAB()}

            </View>
        );
    }
}
export { CarSelectionScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    emptyListContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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