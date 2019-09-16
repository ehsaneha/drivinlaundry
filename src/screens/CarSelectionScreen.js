import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList
} from "react-native";
import { ActivityIndicator, DefaultTheme } from 'react-native-paper';

import ClientsListItem from '../components/ClientsListItem'
import NetworkUtil from '../network/NetworkUtil'
import DatabaseUtil from '../database/DatabaseUtil'

class CarSelectionScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            driversList: [],
        };

        this.selectedDriver = { id: '', name: '', phone: '', avatar: '' };
        this.itemsDeActivateFuncs = {};

        this.beforeNextFABPressed = this.beforeNextFABPressed.bind(this);
        this.onItemPressed = this.onItemPressed.bind(this);
    }


    componentDidMount = () => {
        this.props.screenProps(this);

        const { latitude, longitude } = DatabaseUtil.data.order.location;
        NetworkUtil.getDrivers(latitude, longitude)
            .then((response) => {
                this.setState({
                    driversList: response,
                });

                this.selectedDriver = response[0];
            });
    }

    beforeNextFABPressed = () => {
        if(this.state.driversList.length == 0) return false;

        DatabaseUtil.data.order.driver = this.selectedDriver;
        return true;
    }

    onItemPressed = (id, name, phone, avatar) => {
        if (this.selectedDriver.id === id)
            return;

        this.itemsDeActivateFuncs[this.selectedDriver.id].deActivate();
        this.selectedDriver = { id, name, phone, avatar };
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
            />
        );
    }

    _renderFlatListOrActivityIndicator = () => {
        return this.state.driversList.length === 0 ?
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
            )
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.backgroundImage}
                    source={require('../assets/map.png')}
                />

                {this._renderFlatListOrActivityIndicator()}

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
    }
});