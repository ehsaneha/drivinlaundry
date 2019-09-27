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
import { withNavigationFocus } from 'react-navigation';

import OrderListItem from '../components/OrderListItem'
import HandleBackButton from '../components/HandleBackButton'
import DatabaseUtil from "../database/DatabaseUtil";
import OrderUtil from "../utils/OrderUtil";


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

        this.orderListPrevOffsetY = 0;

        DatabaseUtil.reloadHistoryFunc = this._reloadFABPressed;
        this.orderUtil = new OrderUtil();

        this._onItemPressed = this._onItemPressed.bind(this);

    }

    _getOrderIfExists = () => {
        this.orderUtil.getOrderByUserId(
            () => this.props.navigation.navigate('ServiceProcess'),
            this._reloadHistory,
            () => 
                this.setState({
                    reloadFABVisible: true,
                    loading: false,
                    addFABVisible: false,
                })
        );
    }

    _reloadHistory = () => {
        this.orderUtil.getAllClothingsOfOrdersByUserId(
            history => 
                this.setState({
                    history: history,
                    loading: false,
                    reloadFABVisible: true,
                    addFABVisible: true,
                }),
            () => 
                this.setState({
                    loading: false,
                    reloadFABVisible: true,
                    addFABVisible: false,
                })
        );
    }

    componentDidMount = () => {
        if (this.state.history.length === 0) {
            this._getOrderIfExists();
        }
        else {
            this.setState({
                loading: false,
                reloadFABVisible: true,
                addFABVisible: true,
            });
        }
    }


    _onItemPressed = (index) => {
        this.orderUtil.setClothings(this.state.history[index])
        this.props.navigation.navigate('Order');
    }

    _onOrderListScroll = (event) => {
        let currentOffsetY = event.nativeEvent.contentOffset.y;
        let downOrUp = (currentOffsetY < this.orderListPrevOffsetY);

        this.setState({
            reloadFABVisible: downOrUp,
            addFABVisible: downOrUp,
        });

        this.orderListPrevOffsetY = currentOffsetY;
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

    _renderEachOrderListItem = ({ item, index }) => {
        return (
            <OrderListItem
                itemInfo={item}
                index={index}
                onPressItem={this._onItemPressed}
            />
        );
    }

    _renderIfFlatlistIsEmpty = () => {
        return (
            <View style={styles.container}>
                <Text>
                    You have no history yet!
                </Text>
            </View>
        );
    }

    _renderLoadingOrFlatListIfHistoryExists = () => {
        const { loading, history } = this.state;
        if (loading) {
            return (
                <ActivityIndicator
                    style={{ marginTop: 200 }}
                    animating={true}
                    color={DefaultTheme.colors.primary}
                    size={'large'}
                />
            );
        }

        return (
            <FlatList
                data={history}
                renderItem={this._renderEachOrderListItem}
                ListEmptyComponent={this._renderIfFlatlistIsEmpty}
                keyExtractor={(item, index) => index + '_history'}
                onScroll={this._onOrderListScroll}
                scrollEventThrottle={16}
            />
        );

    }

    _renderAddFAB = () => {
        if (this.state.addFABVisible) {
            return (
                <FAB
                    color={'white'}
                    style={[styles.fab, { backgroundColor: DefaultTheme.colors.primary }]}
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
                    style={[styles.reloadFAB, { backgroundColor: DefaultTheme.colors.primary }]}
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
            <HandleBackButton>
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
                        <Appbar.Action icon="settings" onPress={() => this.props.navigation.navigate('Settings')} />
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
            </HandleBackButton>
        );
    }
};

export { HomeScreen };



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    card: {
        margin: 5,
    },
    fab: {
        position: 'absolute',
        marginRight: 16,
        marginBottom: 88,
        right: 0,
        bottom: 0,
    },
    reloadFAB: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});