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

class LaundrySelectionScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            laundriesList: [],
        };

        this.selectedDriver = { id: '', name: '', phone: '', avatar: '' };
        this.itemsDeActivateFuncs = {};

        this.beforeNextFABPressed = this.beforeNextFABPressed.bind(this);
        this.onItemPressed = this.onItemPressed.bind(this);
    }


    componentDidMount = () => {
        this.props.screenProps(this);

        const { latitude, longitude } = DatabaseUtil.data.order.location;
        NetworkUtil.getLaundries(latitude, longitude)
            .then((response) => {
                this.setState({
                    laundriesList: response,
                });

                this.selectedDriver = response[0];
            })
    }

    beforeNextFABPressed = () => {
        if(this.state.laundriesList.length == 0) return false;

        DatabaseUtil.data.order.laundry = this.selectedDriver;
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
                key={'LaundryListItem_' + item.id}
                itemInfo={item}
                iconName={'local-taxi'}
                onRef={ref => this.itemsDeActivateFuncs[item.id] = ref}
                onPressItem={this.onItemPressed}
                active={item.id === this.state.laundriesList[0].id}
            />
        );
    }

    _renderFlatListOrActivityIndicator = () => {
        return this.state.laundriesList.length === 0 ?
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
                    data={this.state.laundriesList}
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
export {LaundrySelectionScreen};

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