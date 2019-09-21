import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    BackHandler,
    Image,
    ToastAndroid,
} from "react-native";
import { Modal, Portal, Appbar, FAB, ActivityIndicator, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import OrderListItem from '../components/OrderListItem'
import ExitOnBackButton from '../components/ExitOnBackButton'
import DatabaseUtil from "../database/DatabaseUtil";
import NetworkUtil from "../network/NetworkUtil";

class HomeScreen extends Component {
    constructor() {
        super();

        this.state = {
            text: '',
            visible: false,
            loading: true,
            history: [],
            reloadFABVisible: false,
            addFABVisible: false,
        };

        this._onItemPressed = this._onItemPressed.bind(this);

    }

    _reloadHistory = () => {
        NetworkUtil.getAllClothingsOfOrdersByUserId(DatabaseUtil.data.setting)
            .then((response) => {
                console.log(response);
                DatabaseUtil.setHistoryFromResponse(response);
                console.log(DatabaseUtil.data.history);
                this.setState({
                    history: DatabaseUtil.data.history,
                    loading: false,
                    reloadFABVisible: response.length > 0,
                    addFABVisible: response.length > 0,
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
        if (this.state.history.length === 0) {
            this._reloadHistory();
        }
        else {
            this.setState({
                loading: false,
            });
        }


    }

    // _showModal = () => this.setState({ visible: true });
    // _hideModal = () => this.setState({ visible: false });

    _onItemPressed = (index) => {
        console.log(index);
        DatabaseUtil.data.order.clothings = this.state.history[index];
        this.props.navigation.navigate('Order');
    }

    _renderEachOrderListItem = ({ item, index }) => {
        return (
            <OrderListItem
                itemInfo={item}
                index={index}
                onPressItem={this._onItemPressed}
            />
        );
    }

    _renderLoadingOrFlatListIfHistoryExists = () => {
        const { loading, history } = this.state;
        if (loading) {
            console.log('loading');
            return (
                <ActivityIndicator
                    style={{ marginTop: 200 }}
                    animating={true}
                    color={DefaultTheme.colors.primary}
                    size={'large'}
                />
            );
        }
        else {
            return history ?
                (
                    <FlatList
                        data={history}
                        renderItem={this._renderEachOrderListItem}
                    />
                ) :
                (
                    <Text>
                        You have no history yet!
                    </Text>
                );

        }
    }

    _reloadFABPressed = () => {
        this.setState({
            // history: [],
            loading: true,
            reloadFABVisible: false,
            addFABVisible: false,
        },
        this._reloadHistory);
    }

    _renderAddFAB = () => {
        if (this.state.addFABVisible) {
            return (
                <FAB
                    color={'white'}
                    style={[styles.fab, {backgroundColor: DefaultTheme.colors.primary}]}
                    icon="add"
                    onPress={() => this.props.navigation.navigate('Order')}
                />
            );
        }
    }

    _renderReloadFAB = () => {
        if (this.state.reloadFABVisible) {
            return (
                <FAB
                    color={'white'}
                    style={[styles.reloadFAB, {backgroundColor: DefaultTheme.colors.primary}]}
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
            <ExitOnBackButton>
                <View style={{ flex: 1 }}>
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
                        <Appbar.Action icon="settings" onPress={() => this.props.navigation.push('Settings')} />
                    </Appbar.Header>

                    {this._renderLoadingOrFlatListIfHistoryExists()}

                    {/*  <Portal>
                        <Modal visible={this.state.visible} onDismiss={this._hideModal}>
                            <OrderDetailsModal itemInfo={itemInfo}/>
                        </Modal>
                    </Portal> */}

                   

                    {this._renderAddFAB()}
                    {this._renderReloadFAB()}

                    
                </View>
            </ExitOnBackButton>
        );
    }
};

export { HomeScreen };



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        margin: 5,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    reloadFAB: {
        position: 'absolute',
        marginRight: 16,
        marginBottom: 88,
        right: 0,
        bottom: 0,
    },
});