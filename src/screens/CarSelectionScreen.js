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

import ClientsListItem from '../components/ClientsListItem'
import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'

class CarSelectionScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            driversList: [],
            reloadFABVisible: false,
            loading: true,
        };

        this.selectedDriver = { id: '', name: '', phone: '', avatar: '', cost: '' };
        this.itemsDeActivateFuncs = {};

        this.beforeNextFABPressed = this.beforeNextFABPressed.bind(this);
        this.onItemPressed = this.onItemPressed.bind(this);
    }

    _reloadDrivers = () => {
        const { latitude, longitude } = DatabaseUtil.data.order.location;
        NetworkUtil.getDrivers(latitude, longitude)
            .then((response) => {
                console.log(response);
                this.setState({
                    driversList: response,
                    reloadFABVisible: response.length > 0,
                    loading: false,
                });

                this.selectedDriver = response[0];
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
        if(this.state.driversList.length == 0) {
            ToastAndroid.show('You should choose at least one driver!', ToastAndroid.LONG);
            return false;
        }

        DatabaseUtil.data.order.driver = this.selectedDriver;

        const {cost} = this.selectedDriver;
        DatabaseUtil.data.order.driver.cost = cost == '' ? '5' : cost;

        return true;
    }

    onItemPressed = (id, name, phone, avatar, cost) => {
        if (this.selectedDriver.id === id)
            return;

        this.itemsDeActivateFuncs[this.selectedDriver.id].deActivate();
        this.selectedDriver = { id, name, phone, avatar, cost };
    }

    _reloadFABPressed = () => {
        this.setState({
            // driversList: [],
            reloadFABVisible: false,
            loading: true,
        }, 
        this._reloadDrivers);
    }

    _renderEachItem = ({ item }) => {
        return (
            <ClientsListItem
                key={'DriverListItem_' + item.id}
                itemInfo={item}
                iconName={'local-taxi'}
                onRef={ref => this.itemsDeActivateFuncs[item.id] = ref}
                onPressItem={this.onItemPressed}
                active={item.id === this.state.driversList[0].id}
                avatarSource={{ uri: NetworkUtil.getAvatarUri(item.avatar), cache: 'reload' }}
            />
        );
    }

    _renderFlatListOrActivityIndicator = () => {
        return this.state.loading ?
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
                    data={this.state.driversList}
                    renderItem={this._renderEachItem}
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

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.backgroundImage}
                    source={require('../assets/map.png')}
                />

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