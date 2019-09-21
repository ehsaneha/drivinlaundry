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

class LaundrySelectionScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            laundriesList: [],
            reloadFABVisible: false,
            loading: true,
        };

        this.selectedLaundry = { id: '', name: '', phone: '', avatar: '', cost: '' };
        this.itemsDeActivateFuncs = {};

        this.beforeNextFABPressed = this.beforeNextFABPressed.bind(this);
        this.onItemPressed = this.onItemPressed.bind(this);
    }

    _reloadLaundries = () => {
        const { latitude, longitude } = DatabaseUtil.data.order.location;
        NetworkUtil.getLaundries(latitude, longitude)
            .then((response) => {
                this.setState({
                    laundriesList: response,
                    reloadFABVisible: response.length > 0,
                    loading: false,
                });

                this.selectedLaundry = response[0];
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
        this._reloadLaundries();
    }

    beforeNextFABPressed = () => {
        if(this.state.laundriesList.length == 0) {
            ToastAndroid.show('You should choose at least one laundry!', ToastAndroid.LONG);
            return false;
        }

        DatabaseUtil.data.order.laundry = this.selectedLaundry;

        const {cost} = this.selectedLaundry;
        DatabaseUtil.data.order.laundry.cost = cost == '' ? '5' : cost;

        return true;
    }

    onItemPressed = (id, name, phone, avatar, cost) => {
        if (this.selectedLaundry.id === id)
            return;

        this.itemsDeActivateFuncs[this.selectedLaundry.id].deActivate();
        this.selectedLaundry = { id, name, phone, avatar, cost };
    }

    _reloadFABPressed = () => {
        this.setState({
            // laundriesList: [],
            reloadFABVisible: false,
            loading: true,
        }, 
        this._reloadLaundries);
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
                    data={this.state.laundriesList}
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
    },
    reloadFAB: {
        position: 'absolute',
        bottom: 0,
        margin: 16,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
});